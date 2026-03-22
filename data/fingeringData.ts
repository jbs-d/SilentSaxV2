/**
 * Saxophone Fingering Data
 * Complete fingering charts for Alto and Tenor saxophones
 *
 * Note: These fingerings are the SAME for both alto and tenor saxophones
 * because they use the same fingerings - the instruments just sound different pitches
 * when playing the same written note.
 */

import { SaxophoneFingering, NoteName, MusicalNote, SaxophoneType, KeyPosition } from '../types';

// Helper to create closed keys
const closed = (): KeyPosition >> 'closed';
const open = (): KeyPosition >> 'open';
const pressed = true;
const released = false;

/**
 * Generate a unique ID for a note
 */
function noteId(name: NoteName, octave: number): string {
  return `${name}-${octave}`;
}

/**
 * Create a MusicalNote object
 */
function createNote(name: NoteName, octave: number, midiNote: number): MusicalNote {
  return {
    id: noteId(name, octave),
    name,
    octave,
    midiNote,
    position: 0,
  };
}

/**
 * ALTO SAXOPHONE FINGERINGS
 * Range: Low Bb (midi 58) to High F# (midi 90)
 * Note: Alto fingerings are identical to tenor fingerings for the same written note
 */
export const ALTO_FINGERINGS: Map<string, SaxophoneFingering> = new Map([
  // Low Bb (midi 58)
  ['Bb-3', {
    note: createNote('Bb', 3, 58),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: closed() },
  }],
  // Low B (midi 59)
  ['B-3', {
    note: createNote('B', 3, 59),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: closed(), bFlat: open() },
  }],
  // Low C (midi 60)
  ['C-4', {
    note: createNote('C', 4, 60),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: closed(), b: open(), bFlat: open() },
  }],
  // C# (midi 61) - uses side key typically, but also a standard fingering
  ['C#-4', {
    note: createNote('C#', 4, 61),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: closed(), b: open(), bFlat: open() },
  }],
  // Low D (midi 62)
  ['D-4', {
    note: createNote('D', 4, 62),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // Eb (midi 63)
  ['Eb-4', {
    note: createNote('Eb', 4, 63),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // Low E (midi 64)
  ['E-4', {
    note: createNote('E', 4, 64),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // F (midi 65)
  ['F-4', {
    note: createNote('F', 4, 65),
    octaveKey: { pressed: released },
    leftHand: { index: open(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // F# (midi 66)
  ['F#-4', {
    note: createNote('F#', 4, 66),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: open(), middle: closed(), ring: closed(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // Low G (midi 67)
  ['G-4', {
    note: createNote('G', 4, 67),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // G# / Ab (midi 68)
  ['G#-4', {
    note: createNote('G#', 4, 68),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: open(), ring: open(), pinky: closed() },
    rightHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // Low A (midi 69)
  ['A-4', {
    note: createNote('A', 4, 69),
    octaveKey: { pressed: released },
    leftHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // A# / Bb (midi 70)
  ['Bb-4', {
    note: createNote('Bb', 4, 70),
    octaveKey: { pressed: released },
    leftHand: { index: open(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // Low B (midi 71)
  ['B-4', {
    note: createNote('B', 4, 71),
    octaveKey: { pressed: released },
    leftHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // Middle C / C5 (midi 72)
  ['C-5', {
    note: createNote('C', 5, 72),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // C#5 (midi 73)
  ['C#-5', {
    note: createNote('C#', 5, 73),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // D5 (midi 74)
  ['D-5', {
    note: createNote('D', 5, 74),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // D#5 / Eb5 (midi 75)
  ['Eb-5', {
    note: createNote('Eb', 5, 75),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: closed() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // E5 (midi 76)
  ['E-5', {
    note: createNote('E', 5, 76),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // F5 (midi 77)
  ['F-5', {
    note: createNote('F', 5, 77),
    octaveKey: { pressed: pressed },
    leftHand: { index: open(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // F#5 (midi 78)
  ['F#-5', {
    note: createNote('F#', 5, 78),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: open(), middle: closed(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // G5 (midi 79)
  ['G-5', {
    note: createNote('G', 5, 79),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // G#5 (midi 80)
  ['G#-5', {
    note: createNote('G#', 5, 80),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: open(), ring: open(), pinky: closed() },
    rightHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // A5 (midi 81)
  ['A-5', {
    note: createNote('A', 5, 81),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // A#5 / Bb5 (midi 82)
  ['Bb-5', {
    note: createNote('Bb', 5, 82),
    octaveKey: { pressed: pressed },
    leftHand: { index: open(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // B5 (midi 83)
  ['B-5', {
    note: createNote('B', 5, 83),
    octaveKey: { pressed: pressed },
    leftHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // C6 (midi 84)
  ['C-6', {
    note: createNote('C', 6, 84),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: open() },
    rightHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // C#6 (midi 85)
  ['C#-6', {
    note: createNote('C#', 6, 85),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: closed(), pinky: closed() },
    rightHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // D6 (midi 86)
  ['D-6', {
    note: createNote('D', 6, 86),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // D#6 / Eb6 (midi 87)
  ['Eb-6', {
    note: createNote('Eb', 6, 87),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: closed(), ring: open(), pinky: open() },
    rightHand: { index: open(), middle: open(), ring: open(), pinky: closed() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // E6 (midi 88)
  ['E-6', {
    note: createNote('E', 6, 88),
    octaveKey: { pressed: pressed },
    leftHand: { index: closed(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // F6 (midi 89)
  ['F-6', {
    note: createNote('F', 6, 89),
    octaveKey: { pressed: pressed },
    leftHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: open(), f: closed() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
  // F#6 / Gb6 (midi 90)
  ['F#-6', {
    note: createNote('F#', 6, 90),
    octaveKey: { pressed: pressed },
    leftHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    rightHand: { index: open(), middle: open(), ring: open(), pinky: open() },
    palmKeys: { d: open(), dSharp: closed(), f: open() },
    lowKeys: { c: open(), b: open(), bFlat: open() },
  }],
]);

/**
 * TENOR SAXOPHONE FINGERINGS
 * The fingerings are the SAME as alto for written notes
 * The key difference is the pitch that comes out
 */
export const TENOR_FINGERINGS: Map<string, SaxophoneFingering> = ALTO_FINGERINGS;

/**
 * Get fingering data for a specific saxophone type
 */
export function getFingeringData(type: SaxophoneType): Map<string, SaxophoneFingering> {
  // All saxophones use the same fingerings for written notes
  return ALTO_FINGERINGS;
}

/**
 * Look up fingering for a note
 */
export function getFingeringForNote(
  noteName: NoteName,
  octave: number,
  saxophoneType: SaxophoneType = 'alto'
): SaxophoneFingering | undefined {
  const key = `${noteName}-${octave}`;
  const fingeringData = getFingeringData(saxophoneType);
  return fingeringData.get(key);
}

/**
 * Get fingering by MIDI note number
 */
export function getFingeringByMidiNote(
  midiNote: number,
  saxophoneType: SaxophoneType = 'alto'
): SaxophoneFingering | undefined {
  const fingeringData = getFingeringData(saxophoneType);
  for (const fingering of fingeringData.values()) {
    if (fingering.note.midiNote === midiNote) {
      return fingering;
    }
  }
  return undefined;
}

/**
 * Get all available notes for a saxophone type
 */
export function getAllNotes(saxophoneType: SaxophoneType = 'alto'): MusicalNote[] {
  const fingeringData = getFingeringData(saxophoneType);
  return Array.from(fingeringData.values()).map(f => f.note);
}

/**
 * Check if a note is in the playable range for a saxophone
 */
export function isNoteInRange(
  note: MusicalNote,
  saxophoneType: SaxophoneType = 'alto'
): boolean {
  const fingeringData = getFingeringData(saxophoneType);
  return fingeringData.has(`${note.name}-${note.octave}`);
}
