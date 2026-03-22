/**
 * Saxophone Configuration Data
 * Defines the characteristics of different saxophone types
 */

import { SaxophoneConfig, SaxophoneType } from '../types';

/**
 * ALTO SAXOPHONE (Eb)
 * - Written pitch is a major sixth above concert pitch
 * - Concert C = Alto A (transposed up 9 semitones)
 * - For playback: need to transpose UP 9 semitones (or DOWN 3)
 */
export const ALTO_SAX: SaxophoneConfig = {
  type: 'alto',
  name: 'Alto Saxophone (Eb)',
  transposition: {
    // To convert from concert pitch to alto sax written pitch:
    // Add 9 semitones (major sixth)
    // To convert from alto written to concert:
    // Subtract 9 semitones
    semitones: -9,
  },
  range: {
    lowest: {
      id: 'low-bb',
      name: 'Bb',
      octave: 3,
      midiNote: 58,
      position: 0,
    },
    highest: {
      id: 'high-f#',
      name: 'F#',
      octave: 6,
      midiNote: 90,
      position: 0,
    },
  },
};

/**
 * TENOR SAXOPHONE (Bb)
 * - Written pitch is a major ninth (octave + major second) above concert pitch
 * - Concert C = Tenor D (transposed up 2 semitones, plus octave)
 * - For playback: need to transpose UP 2 semitones (or DOWN 10)
 */
export const TENOR_SAX: SaxophoneConfig = {
  type: 'tenor',
  name: 'Tenor Saxophone (Bb)',
  transposition: {
    // To convert from concert pitch to tenor sax written pitch:
    // Add 2 semitones (major second) and an octave
    // To convert from tenor written to concert:
    // Subtract 2 semitones
    semitones: -2,
  },
  range: {
    lowest: {
      id: 'low-bb-tenor',
      name: 'Bb',
      octave: 2,
      midiNote: 46,
      position: 0,
    },
    highest: {
      id: 'high-f#-tenor',
      name: 'F#',
      octave: 5,
      midiNote: 78,
      position: 0,
    },
  },
};

/**
 * SOPRANO SAXOPHONE (Bb)
 * - Same transposition as tenor but one octave higher
 */
export const SOPRANO_SAX: SaxophoneConfig = {
  type: 'soprano',
  name: 'Soprano Saxophone (Bb)',
  transposition: {
    semitones: -2,
  },
  range: {
    lowest: {
      id: 'low-bb-soprano',
      name: 'Bb',
      octave: 3,
      midiNote: 58,
      position: 0,
    },
    highest: {
      id: 'high-f#-soprano',
      name: 'F#',
      octave: 6,
      midiNote: 90,
      position: 0,
    },
  },
};

/**
 * BARITONE SAXOPHONE (Eb)
 * - Same transposition as alto but one octave lower
 */
export const BARITONE_SAX: SaxophoneConfig = {
  type: 'baritone',
  name: 'Baritone Saxophone (Eb)',
  transposition: {
    semitones: -9,
  },
  range: {
    lowest: {
      id: 'low-bb-bari',
      name: 'Bb',
      octave: 1,
      midiNote: 34,
      position: 0,
    },
    highest: {
      id: 'high-f#-bari',
      name: 'F#',
      octave: 4,
      midiNote: 66,
      position: 0,
    },
  },
};

export const SAXOPHONE_CONFIGS: Record<SaxophoneType, SaxophoneConfig> = {
  alto: ALTO_SAX,
  tenor: TENOR_SAX,
  soprano: SOPRANO_SAX,
  baritone: BARITONE_SAX,
};

/**
 * Get configuration for a specific saxophone type
 */
export function getSaxophoneConfig(type: SaxophoneType): SaxophoneConfig {
  return SAXOPHONE_CONFIGS[type];
}

/**
 * Get transposition in semitones for a saxophone type
 * (How many semitones to adjust to get concert pitch from written pitch)
 */
export function getTranspositionSemitones(type: SaxophoneType): number {
  return SAXOPHONE_CONFIGS[type].transposition.semitones;
}
