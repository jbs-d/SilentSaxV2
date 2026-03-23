# SilentSax – Product Vision

SilentSax is a saxophone learning app.

Core idea:
The user captures or uploads sheet music and receives:
- extracted notes
- correct transposition for saxophone
- fingering for each note
- visual fingering shown on a saxophone model
- optional playback of the melody

Primary user flow:
1. Capture a photo or upload sheet music (image or PDF)
2. Analyze the notes from the sheet music
3. Display the note sequence
4. Show saxophone fingering for each note
5. Optionally play the melody back

Supported instruments for MVP:
- Alto Sax (Eb)
- Tenor Sax (Bb)

MVP scope:
- Clean iPhone-friendly UI
- Camera capture
- Image / PDF upload
- Modular note-recognition pipeline
- Multi-note extraction (placeholder or partial recognition is acceptable for MVP)
- Transposition support
- Fingering mapping
- Visual saxophone fingering display
- Basic playback

Important constraints:
- Manual note entry must NOT be the main flow
- The main flow must begin with uploaded or captured sheet music
- No backend for MVP
- Bluetooth hardware is NOT part of the MVP

Future vision (not MVP):
- Physical mini saxophone device with Bluetooth
- Real-time correction while practicing
- More accurate note recognition
- More instruments and advanced practice modes
