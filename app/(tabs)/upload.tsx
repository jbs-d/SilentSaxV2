import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, Alert,
  ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { recognizeSheetMusic } from '../../services/recognitionService';
import { writtenToConcert, contextLabel } from '../../services/transpositionService';
import { getFingering, fingeringSummary } from '../../services/fingeringService';
import { playNotes, stopPlayback } from '../../services/playbackService';
import { SaxophoneFingeringView } from '../../components/SaxophoneFingeringView';
import type { ParsedNote, SheetMusicContext } from '../../types';

const CONTEXTS: SheetMusicContext[] = ['concert', 'alto', 'tenor'];

// Discriminated union covering both input types.
// 'image': from camera or library — can be shown with <Image>.
// 'pdf':   from document picker — no visual preview available; show filename card.
type SelectedSource =
  | { type: 'image'; uri: string }
  | { type: 'pdf'; uri: string; name: string };

export default function UploadScreen() {
  const [selectedSource, setSelectedSource] = useState<SelectedSource | null>(null);
  // writtenNotes: parsed directly from the sheet music — always written pitch
  const [writtenNotes, setWrittenNotes] = useState<ParsedNote[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  // sheetMusicContext: what instrument is this sheet music written for?
  // Default 'concert' = treat as concert pitch notation (piano score, etc.)
  const [sheetMusicContext, setSheetMusicContext] = useState<SheetMusicContext>('concert');
  // expandedNoteId: which note row is showing its visual fingering diagram
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  // playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  // 'written': play the notes as written on the score (matches fingerings)
  // 'concert': play the actual sounding pitch (how a listener hears the melody)
  // Only relevant when sheetMusicContext is alto or tenor; hidden for concert context.
  const [playbackPitch, setPlaybackPitch] = useState<'written' | 'concert'>('written');

  // Stop playback when the screen unmounts
  useEffect(() => () => { stopPlayback(); }, []);

  // Derived: concert-pitch representation of the written notes.
  // For context 'concert', concertNotes === writtenNotes (no transformation).
  const concertNotes = writtenNotes.length > 0
    ? writtenToConcert(writtenNotes, sheetMusicContext)
    : [];

  const showConcert = sheetMusicContext !== 'concert';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled) {
      stopPlayback();
      setIsPlaying(false);
      setPlayingIndex(null);
      setSelectedSource({ type: 'image', uri: result.assets[0].uri });
      setWrittenNotes([]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled) {
      stopPlayback();
      setIsPlaying(false);
      setPlayingIndex(null);
      setSelectedSource({ type: 'image', uri: result.assets[0].uri });
      setWrittenNotes([]);
    }
  };

  const parseSheetMusic = async () => {
    if (!selectedSource) {
      Alert.alert('No file selected', 'Please choose a sheet music image or PDF first.');
      return;
    }
    setIsParsing(true);
    try {
      const notes = await recognizeSheetMusic(selectedSource.uri);
      setWrittenNotes(notes);
    } catch {
      Alert.alert('Recognition failed', 'Could not parse sheet music. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      stopPlayback();
      setIsPlaying(false);
      setPlayingIndex(null);
      setSelectedSource({ type: 'pdf', uri: asset.uri, name: asset.name });
      setWrittenNotes([]);
    }
  };

  const handlePlay = async () => {
    if (isPlaying || writtenNotes.length === 0) return;
    // When context is concert, written === concert — always use writtenNotes.
    // When context is alto/tenor, let the user choose which pitch to hear.
    const notesToPlay = (playbackPitch === 'concert' && showConcert) ? concertNotes : writtenNotes;
    setIsPlaying(true);
    setPlayingIndex(null);
    try {
      await playNotes(notesToPlay, 500, (i) => setPlayingIndex(i));
    } finally {
      setIsPlaying(false);
      setPlayingIndex(null);
    }
  };

  const handleStop = () => {
    stopPlayback();
    setIsPlaying(false);
    setPlayingIndex(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* ── Header ── */}
      <Text style={styles.title}>Scan Sheet Music</Text>
      <Text style={styles.subtitle}>
        Take a photo, import an image, or pick a PDF to extract notes and fingerings.
      </Text>

      {/* ── Image source buttons ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
          <Text style={styles.actionBtnIcon}>📷</Text>
          <Text style={styles.actionBtnLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
          <Text style={styles.actionBtnIcon}>🖼</Text>
          <Text style={styles.actionBtnLabel}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={pickPDF}>
          <Text style={styles.actionBtnIcon}>📄</Text>
          <Text style={styles.actionBtnLabel}>PDF</Text>
        </TouchableOpacity>
      </View>

      {/* ── File preview or empty state ── */}
      {selectedSource ? (
        <View style={styles.previewSection}>

          {/* Image preview */}
          {selectedSource.type === 'image' && (
            <Image source={{ uri: selectedSource.uri }} style={styles.previewImage} />
          )}

          {/* PDF file card — no visual preview available without a native renderer */}
          {selectedSource.type === 'pdf' && (
            <View style={styles.pdfCard}>
              <Text style={styles.pdfCardIcon}>📄</Text>
              <View style={styles.pdfCardInfo}>
                <Text style={styles.pdfCardName} numberOfLines={2}>
                  {selectedSource.name}
                </Text>
                <Text style={styles.pdfCardMeta}>PDF document</Text>
              </View>
            </View>
          )}

          {/* Extract / loading */}
          {isParsing ? (
            <View style={styles.parsingRow}>
              <ActivityIndicator color="#93c5fd" size="small" />
              <Text style={styles.parsingText}>Extracting notes…</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.extractBtn} onPress={parseSheetMusic}>
                <Text style={styles.extractBtnText}>Extract Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeImageBtn}
                onPress={selectedSource.type === 'pdf' ? pickPDF : pickImage}
              >
                <Text style={styles.changeImageText}>
                  {selectedSource.type === 'pdf' ? 'Choose a different PDF' : 'Choose a different image'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>♩</Text>
          <Text style={styles.emptyTitle}>No file selected</Text>
          <Text style={styles.emptyHint}>
            Use the buttons above to add your sheet music.
          </Text>
        </View>
      )}

      {/* ── Parsed notes panel ── */}
      {writtenNotes.length > 0 && (
        <View style={styles.notesSection}>

          {/* Instrument selector */}
          <Text style={styles.sectionLabel}>Written for instrument</Text>
          <View style={styles.segmentRow}>
            {CONTEXTS.map((ctx) => (
              <TouchableOpacity
                key={ctx}
                style={[styles.segmentBtn, sheetMusicContext === ctx && styles.segmentBtnActive]}
                onPress={() => { setSheetMusicContext(ctx); setPlaybackPitch('written'); }}
              >
                <Text style={[styles.segmentBtnText, sheetMusicContext === ctx && styles.segmentBtnTextActive]}>
                  {contextLabel(ctx)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Pitch mode — only when sheet music is transposed (alto/tenor) */}
          {showConcert && (
            <>
              <Text style={styles.sectionLabel}>Play back as</Text>
              <View style={styles.segmentRow}>
                <TouchableOpacity
                  style={[styles.segmentBtn, playbackPitch === 'written' && styles.segmentBtnActive]}
                  onPress={() => setPlaybackPitch('written')}
                  disabled={isPlaying}
                >
                  <Text style={[styles.segmentBtnText, playbackPitch === 'written' && styles.segmentBtnTextActive]}>
                    Written pitch
                  </Text>
                  <Text style={styles.segmentHint}>matches your fingerings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, playbackPitch === 'concert' && styles.segmentBtnActive]}
                  onPress={() => setPlaybackPitch('concert')}
                  disabled={isPlaying}
                >
                  <Text style={[styles.segmentBtnText, playbackPitch === 'concert' && styles.segmentBtnTextActive]}>
                    Concert pitch
                  </Text>
                  <Text style={styles.segmentHint}>as a listener hears it</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Playback button — single toggle */}
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && styles.playBtnStop]}
            onPress={isPlaying ? handleStop : handlePlay}
          >
            <Text style={styles.playBtnText}>
              {isPlaying
                ? `■  Stop  ·  note ${playingIndex !== null ? playingIndex + 1 : '…'} of ${writtenNotes.length}`
                : `▶  Play  ·  ${writtenNotes.length} note${writtenNotes.length !== 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>

          {/* Note list */}
          <View style={styles.noteListHeader}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.noteCountHint}>tap any note to see fingering</Text>
          </View>

          {writtenNotes.map((written, i) => {
            const concert = concertNotes[i];
            const fingering = getFingering(written);
            const isExpanded = expandedNoteId === written.id;
            const noteName = `${written.name}${written.octave}`;
            const isCurrentlyPlaying = playingIndex === i;

            return (
              <View
                key={written.id}
                style={[styles.noteBlock, isCurrentlyPlaying && styles.noteBlockPlaying]}
              >
                <TouchableOpacity
                  style={styles.noteRow}
                  onPress={() => setExpandedNoteId(isExpanded ? null : written.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.noteIndexBadge, isCurrentlyPlaying && styles.noteIndexBadgePlaying]}>
                    <Text style={styles.noteIndexText}>{written.position + 1}</Text>
                  </View>
                  <View style={styles.notePitches}>
                    <Text style={styles.noteNameLarge}>{noteName}</Text>
                    {showConcert && (
                      <Text style={styles.noteConcert}>
                        Concert: {concert.name}{concert.octave}
                      </Text>
                    )}
                    {!isExpanded && (
                      fingering
                        ? <Text style={styles.noteFingering}>{fingeringSummary(fingering)}</Text>
                        : <Text style={styles.noteFingeringMissing}>Out of range</Text>
                    )}
                  </View>
                  <Text style={styles.expandChevron}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isExpanded && fingering && (
                  <SaxophoneFingeringView fingering={fingering} noteName={noteName} />
                )}
                {isExpanded && !fingering && (
                  <Text style={[styles.noteFingeringMissing, { paddingVertical: 8, paddingHorizontal: 4 }]}>
                    No fingering data for this note.
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  // ── Layout ──────────────────────────────────────────────────────────────
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#111827',
  },

  // ── Header ──────────────────────────────────────────────────────────────
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  // ── Image source buttons ─────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnIcon: {
    fontSize: 24,
  },
  actionBtnLabel: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Empty state ──────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 52,
    color: '#374151',
  },
  emptyTitle: {
    fontSize: 17,
    color: '#4b5563',
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 20,
  },

  // ── Image preview ────────────────────────────────────────────────────────
  previewSection: {
    gap: 12,
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 340,
    borderRadius: 14,
    resizeMode: 'contain',
    backgroundColor: '#1f2937',
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2332',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 16,
    gap: 14,
  },
  pdfCardIcon: {
    fontSize: 40,
  },
  pdfCardInfo: {
    flex: 1,
    gap: 4,
  },
  pdfCardName: {
    color: '#f9fafb',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pdfCardMeta: {
    color: '#6b7280',
    fontSize: 12,
  },

  extractBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  extractBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  parsingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#1f2937',
  },
  parsingText: {
    color: '#93c5fd',
    fontSize: 15,
    fontWeight: '500',
  },
  changeImageBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  changeImageText: {
    color: '#4b5563',
    fontSize: 13,
    textDecorationLine: 'underline',
  },

  // ── Notes panel ──────────────────────────────────────────────────────────
  notesSection: {
    marginTop: 16,
    backgroundColor: '#1f2937',
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 14,
  },

  // ── Segmented controls ───────────────────────────────────────────────────
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    gap: 2,
  },
  segmentBtnActive: {
    backgroundColor: '#1e3a5f',
    borderColor: '#3b82f6',
  },
  segmentBtnText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
  segmentBtnTextActive: {
    color: '#93c5fd',
  },
  segmentHint: {
    color: '#4b5563',
    fontSize: 9,
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  // ── Playback ─────────────────────────────────────────────────────────────
  playBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    alignItems: 'center',
  },
  playBtnStop: {
    backgroundColor: '#dc2626',
  },
  playBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.1,
  },

  // ── Note list ────────────────────────────────────────────────────────────
  noteListHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 16,
    marginBottom: 4,
  },
  noteCountHint: {
    fontSize: 11,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  noteBlock: {
    borderBottomWidth: 1,
    borderBottomColor: '#2d3a4a',
  },
  noteBlockPlaying: {
    backgroundColor: '#0f2218',
    borderRadius: 8,
    borderBottomColor: '#16a34a',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 10,
  },
  noteIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteIndexBadgePlaying: {
    backgroundColor: '#16a34a',
  },
  noteIndexText: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '700',
  },
  notePitches: {
    flex: 1,
    gap: 2,
  },
  noteNameLarge: {
    color: '#f9fafb',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  noteConcert: {
    color: '#93c5fd',
    fontSize: 12,
  },
  noteFingering: {
    color: '#6ee7b7',
    fontSize: 11,
    marginTop: 1,
  },
  noteFingeringMissing: {
    color: '#4b5563',
    fontSize: 11,
    marginTop: 1,
  },
  expandChevron: {
    color: '#4b5563',
    fontSize: 11,
    paddingLeft: 4,
  },
});
