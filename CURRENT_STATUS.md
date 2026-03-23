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
- Basic image picker works
- User can select an image from the library

What is not implemented yet:
- Camera capture in the app
- Real note recognition from uploaded sheet music
- Multi-note extraction from one image
- Transposition service
- Fingering mapping pipeline
- Visual saxophone fingering model
- Playback of extracted notes
- PDF flow

Current product quality:
- The app still feels like a prototype
- UI is functional but not yet polished
- Parsing is not yet real or reliable
- Core music-learning flow is not complete

Known constraints:
- True OMR (optical music recognition for sheet music) is difficult
- For MVP, placeholder recognition is acceptable if the architecture stays modular
