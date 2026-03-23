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

What is not implemented yet:
- Real note recognition from uploaded sheet music
- Multi-note recognition based on actual image content
- Transposition service
- Fingering mapping pipeline
- Visual saxophone fingering model
- Playback of extracted notes
- PDF flow

Current product quality:
- The app still feels like a prototype
- UI is functional but not yet polished
- Recognition is still placeholder-based
- Core music-learning flow is not complete

Known constraints:
- True OMR (optical music recognition for sheet music) is difficult
- For MVP, placeholder recognition is acceptable if the architecture stays modular
