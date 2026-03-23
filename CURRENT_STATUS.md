# Current Status

Tech stack:
- Expo
- React Native
- TypeScript
- Expo Router

Current app structure:
- app/
- components/
- services/
- types/
- data/
- hooks/

What is already implemented:
- Expo project setup works
- Router/tab navigation works
- Tabs include Home, Explore, and Upload
- Upload tab exists
- Image picker works
- Camera capture works
- Selected image can be displayed
- Placeholder recognition service exists
- Parsed notes are displayed in the UI
- Parsing shows a loading state
- Transposition service (writtenToConcert) converts written pitch → concert pitch
  - Alto: written − 9 semitones = concert; Tenor: written − 14 semitones = concert
- SheetMusicContext type added to types/; models what instrument the sheet music is written for
- Upload screen displays written note always; shows concert pitch alongside when context is Alto or Tenor
- Parsed notes are always treated as written notation (not assumed to be concert pitch)

- Fingering data in data/fingeringData.ts (range Bb3–F#6, applicable to all saxophones)
- Fingering service (services/fingeringService.ts): getFingering() + fingeringSummary()
- Upload screen shows compact fingering summary per written note (green text)

- Visual fingering component (components/SaxophoneFingeringView.tsx): tap any note row to expand diagram
  - Three-column instrument body layout: palm keys | central tube | side keys
  - OCT key tab above tube; dark tube body with LH + break band + RH sections; low keys below
  - Pressed keys filled amber (#f59e0b); open keys outlined only
  - Pure React Native Views — no external dependencies

- Melody playback (services/playbackService.ts):
  - playNotes(notes, durationMs, onNoteStart): generates sine-wave WAV per note, plays via expo-av
  - stopPlayback(): interrupts in-progress playback immediately
  - Note frequencies via equal temperament (A4 = 440 Hz, MIDI arithmetic)
  - WAV written to FileSystem.cacheDirectory, played from file URI (iOS/Android compatible)
  - Upload screen: Play button (green), Stop button (red, visible during playback)
  - Currently playing note row highlighted in the note list
  - Playback pitch mode: 'written' (default) or 'concert'
    - Toggle only shown when sheetMusicContext is alto or tenor
    - 'written': plays the notes as written on the score — pitches match fingerings
    - 'concert': plays the actual sounding pitch — how a listener hears the melody
    - Mode resets to 'written' when sheet music context is changed

- PDF upload (upload.tsx):
  - User can pick a PDF via expo-document-picker (already in package.json)
  - PDF input represented as SelectedSource { type: 'pdf', uri, name }
  - Image input represented as SelectedSource { type: 'image', uri }
  - PDF shows a filename card (no page preview — requires native renderer)
  - PDF passes its URI through the same recognizeSheetMusic() placeholder
  - Camera and image library flows unchanged

What is not implemented yet:
- Real note recognition from uploaded sheet music
- Multi-note recognition based on actual image content
- Polished fingering component (better saxophone body shape, animations)
- Real PDF-to-image conversion or page rendering for OMR

Current product quality:
- Upload screen has been polished to feel like a real iPhone app
- Native Button components replaced with custom styled TouchableOpacity throughout
- All UI states (empty, image selected, parsing, notes, playback) have intentional design
- Recognition is still placeholder-based
- Core music-learning flow is functional end-to-end

Known constraints:
- True OMR (optical music recognition for sheet music) is difficult
- For MVP, placeholder recognition is acceptable if the architecture stays modular
