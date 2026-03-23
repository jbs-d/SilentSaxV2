import { ParsedNote, NoteName } from '../types';

/**
 * Placeholder recognition service.
 * Accepts an image URI and returns a sequence of ParsedNotes.
 *
 * Replace the body of this function with a real OMR implementation
 * when available. The signature and return type must stay the same.
 */
export async function recognizeSheetMusic(imageUri: string): Promise<ParsedNote[]> {
  // Simulate async processing delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Placeholder: a simple C-major scale melody
  const sequence: Array<{ name: NoteName; octave: number }> = [
    { name: 'C', octave: 4 },
    { name: 'D', octave: 4 },
    { name: 'E', octave: 4 },
    { name: 'F', octave: 4 },
    { name: 'G', octave: 4 },
    { name: 'A', octave: 4 },
    { name: 'B', octave: 4 },
    { name: 'C', octave: 5 },
  ];

  return sequence.map((note, index) => ({
    id: `placeholder-${index}`,
    name: note.name,
    octave: note.octave,
    midiNote: noteToMidi(note.name, note.octave),
    position: index,
    confidence: 0, // placeholder — no real confidence
  }));
}

/** Maps a note name and octave to a MIDI note number. */
function noteToMidi(name: NoteName, octave: number): number {
  const semitones: Record<string, number> = {
    C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3,
    E: 4, Fb: 4, F: 5, 'F#': 6, Gb: 6, G: 7,
    'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11,
  };
  return (octave + 1) * 12 + semitones[name];
}
