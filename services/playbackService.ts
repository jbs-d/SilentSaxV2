import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import type { ParsedNote } from '../types';

// ─── Note → frequency ─────────────────────────────────────────────────────

const SEMITONES: Record<string, number> = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5,
  'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
};

function noteToMidi(name: string, octave: number): number {
  return (octave + 1) * 12 + (SEMITONES[name] ?? 0);
}

function midiToFrequency(midi: number): number {
  // Equal temperament: A4 = 440 Hz = MIDI 69
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ─── WAV generator ────────────────────────────────────────────────────────

const BASE64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Encode a Uint8Array to a base64 string without relying on btoa. */
function uint8ToBase64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += BASE64_CHARS[b0 >> 2];
    out += BASE64_CHARS[((b0 & 3) << 4) | (b1 >> 4)];
    out += i + 1 < bytes.length ? BASE64_CHARS[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    out += i + 2 < bytes.length ? BASE64_CHARS[b2 & 63] : '=';
  }
  return out;
}

function writeStr(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

/**
 * Builds a mono 16-bit PCM WAV file containing a sine wave at the given
 * frequency and duration, returned as a base64 string.
 *
 * A 20 ms fade-in/out prevents audible clicks at note boundaries.
 */
function buildWavBase64(frequency: number, durationMs: number): string {
  const SR = 22050;
  const numSamples = Math.floor(SR * durationMs / 1000);
  const dataSize = numSamples * 2; // 16-bit = 2 bytes / sample
  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);

  // RIFF/WAVE header
  writeStr(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(view, 8, 'WAVE');
  // fmt chunk
  writeStr(view, 12, 'fmt ');
  view.setUint32(16, 16, true);     // chunk size
  view.setUint16(20, 1, true);      // PCM
  view.setUint16(22, 1, true);      // mono
  view.setUint32(24, SR, true);     // sample rate
  view.setUint32(28, SR * 2, true); // byte rate
  view.setUint16(32, 2, true);      // block align
  view.setUint16(34, 16, true);     // bits per sample
  // data chunk
  writeStr(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const fadeSamples = Math.floor(SR * 0.02); // 20 ms
  for (let i = 0; i < numSamples; i++) {
    let amp = 0.6;
    if (i < fadeSamples) amp *= i / fadeSamples;
    if (i > numSamples - fadeSamples) amp *= (numSamples - i) / fadeSamples;
    const sample = Math.sin((2 * Math.PI * frequency * i) / SR) * amp;
    view.setInt16(44 + i * 2, Math.round(sample * 32767), true);
  }

  return uint8ToBase64(new Uint8Array(buf));
}

// ─── Playback state ───────────────────────────────────────────────────────

// Reuse a single temp file; safe because notes play sequentially.
const TEMP_WAV = (FileSystem.cacheDirectory ?? '') + 'silentsax_note.wav';

let activeSound: Audio.Sound | null = null;
let stopRequested = false;
let resolveWait: (() => void) | null = null;

/** Wait for ms milliseconds, but can be interrupted by stopPlayback(). */
function waitMs(ms: number): Promise<void> {
  return new Promise(resolve => {
    resolveWait = resolve;
    setTimeout(() => {
      resolveWait = null;
      resolve();
    }, ms);
  });
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Stop any in-progress playback immediately.
 * Safe to call even if nothing is playing.
 */
export function stopPlayback(): void {
  stopRequested = true;
  // Interrupt the current inter-note wait
  resolveWait?.();
  resolveWait = null;
  // Stop and unload the active sound
  activeSound?.stopAsync().catch(() => {});
  activeSound?.unloadAsync().catch(() => {});
  activeSound = null;
}

/**
 * Play an array of ParsedNotes sequentially, one per noteDurationMs.
 * Each note is converted to a sine-wave WAV and played via expo-av.
 *
 * @param notes          Written notes to play (order preserved).
 * @param noteDurationMs Slot duration per note in ms (default 500).
 * @param onNoteStart    Optional callback called with the note index when each note begins.
 */
export async function playNotes(
  notes: ParsedNote[],
  noteDurationMs = 500,
  onNoteStart?: (index: number) => void,
): Promise<void> {
  stopRequested = false;

  // Allow playback through the iOS silent switch
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  for (let i = 0; i < notes.length; i++) {
    if (stopRequested) break;

    onNoteStart?.(i);

    const { name, octave } = notes[i];
    const freq = midiToFrequency(noteToMidi(name, octave));
    // Leave a 50 ms gap between notes so they are audibly distinct
    const wavB64 = buildWavBase64(freq, Math.max(80, noteDurationMs - 50));

    // Write WAV to disk (expo-av on iOS/Android requires a file URI)
    await FileSystem.writeAsStringAsync(TEMP_WAV, wavB64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { sound } = await Audio.Sound.createAsync({ uri: TEMP_WAV });
    activeSound = sound;
    await sound.playAsync();
    await waitMs(noteDurationMs);

    // Clean up — errors here are non-fatal (stop may have already unloaded)
    activeSound = null;
    await sound.stopAsync().catch(() => {});
    await sound.unloadAsync().catch(() => {});

    if (stopRequested) break;
  }

  stopRequested = false;
}
