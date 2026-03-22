/**
 * SilentSax Type Definitions
 * Core types for the saxophone learning app
 */

// ============================================
// Note & Music Types
// ============================================

export type NoteName = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'Fb' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B' | 'Cb';

export interface MusicalNote {
  id: string;
  name: NoteName;
  octave: number;
  midiNote: number; // MIDI note number (0-127)
  duration?: number; // Duration in beats (optional for MVP)
  position: number; // Order in the sequence
}

export interface ParsedNote extends MusicalNote {
  confidence?: number; // Recognition confidence (0-1)
}

// ============================================
// Saxophone Types
// ============================================

export type SaxophoneType = 'alto' | 'tenor' | 'soprano' | 'baritone';

export interface SaxophoneConfig {
  type: SaxophoneType;
  name: string;
  transposition: {
    // How many semitones to transpose from concert pitch
    // Negative = transpose down, Positive = transpose up
    semitones: number;
  };
  range: {
    lowest: MusicalNote;
    highest: MusicalNote;
  };
}

// ============================================
// Fingering Types
// ============================================

export type KeyPosition = 'open' | 'closed' | 'half';

export interface LeftHandKeys {
  index: KeyPosition;      // First finger
  middle: KeyPosition;     // Second finger
  ring: KeyPosition;       // Third finger
  pinky: KeyPosition;      // Pinky keys (Bb, etc.)
}

export interface RightHandKeys {
  index: KeyPosition;      // First finger
  middle: KeyPosition;     // Second finger
  ring: KeyPosition;       // Third finger
  pinky: KeyPosition;      // Pinky keys (E, etc.)
}

export interface PalmKeys {
  d: KeyPosition;          // D palm key
  dSharp: KeyPosition;     // D# palm key
  f: KeyPosition;          // F palm key (high)
}

export interface LowKeys {
  c: KeyPosition;          // Low C
  b: KeyPosition;          // Low B
  bFlat: KeyPosition;      // Low Bb
}

export interface OctaveKey {
  pressed: boolean;
}

export interface SaxophoneFingering {
  note: MusicalNote;
  octaveKey: OctaveKey;
  leftHand: LeftHandKeys;
  rightHand: RightHandKeys;
  palmKeys: PalmKeys;
  lowKeys: LowKeys;
  alternateFingerings?: SaxophoneFingering[];
}

// ============================================
// Sheet Music Types
// ============================================

export type SheetMusicFormat = 'image' | 'pdf';

export interface SheetMusicFile {
  id: string;
  uri: string;
  name: string;
  format: SheetMusicFormat;
  size?: number;
  createdAt: Date;
}

export interface ParsedSheetMusic {
  id: string;
  sourceFile: SheetMusicFile;
  notes: ParsedNote[];
  title?: string;
  composer?: string;
  keySignature?: string;
  timeSignature?: string;
  tempo?: number;
  parsedAt: Date;
  // For MVP: if true recognition failed, this is simulated/mock data
  isSimulated: boolean;
}

// ============================================
// Playback Types
// ============================================

export type PlaybackState = 'stopped' | 'playing' | 'paused' | 'loading';

export interface PlaybackSettings {
  tempo: number; // BPM
  volume: number; // 0-1
  loop: boolean;
  instrument: 'saxophone' | 'piano' | 'synth'; // For MVP, may use synth
}

// ============================================
// Bluetooth/Hardware Types (Future)
// ============================================

export type BluetoothState = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'error';

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi?: number;
}

export interface HardwareFeedback {
  targetNote: MusicalNote;
  playedNote?: MusicalNote;
  isCorrect: boolean;
  timingAccuracy?: number; // How close to the beat (0-1)
}

// ============================================
// App State Types
// ============================================

export interface AppState {
  currentSaxophone: SaxophoneType;
  parsedSheetMusic: ParsedSheetMusic | null;
  playback: {
    state: PlaybackState;
    currentNoteIndex: number;
    settings: PlaybackSettings;
  };
  bluetooth: {
    state: BluetoothState;
    connectedDevice?: BluetoothDevice;
  };
}
