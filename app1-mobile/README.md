# Basketball Stats Tracker - Mobile App

A cross-platform mobile application for tracking basketball statistics in real-time during games.

## Features

### Team Management
- Create and manage multiple teams
- Add/remove players to your roster
- Assign jersey numbers to players

### Game Management
- Select starting lineup (5 players)
- Easy player substitution system
- Real-time stat tracking with tap interface

### Statistics Tracking

**Shooting Stats:**
- 2-Point Field Goals (Made/Missed)
- 3-Point Field Goals (Made/Missed)
- Free Throws (Made/Missed)

**Rebounding:**
- Offensive Rebounds
- Defensive Rebounds

**Other Stats:**
- Assists
- Steals
- Blocks
- Turnovers
- Personal Fouls

### User Interface
- **Simple tap-to-add** stats interface
- **On-court/Bench** player separation
- **Real-time score** calculation
- **Player summaries** showing PTS, REB, AST
- **Undo functionality** for stat corrections
- **Persistent storage** - games are auto-saved

## Installation

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (Mac only)
- For Android: Android Studio

### Setup

```bash
cd app1-mobile
npm install
```

### Running the App

#### Development Mode
```bash
npm start
```

This opens the Expo DevTools. From here you can:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan QR code with Expo Go app on your phone

#### Run on specific platform
```bash
# Android
npm run android

# iOS
npm run ios

# Web (for testing)
npm run web
```

## Usage Guide

### 1. Create a Team
- Tap "New Team" on the home screen
- Enter your team name
- Add players with their names and jersey numbers

### 2. Start a Game
- Select a team from the home screen
- Tap "Start Game"
- Choose your starting 5 players
- Confirm lineup to begin

### 3. Track Stats
- **Select a player** by tapping on their card
- **Tap stat buttons** to add stats to the selected player
- **Undo** button appears when a stat is added (in case of mistakes)
- Player cards show live PTS, REB, AST totals

### 4. Substitute Players
- **On Court section** shows active 5 players
- **Bench section** shows available substitutes
- To substitute:
  1. Select an on-court player
  2. Tap a bench player
  3. Confirm the substitution

### 5. End Game
- Tap "End Game" in the top right
- Game stats are automatically saved
- Return to home screen

## Project Structure

```
app1-mobile/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── PlayerCard.tsx
│   │   └── StatButton.tsx
│   ├── screens/          # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── TeamManageScreen.tsx
│   │   └── GameScreen.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
│       ├── stats.ts      # Stat calculations
│       └── storage.ts    # Data persistence
├── App.tsx               # Main app component
├── package.json
└── app.json              # Expo configuration
```

## Technology Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **AsyncStorage** - Local data persistence
- **React Native Gesture Handler** - Touch interactions
- **React Native Reanimated** - Smooth animations

## Data Persistence

All data is stored locally on the device using AsyncStorage:
- Teams and rosters are saved automatically
- Game progress is auto-saved during gameplay
- No internet connection required

## Future Enhancements

- [ ] Advanced stats mode (PER, TS%, +/-)
- [ ] Game history and past game review
- [ ] Export stats to CSV/PDF
- [ ] Multi-game season tracking
- [ ] Cloud backup and sync
- [ ] Shot charts and heat maps
- [ ] Video integration with timestamps

## Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

### Metro bundler issues
```bash
# Reset Metro
npx react-native start --reset-cache
```

## License

MIT License

## Support

For issues and feature requests, please open an issue in the repository.
