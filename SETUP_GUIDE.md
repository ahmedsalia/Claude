# Basketball Stats Tracker - Complete Setup Guide

This guide will help you set up and run both applications.

## 📱 App 1: Mobile Stats Tracker

### Prerequisites
- Node.js 16+ and npm
- For iOS development: macOS with Xcode
- For Android development: Android Studio
- Expo CLI: `npm install -g expo-cli`

### Setup Instructions

1. **Navigate to the mobile app directory:**
   ```bash
   cd app1-mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**

   **Option A: Use Expo Go app (Easiest)**
   - Install Expo Go from App Store (iOS) or Play Store (Android)
   - Scan the QR code displayed in terminal
   - App will load on your device

   **Option B: Use emulator/simulator**
   - For Android: `npm run android` (requires Android Studio)
   - For iOS: `npm run ios` (requires Xcode on Mac)

### First Time Usage

1. **Create a Team:**
   - Tap "New Team" button
   - Enter your team name
   - Tap "Create"

2. **Add Players:**
   - Select your team
   - Tap "Manage"
   - Tap "Add Player"
   - Enter player name and jersey number
   - Repeat for all players (minimum 5 needed to start a game)

3. **Start a Game:**
   - Go back to home
   - Select your team
   - Tap "Start Game"
   - Select your starting 5 players
   - Tap "Confirm Lineup"

4. **Track Stats:**
   - Tap a player to select them
   - Tap stat buttons to add stats to that player
   - Use "Undo" if you make a mistake
   - Substitute players by selecting an on-court player, then tapping a bench player

5. **End Game:**
   - Tap "End Game" when finished
   - Stats are automatically saved

### Tips for App 1
- The app works in **landscape mode** for better visibility
- All data is stored **locally** on your device
- No internet connection required during games
- Stats persist between sessions

---

## 🎥 App 2: Video Analysis

### Prerequisites

**Required Software:**
- Python 3.8 or higher
- pip (Python package manager)
- Tesseract OCR

**Optional (for better performance):**
- CUDA-capable GPU with CUDA toolkit installed

### System-Specific Setup

#### Ubuntu/Debian Linux

```bash
# Update package list
sudo apt-get update

# Install Python dependencies
sudo apt-get install python3 python3-pip python3-tk

# Install Tesseract OCR
sudo apt-get install tesseract-ocr

# Install system libraries for OpenCV
sudo apt-get install libsm6 libxext6 libxrender-dev libgomp1

# Navigate to app directory
cd app2-video-analysis

# Install Python packages
pip3 install -r requirements.txt
```

#### macOS

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python (if not already installed)
brew install python@3.11

# Install Tesseract
brew install tesseract

# Navigate to app directory
cd app2-video-analysis

# Install Python packages
pip3 install -r requirements.txt
```

#### Windows

1. **Install Python:**
   - Download from https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"

2. **Install Tesseract OCR:**
   - Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
   - Install to default location: `C:\Program Files\Tesseract-OCR`
   - Add to PATH or note the installation path

3. **Install Python packages:**
   ```cmd
   cd app2-video-analysis
   pip install -r requirements.txt
   ```

4. **If Tesseract is not in PATH:**
   - Edit `src/jersey_detector.py`
   - Update line with tesseract path:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

### Running App 2

```bash
cd app2-video-analysis
python main.py
```

**First run will:**
- Download YOLOv8 model (~6MB)
- This only happens once

### Using App 2

1. **Load a Video:**
   - Click "File" → "Open Video"
   - Select your basketball game video
   - Supported formats: MP4, AVI, MOV, MKV

2. **Navigate the Video:**
   - Click "Play" to watch
   - Use "Previous Frame" / "Next Frame" for precision
   - Drag the timeline slider to jump around

3. **Detect Players:**
   - Pause on a clear frame showing players
   - Click "Auto-Detect Teams" to identify teams
   - Click "Detect Jerseys" to recognize numbers

4. **Track Statistics:**
   - Select a player from the list
   - Click stat buttons to add stats
   - Stats update in real-time

5. **Export Data:**
   - Click "File" → "Export Stats (CSV)"
   - Save the file
   - Open in Excel or any spreadsheet software

### Tips for App 2

**For Best Results:**
- Use high-quality video (1080p or better)
- Ensure jerseys are clearly visible
- Good lighting helps jersey detection
- Pause on clear frames for jersey number detection

**Performance:**
- GPU acceleration is automatic if CUDA is available
- For faster processing, you can modify frame skip in code
- Close other heavy applications while processing

**Accuracy:**
- Jersey detection works best on clear, front-facing shots
- Team detection requires distinct jersey colors
- Manual verification is recommended

---

## 🔧 Troubleshooting

### App 1 (Mobile)

**"Unable to start Metro bundler"**
```bash
# Clear cache
npm start -- --clear
```

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**App crashes on startup**
```bash
# Check Expo CLI version
expo --version
# Update if needed
npm install -g expo-cli@latest
```

### App 2 (Desktop)

**"Tesseract not found"**
- Verify installation: `tesseract --version`
- Add to PATH or specify path in code

**"No module named 'cv2'"**
```bash
pip install opencv-python
```

**"CUDA out of memory"**
- Close other applications
- Or force CPU mode in code:
```python
processor = VideoProcessor(device='cpu')
```

**"Cannot load video"**
- Check video codec compatibility
- Try converting to MP4 with H.264 codec

**GUI doesn't appear (Linux)**
```bash
# Install tkinter
sudo apt-get install python3-tk
```

---

## 📊 Understanding the Stats

### Basic Stats (Both Apps)

| Stat | Description |
|------|-------------|
| **FGM2** | 2-Point Field Goals Made |
| **FGA2** | 2-Point Field Goals Attempted |
| **FGM3** | 3-Point Field Goals Made |
| **FGA3** | 3-Point Field Goals Attempted |
| **FTM** | Free Throws Made |
| **FTA** | Free Throws Attempted |
| **OREB** | Offensive Rebounds |
| **DREB** | Defensive Rebounds |
| **AST** | Assists |
| **STL** | Steals |
| **BLK** | Blocks |
| **TOV** | Turnovers |
| **PF** | Personal Fouls |

### Calculated Stats

- **Points** = (FGM2 × 2) + (FGM3 × 3) + FTM
- **Total Rebounds** = OREB + DREB
- **FG%** = (FGM2 + FGM3) / (FGA2 + FGA3) × 100
- **3P%** = FGM3 / FGA3 × 100
- **FT%** = FTM / FTA × 100

---

## 🎯 Use Cases

### App 1: Live Game Stats
- **Youth Basketball**: Track stats during kids' games
- **Recreational Leagues**: Monitor team performance
- **Practice Sessions**: Track shooting practice stats
- **Training**: Monitor individual player development

### App 2: Video Analysis
- **Game Review**: Analyze games after they're recorded
- **Scouting**: Study opponent tendencies
- **Player Development**: Review player performance
- **Coaching**: Prepare video breakdowns with stats
- **Highlight Reels**: Find key moments with timestamps

---

## 🚀 Next Steps

### Suggested Workflow

1. **During Live Games:**
   - Use App 1 on tablet/iPad for real-time tracking
   - Focus on basic stats (shots, rebounds, assists)

2. **After Games:**
   - Record games with camera
   - Use App 2 for detailed video analysis
   - Verify and supplement App 1 stats
   - Export for reports and presentations

3. **Combine Data:**
   - Compare live stats (App 1) with video analysis (App 2)
   - Create comprehensive player reports
   - Identify areas for improvement

---

## 📚 Additional Resources

### Learning More

**Basketball Stats:**
- [Basketball Reference](https://www.basketball-reference.com/) - Stats database
- [NBA Stats Guide](https://www.nba.com/stats/) - Official NBA statistics

**Computer Vision:**
- [OpenCV Tutorials](https://docs.opencv.org/master/d9/df8/tutorial_root.html)
- [YOLOv8 Documentation](https://docs.ultralytics.com/)

**React Native:**
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

---

## 💡 Pro Tips

1. **Practice Before Game Day**: Familiarize yourself with the apps during practice
2. **Backup Your Data**: Export stats regularly
3. **Multiple Users**: One person tracks offense, another tracks defense
4. **Video Quality**: Use tripod and good lighting for video recording
5. **Consistent Tracking**: Develop a routine for stat entry to minimize errors

---

## 🤝 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the README files in each app directory
3. Open an issue in the repository with:
   - Your operating system
   - Python/Node.js version
   - Error messages
   - Steps to reproduce

---

## 📄 License

Both applications are open source under MIT License. Feel free to modify and customize for your needs!

---

**Happy Stat Tracking! 🏀**
