# Basketball Stats Tracker Suite

A comprehensive suite of two basketball statistics tracking applications designed for coaches, analysts, and basketball enthusiasts.

## 📱 App 1: Live Game Stats Tracker (Mobile)

A cross-platform mobile application (Android & iPadOS) for tracking basketball statistics in real-time during games.

### Features
- **Team Management**: Create and manage your team roster
- **Lineup Control**: Select starting 5 and easily substitute players
- **Drag-and-Drop Interface**: Intuitive stat tracking by dragging icons to players
- **Comprehensive Stats**:
  - Field Goals (2PT, 3PT - Made/Missed)
  - Free Throws (Made/Missed)
  - Rebounds (Offensive/Defensive)
  - Assists, Steals, Blocks, Turnovers
  - And more...
- **Stat Modes**: Toggle between Normal and Advanced statistics
- **Real-time Updates**: Live game statistics and player performance

### Tech Stack
- React Native with Expo (Cross-platform compatibility)
- React Native Gesture Handler (Drag-and-drop functionality)
- AsyncStorage (Local data persistence)
- TypeScript (Type safety)

### Getting Started

```bash
cd app1-mobile
npm install
npm start

# For Android
npm run android

# For iOS
npm run ios
```

## 🎥 App 2: Video Analysis Stats Extractor (Desktop)

A PC application that automatically extracts basketball statistics from game videos using computer vision.

### Features
- **Video Upload & Processing**: Analyze basketball game recordings
- **Jersey Recognition**: Automatic detection and OCR of jersey numbers
- **Team Detection**: Distinguish between teams based on jersey colors
- **Automated Stat Tracking**: Extract player actions and statistics
- **Manual Review**: Verify and correct automated detections
- **Export Stats**: Generate detailed statistical reports
- **Synergy-Inspired UI**: Professional interface for sports analysts

### Tech Stack
- Python 3.8+
- OpenCV (Video processing and computer vision)
- Tesseract OCR (Jersey number recognition)
- YOLOv8/MediaPipe (Player detection and tracking)
- Tkinter/PyQt5 (Desktop GUI)
- NumPy, Pandas (Data processing)

### Getting Started

```bash
cd app2-video-analysis
pip install -r requirements.txt
python main.py
```

## 📋 Project Structure

```
basketball-stats-tracker/
├── app1-mobile/                 # Mobile app (React Native)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── screens/             # App screens
│   │   ├── utils/               # Utility functions
│   │   └── types/               # TypeScript types
│   ├── assets/                  # Images, icons
│   ├── App.tsx                  # Main app entry
│   └── package.json
│
├── app2-video-analysis/         # Desktop app (Python)
│   ├── src/
│   │   ├── video_processor.py  # Video analysis engine
│   │   ├── jersey_detector.py  # Jersey number recognition
│   │   ├── team_detector.py    # Team identification
│   │   ├── stat_extractor.py   # Statistics extraction
│   │   └── ui/                  # Desktop GUI
│   ├── models/                  # Pre-trained ML models
│   ├── main.py                  # Application entry point
│   └── requirements.txt
│
└── README.md
```

## 🚀 Development Roadmap

- [x] Project structure setup
- [x] App 1: Core mobile app with stats tracking
- [x] App 2: Video processing pipeline
- [ ] App 1: Cloud sync capabilities
- [ ] App 2: Advanced analytics and heat maps
- [ ] Integration between both apps
- [ ] Team collaboration features

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

## 📧 Support

For issues and questions, please open an issue in the repository.
