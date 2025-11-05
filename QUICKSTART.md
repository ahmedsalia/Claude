# Quick Start Guide

Get started with the Basketball Stats Tracker in 5 minutes!

## 🎯 Choose Your App

### App 1: Live Game Stats (Mobile) 📱
**Best for:** Tracking stats during live games on your phone/tablet

```bash
cd app1-mobile
npm install
npm start
```

Then scan QR code with Expo Go app.

**Quick usage:**
1. Create team → Add players → Start game
2. Select starting 5 → Tap player → Tap stat buttons
3. End game to save

---

### App 2: Video Analysis (Desktop) 🎥
**Best for:** Analyzing recorded games with AI assistance

```bash
cd app2-video-analysis
pip install -r requirements.txt
python main.py
```

**Quick usage:**
1. Open video → Auto-detect teams → Detect jerseys
2. Select player → Click stat buttons
3. Export to CSV

---

## 📋 What You Need

### App 1 (Mobile)
✅ Node.js 16+
✅ npm
✅ Expo Go app (from App/Play Store)

### App 2 (Desktop)
✅ Python 3.8+
✅ Tesseract OCR
✅ 5-10 GB disk space (for ML models)

---

## 🚀 Installation Speed Run

### Ubuntu/Linux
```bash
# App 1
cd app1-mobile && npm install && npm start

# App 2 (in new terminal)
cd app2-video-analysis
sudo apt-get install tesseract-ocr python3-tk
pip3 install -r requirements.txt
python3 main.py
```

### macOS
```bash
# Install prerequisites
brew install node tesseract python@3.11

# App 1
cd app1-mobile && npm install && npm start

# App 2
cd app2-video-analysis
pip3 install -r requirements.txt
python3 main.py
```

### Windows
1. Install Node.js from https://nodejs.org
2. Install Python from https://python.org
3. Install Tesseract from https://github.com/UB-Mannheim/tesseract/wiki

```cmd
# App 1
cd app1-mobile
npm install
npm start

# App 2
cd app2-video-analysis
pip install -r requirements.txt
python main.py
```

---

## 🎓 First Time Using?

### App 1 Tutorial (2 minutes)
1. **Tap "New Team"** → Enter "Warriors" → Create
2. **Tap "Manage"** on your team
3. **Add 5+ players** (Name + Jersey #)
4. **Go back** → Tap "Start Game"
5. **Select 5 starters** → Confirm
6. **Tap a player** → Tap "2PT Made" → See stats update!

### App 2 Tutorial (3 minutes)
1. **File → Open Video** → Select basketball video
2. **Click "Auto-Detect Teams"** → Teams identified
3. **Click "Detect Jerseys"** → Numbers recognized
4. **Select a player** from list
5. **Click "2PT Made"** → Stats updated!
6. **File → Export Stats** → Save CSV

---

## 📊 Stat Buttons Quick Reference

| Button | Meaning | When to Use |
|--------|---------|-------------|
| 2PT Made ✓ | 2-pointer goes in | Layups, mid-range shots |
| 2PT Miss ✗ | 2-pointer misses | Missed inside shots |
| 3PT Made ✓ | 3-pointer goes in | Shot from beyond arc |
| 3PT Miss ✗ | 3-pointer misses | Missed 3-point attempt |
| FT Made ✓ | Free throw in | Successful free throw |
| FT Miss ✗ | Free throw miss | Missed free throw |
| Off Reb | Offensive board | Team gets own miss |
| Def Reb | Defensive board | Rebounds opponent's miss |
| Assist | Assist | Pass leads to score |
| Steal | Steal | Takes ball from opponent |
| Block | Block | Blocks opponent's shot |
| Turnover | Turnover | Loses possession |
| Foul | Personal foul | Physical foul |

---

## ⚡ Pro Tips

**App 1:**
- 🔄 Substitutions: Select on-court player → Tap bench player
- ↩️ Made a mistake? Use "Undo" buttons
- 💾 Auto-saves every change
- 📱 Works offline!

**App 2:**
- ⏸️ Pause on clear frames for better jersey detection
- 🎯 Higher quality video = better results
- ⌨️ Use Previous/Next Frame for precision
- 📈 Export regularly to save progress

---

## 🆘 Common Issues

**App 1 won't start?**
```bash
npm start -- --clear
```

**App 2 "Tesseract not found"?**
```bash
# Ubuntu
sudo apt-get install tesseract-ocr

# Mac
brew install tesseract

# Windows: Install from link above and add to PATH
```

**Can't detect players in video?**
- Check video quality (need 720p+)
- Try different frame (timeline slider)
- Ensure players are clearly visible

---

## 📚 Need More Help?

- 📖 **Full Setup**: See `SETUP_GUIDE.md`
- 📱 **App 1 Details**: See `app1-mobile/README.md`
- 🎥 **App 2 Details**: See `app2-video-analysis/README.md`
- 💡 **General Info**: See main `README.md`

---

## 🎯 Your First Game Plan

**Before the Game:**
1. Install and test App 1
2. Create your team and add all players
3. Practice tracking a few practice shots

**During the Game:**
1. Start game with starting 5
2. Track shots, rebounds, assists
3. Don't worry about perfection - focus on key stats

**After the Game:**
1. Review the stats
2. If you recorded video, use App 2 for deeper analysis
3. Export stats for your records

---

**Ready to go! Any questions? Open an issue in the repository.** 🏀
