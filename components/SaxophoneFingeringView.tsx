import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SaxophoneFingering, KeyPosition } from '../types';

// ─── Design tokens ────────────────────────────────────────────────────────────

const C_PRESSED       = '#f59e0b'; // amber gold — closed/pressed key
const C_OPEN_BG       = 'transparent';
const C_BORDER        = '#4b6a8a'; // open key border (muted blue-gray)
const C_OCT_ON        = '#ef4444'; // red when octave key active
const C_OCT_OFF       = '#1e3a50';
const C_LABEL         = '#6b8fa8'; // dim label text
const C_HAND_LABEL    = '#3d6280'; // "L" / "R" inside tube
const C_NOTE          = '#f1f5f9'; // note name headline
const C_TUBE_BG       = '#0d1f30'; // saxophone body
const C_TUBE_BORDER   = '#1e3a5f';
const C_BREAK         = '#060e18'; // darker band between hands
const C_CONTAINER     = '#091520';

// ─── Key primitives ───────────────────────────────────────────────────────────

interface CircleKeyProps {
  position: KeyPosition;
  label: string;
  size?: number;
}

function CircleKey({ position, label, size = 32 }: CircleKeyProps) {
  const pressed = position === 'closed';
  return (
    <View style={kst.wrapper}>
      <View
        style={[
          kst.circle,
          { width: size, height: size, borderRadius: size / 2 },
          pressed ? kst.pressed : kst.open,
        ]}
      />
      <Text style={kst.label}>{label}</Text>
    </View>
  );
}

interface RectKeyProps {
  position: KeyPosition;
  label: string;
}

function RectKey({ position, label }: RectKeyProps) {
  const pressed = position === 'closed';
  return (
    <View style={kst.wrapper}>
      <View style={[kst.rect, pressed ? kst.pressed : kst.open]} />
      <Text style={kst.label}>{label}</Text>
    </View>
  );
}

const kst = StyleSheet.create({
  wrapper:  { alignItems: 'center', gap: 3, minWidth: 32 },
  circle:   { borderWidth: 2, borderColor: C_BORDER },
  rect:     { width: 20, height: 28, borderRadius: 3, borderWidth: 2, borderColor: C_BORDER },
  pressed:  { backgroundColor: C_PRESSED, borderColor: C_PRESSED },
  open:     { backgroundColor: C_OPEN_BG },
  label:    { color: C_LABEL, fontSize: 10, textAlign: 'center' },
});

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  fingering: SaxophoneFingering;
  noteName: string; // e.g. "C4", "F#4"
}

/**
 * Visual saxophone fingering diagram.
 *
 * Layout — three-column design with a central instrument body:
 *
 *   Left col  │  Center (tube)  │  Right col
 *   ──────────│─────────────────│──────────
 *   Palm keys │  [OCT key]      │
 *   D, D#, F  │  ─────────────  │  LH side
 *   (top-     │  L: ● ● ●      │
 *   anchored) │  ═══════════    │
 *             │  R: ○ ● ○      │  RH side
 *             │  ─────────────  │
 *             │  Low: C  B  Bb  │
 *
 * Pressed keys: amber fill.  Open keys: bordered outline only.
 * Fingering lookup (written-note basis) is the caller's responsibility.
 */
export function SaxophoneFingeringView({ fingering, noteName }: Props) {
  const { octaveKey, leftHand, rightHand, palmKeys, lowKeys } = fingering;

  return (
    <View style={styles.container}>

      {/* ── Note name ── */}
      <Text style={styles.noteName}>{noteName}</Text>

      {/* ── Three-column body ── */}
      <View style={styles.bodyRow}>

        {/* LEFT: palm keys — anchored to start at the LH section */}
        <View style={styles.leftCol}>
          <Text style={styles.colLabel}>Palm</Text>
          <RectKey position={palmKeys.d}      label="D"  />
          <RectKey position={palmKeys.dSharp} label="D#" />
          <RectKey position={palmKeys.f}      label="F"  />
        </View>

        {/* CENTER: the saxophone body */}
        <View style={styles.centerCol}>

          {/* Octave key — header tab above the tube */}
          <View style={[styles.octKey, octaveKey.pressed && styles.octKeyOn]}>
            <Text style={[styles.octText, octaveKey.pressed && styles.octTextOn]}>
              OCT
            </Text>
          </View>

          {/* Tube — the visible instrument body */}
          <View style={styles.tube}>

            {/* Left hand section */}
            <View style={styles.tubeSection}>
              <Text style={styles.handLabel}>L</Text>
              <View style={styles.mainRow}>
                <CircleKey position={leftHand.index}  label="1" />
                <CircleKey position={leftHand.middle} label="2" />
                <CircleKey position={leftHand.ring}   label="3" />
              </View>
            </View>

            {/* Break band between hands */}
            <View style={styles.tubeBreak} />

            {/* Right hand section */}
            <View style={styles.tubeSection}>
              <Text style={styles.handLabel}>R</Text>
              <View style={styles.mainRow}>
                <CircleKey position={rightHand.index}  label="1" />
                <CircleKey position={rightHand.middle} label="2" />
                <CircleKey position={rightHand.ring}   label="3" />
              </View>
            </View>

          </View>

          {/* Low keys — below the tube, like the bell end */}
          <View style={styles.lowSection}>
            <Text style={styles.colLabel}>Low</Text>
            <View style={styles.mainRow}>
              <RectKey position={lowKeys.c}     label="C"  />
              <RectKey position={lowKeys.b}     label="B"  />
              <RectKey position={lowKeys.bFlat} label="B♭" />
            </View>
          </View>

        </View>

        {/* RIGHT: side / auxiliary keys */}
        <View style={styles.rightCol}>
          <Text style={styles.colLabel}>Side</Text>
          <CircleKey position={leftHand.pinky}  label="LH" size={22} />
          <CircleKey position={rightHand.pinky} label="RH" size={22} />
        </View>

      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// Approximate section heights (used to vertically align side columns):
//   octKey:       ~32px
//   LH section:   ~78px  (band 14 + keys 46 + padding 18)
//   tubeBreak:    ~8px
//   RH section:   ~78px
//   lowSection:   ~62px
// Total tube height: ~164px. Total center height: ~258px.
// Side columns skip past octKey (~36px) and low section (~62px),
// leaving ~164px for the two side keys via space-evenly.

const SIDE_PAD_TOP    = 40; // skip past octKey
const SIDE_PAD_BOTTOM = 66; // skip past lowSection

const styles = StyleSheet.create({
  container: {
    backgroundColor: C_CONTAINER,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#0f2030',
  },

  noteName: {
    color: C_NOTE,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // ── Three-column row ──
  bodyRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'stretch',
  },

  // Left col: palm keys, top-anchored to align with LH section
  leftCol: {
    width: 52,
    alignItems: 'center',
    paddingTop: SIDE_PAD_TOP,
    gap: 7,
  },

  // Center col: OCT + tube + low keys
  centerCol: {
    flex: 1,
    alignItems: 'stretch',
    gap: 0,
  },

  // Octave key tab above the tube
  octKey: {
    alignSelf: 'stretch',
    paddingVertical: 5,
    backgroundColor: C_OCT_OFF,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e3550',
    alignItems: 'center',
    marginBottom: 4,
  },
  octKeyOn: {
    backgroundColor: C_OCT_ON,
    borderColor: C_OCT_ON,
  },
  octText: {
    color: C_LABEL,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  octTextOn: {
    color: '#ffffff',
  },

  // Tube: the visible instrument body
  tube: {
    backgroundColor: C_TUBE_BG,
    borderWidth: 1,
    borderColor: C_TUBE_BORDER,
    borderRadius: 10,
    overflow: 'hidden',
  },

  tubeSection: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 5,
    alignItems: 'center',
  },

  handLabel: {
    color: C_HAND_LABEL,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    alignSelf: 'flex-start',
  },

  mainRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },

  // Darker band separating the two hands inside the tube
  tubeBreak: {
    height: 8,
    backgroundColor: C_BREAK,
  },

  // Low keys section below the tube
  lowSection: {
    marginTop: 8,
    alignItems: 'center',
    gap: 6,
  },

  colLabel: {
    color: C_LABEL,
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Right col: side/pinky keys, distributed across tube height
  rightCol: {
    width: 46,
    alignItems: 'center',
    paddingTop: SIDE_PAD_TOP,
    paddingBottom: SIDE_PAD_BOTTOM,
    justifyContent: 'space-evenly',
  },
});
