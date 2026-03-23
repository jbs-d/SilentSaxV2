import { ParsedNote, SheetMusicContext, NoteName } from '../types';

// ─── Interval constants ───────────────────────────────────────────────────────
//
// These represent how many semitones BELOW the written note the concert pitch
// sounds, for each sheet music context.
//
//   Alto  (Eb): written C → concert Eb, which is a major 6th BELOW written
//               written − 9 semitones = concert pitch
//
//   Tenor (Bb): written C → concert Bb, which is a major 9th BELOW written
//               written − 14 semitones = concert pitch
//
//   Concert: written note IS the concert pitch, no offset.
//
const WRITTEN_TO_CONCERT_SEMITONES: Record<SheetMusicContext, number> = {
  concert: 0,
  alto: -9,
  tenor: -14,
};

// ─── Chromatic helpers ────────────────────────────────────────────────────────

/** Sharp-based chromatic scale. Used for MIDI → name conversion. */
const CHROMATIC: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

/**
 * Converts a MIDI note number to { name, octave }.
 * MIDI 60 = C4, MIDI 0 = C-1.
 * Guards against negative MIDI values from heavy transposition.
 */
function midiToNote(midi: number): { name: NoteName; octave: number } {
  const clamped = Math.max(0, midi);
  const semitone = clamped % 12;
  const octave = Math.floor(clamped / 12) - 1;
  return { name: CHROMATIC[semitone], octave };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Given an array of written notes and the context they were written in,
 * returns the corresponding concert-pitch notes.
 *
 * The input notes are NOT mutated. Returns a new array.
 *
 * If context is 'concert', the returned array is a shallow clone of the input
 * (written note = concert pitch, no transformation needed).
 *
 * Example (Alto context):
 *   written C4 (MIDI 60) → concert Eb3 (MIDI 51)
 *
 * Example (Tenor context):
 *   written C4 (MIDI 60) → concert Bb2 (MIDI 46)
 */
export function writtenToConcert(
  writtenNotes: ParsedNote[],
  context: SheetMusicContext,
): ParsedNote[] {
  const offset = WRITTEN_TO_CONCERT_SEMITONES[context];

  if (offset === 0) {
    return writtenNotes.map((n) => ({ ...n }));
  }

  return writtenNotes.map((note) => {
    const concertMidi = note.midiNote + offset;
    const { name, octave } = midiToNote(concertMidi);
    return { ...note, name, octave, midiNote: concertMidi };
  });
}

/**
 * Returns a human-readable label for the sheet music context.
 * Used in UI selectors and note display headers.
 */
export function contextLabel(context: SheetMusicContext): string {
  switch (context) {
    case 'concert': return 'Concert pitch';
    case 'alto':    return 'Alto Sax (Eb)';
    case 'tenor':   return 'Tenor Sax (Bb)';
  }
}
