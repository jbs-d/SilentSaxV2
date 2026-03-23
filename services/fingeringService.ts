import { ParsedNote, SaxophoneFingering } from '../types';
import { getFingeringForNote } from '../data/fingeringData';

/**
 * Looks up the standard fingering for a written note.
 *
 * Fingering is keyed by written note (name + octave).
 * Returns null if the note is outside the supported range.
 *
 * Note: saxophone fingerings are identical across alto, tenor, soprano,
 * and baritone — the same keywork layout is used on all standard saxophones.
 */
export function getFingering(note: ParsedNote): SaxophoneFingering | null {
  return getFingeringForNote(note.name, note.octave) ?? null;
}

/**
 * Produces a compact, human-readable fingering summary.
 *
 * Format: "Oct · L:1-2-3 · R:1-2" where numbers are closed finger positions
 * (1=index, 2=middle, 3=ring). Side keys (pinky) noted separately.
 * Palm and low keys shown only when active.
 *
 * Example outputs:
 *   "Oct · L:1-2-3 · R:1-2"       — C4
 *   "Oct · L:1-2-3 · R:open"      — E4
 *   "Oct · L:1-2 · R:1-2-3"       — F4 (fork)
 *   "Oct · L:1-2 · R:open"        — G4
 */
export function fingeringSummary(f: SaxophoneFingering): string {
  const parts: string[] = [];

  if (f.octaveKey.pressed) {
    parts.push('Oct');
  }

  const lhFingers = closedFingers(
    f.leftHand.index, f.leftHand.middle, f.leftHand.ring,
  );
  const lhPinky = f.leftHand.pinky === 'closed' ? '+side' : '';
  parts.push(`L:${lhFingers || 'open'}${lhPinky}`);

  const rhFingers = closedFingers(
    f.rightHand.index, f.rightHand.middle, f.rightHand.ring,
  );
  const rhPinky = f.rightHand.pinky === 'closed' ? '+side' : '';
  parts.push(`R:${rhFingers || 'open'}${rhPinky}`);

  const palmActive = [
    f.palmKeys.d === 'closed' && 'palmD',
    f.palmKeys.dSharp === 'closed' && 'palmD#',
    f.palmKeys.f === 'closed' && 'palmF',
  ].filter(Boolean);
  if (palmActive.length) parts.push(palmActive.join('+'));

  const lowActive = [
    f.lowKeys.c === 'closed' && 'lowC',
    f.lowKeys.b === 'closed' && 'lowB',
    f.lowKeys.bFlat === 'closed' && 'lowBb',
  ].filter(Boolean);
  if (lowActive.length) parts.push(lowActive.join('+'));

  return parts.join(' · ');
}

/** Returns finger numbers (1=index, 2=middle, 3=ring) for closed keys. */
function closedFingers(
  index: string, middle: string, ring: string,
): string {
  const closed: string[] = [];
  if (index === 'closed') closed.push('1');
  if (middle === 'closed') closed.push('2');
  if (ring === 'closed') closed.push('3');
  return closed.join('-');
}
