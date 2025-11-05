# Basketball Video Analysis - Desktop App

A professional desktop application for extracting basketball statistics from game videos using computer vision and machine learning. Inspired by Synergy Sports technology.

## Features

### 🎥 Video Processing
- Load and playback basketball game videos
- Frame-by-frame navigation
- Timeline scrubbing for quick navigation

### 🤖 Automatic Detection
- **Player Detection**: YOLOv8-based detection of players in video
- **Jersey Number Recognition**: OCR-based jersey number detection using Tesseract
- **Team Identification**: Automatic team detection based on jersey colors using K-means clustering
- **Player Tracking**: Multi-object tracking across frames

### 📊 Statistics Tracking
- Manual stat entry with visual interface
- Supported stats:
  - 2-Point Field Goals (Made/Attempted)
  - 3-Point Field Goals (Made/Attempted)
  - Free Throws (Made/Attempted)
  - Rebounds
  - And more...
- Real-time stats display
- Export to CSV for analysis

### 🎨 Professional UI
- Synergy-inspired interface
- Video playback controls
- Player selection and tracking
- Live stats dashboard
- Export functionality

## Installation

### Prerequisites

**Required:**
- Python 3.8 or higher
- pip (Python package manager)
- Tesseract OCR (for jersey number recognition)

**Optional:**
- CUDA-capable GPU (for faster processing)

### Install Tesseract OCR

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
Download installer from: https://github.com/UB-Mannheim/tesseract/wiki

### Install Python Dependencies

```bash
cd app2-video-analysis
pip install -r requirements.txt
```

**Note:** First run will download the YOLOv8 model (~6MB).

## Usage

### Starting the Application

```bash
python main.py
```

### Workflow

#### 1. Load Video
- Click **File → Open Video**
- Select your basketball game video file
- Supported formats: MP4, AVI, MOV, MKV

#### 2. Navigate Video
- Use **Play/Pause** button for playback
- Use **Previous Frame** / **Next Frame** for precision
- Drag the **timeline slider** to jump to specific moments

#### 3. Detect Teams and Players
- Click **Auto-Detect Teams** to identify teams by jersey color
- Click **Detect Jerseys** to recognize jersey numbers using OCR
- Review detected players in the **Detected Players** list

#### 4. Track Statistics
- Select a player from the **Detected Players** list
- Click stat buttons to add stats:
  - **2PT Made** / **2PT Miss** - Two-point field goals
  - **3PT Made** / **3PT Miss** - Three-point field goals
  - **FT Made** / **FT Miss** - Free throws
  - **Rebound** - Rebounds
- Stats are updated in real-time in the **Current Stats** panel

#### 5. Export Statistics
- Click **File → Export Stats (CSV)**
- Choose save location
- Open in Excel, Google Sheets, or data analysis tools

## Technical Architecture

### Computer Vision Pipeline

```
Video Input
    ↓
Player Detection (YOLOv8)
    ↓
Jersey Region Extraction
    ↓
    ├─→ Jersey Number OCR (Tesseract)
    └─→ Team Color Detection (K-means)
    ↓
Player Tracking (Multi-Object Tracker)
    ↓
Manual Stat Validation/Entry
    ↓
Statistics Export (CSV/DataFrame)
```

### Project Structure

```
app2-video-analysis/
├── src/
│   ├── video_processor.py       # YOLO-based player detection
│   ├── jersey_detector.py       # OCR for jersey numbers
│   ├── team_detector.py         # Team identification by color
│   ├── stat_extractor.py        # Statistics management
│   └── ui/
│       └── main_window.py       # Tkinter GUI
├── models/                       # ML model storage
├── data/
│   ├── videos/                  # Input videos
│   └── exports/                 # Exported statistics
├── main.py                      # Application entry point
├── requirements.txt             # Python dependencies
└── README.md
```

## Key Modules

### VideoProcessor
Handles video loading, frame extraction, and player detection using YOLOv8.

```python
from src.video_processor import VideoProcessor

processor = VideoProcessor()
processor.load_video("game.mp4")
players = processor.detect_players(frame)
```

### JerseyDetector
Recognizes jersey numbers using Tesseract OCR with preprocessing.

```python
from src.jersey_detector import JerseyDetector

detector = JerseyDetector()
detection = detector.detect_number(player_image)
print(f"Jersey #{detection.number}")
```

### TeamDetector
Identifies teams based on jersey color clustering.

```python
from src.team_detector import TeamDetector

team_detector = TeamDetector()
teams = team_detector.auto_detect_teams(frame, jersey_regions)
```

### StatExtractor
Manages player statistics and exports data.

```python
from src.stat_extractor import StatExtractor

stats = StatExtractor()
stats.update_player_stats("23", "Team 1", "fgm2", 1)
stats.export_to_csv("game_stats.csv")
```

## Configuration

### Tesseract Path (Windows)
If Tesseract is not in your PATH, specify the path in `jersey_detector.py`:

```python
detector = JerseyDetector(tesseract_path=r"C:\Program Files\Tesseract-OCR\tesseract.exe")
```

### GPU Acceleration
To use GPU (requires CUDA):

```python
processor = VideoProcessor(device='cuda')
```

## Performance Tips

### Faster Processing
- Use frame skipping: Process every 5th or 10th frame
- Lower video resolution before analysis
- Use GPU acceleration if available

### Better Detection
- Use high-quality video (1080p or higher)
- Ensure good lighting in videos
- Minimize motion blur for jersey detection

## Limitations

### Current Version
- **Manual stat entry**: Automatic action recognition is limited
- **Jersey OCR accuracy**: Depends on video quality and jersey contrast
- **Court detection**: Currently uses simple heuristics
- **Ball tracking**: Not yet implemented

### Future Enhancements
- Automatic shot detection and tracking
- Ball possession tracking
- Advanced shot charts and heat maps
- Play-by-play extraction
- Multi-camera support
- Real-time analysis during live games

## Troubleshooting

### "Tesseract not found"
Install Tesseract OCR and ensure it's in your system PATH.

### "CUDA out of memory"
Switch to CPU mode or reduce video resolution.

### Poor jersey detection
- Ensure video is high quality
- Pause on clear frames where jerseys are visible
- Manually correct detections as needed

### Slow performance
- Use GPU acceleration
- Process every 5-10 frames instead of all frames
- Close other applications

## Export Format

CSV export includes:
- Jersey Number
- Team
- Points (calculated)
- Field Goals Made/Attempted (2PT, 3PT)
- Free Throws Made/Attempted
- Rebounds
- Time on Court

## Comparison with Synergy Sports

| Feature | This App | Synergy Sports |
|---------|----------|----------------|
| Player Detection | YOLOv8 | Proprietary AI |
| Jersey Recognition | Tesseract OCR | Advanced OCR |
| Team Detection | K-means Clustering | Multi-modal AI |
| Stat Tracking | Manual + Auto | Fully Automated |
| Shot Charts | ⏳ Planned | ✓ Advanced |
| Cost | Free & Open Source | Commercial |

## Contributing

Contributions welcome! Areas for improvement:
- Automatic shot detection
- Ball tracking
- Court detection and homography
- Advanced analytics
- Performance optimization

## License

MIT License

## Credits

Built with:
- **YOLOv8** (Ultralytics) - Object detection
- **Tesseract** - OCR
- **OpenCV** - Computer vision
- **scikit-learn** - Clustering algorithms
- **Tkinter** - GUI framework

## Support

For issues and questions, please open an issue in the repository.

---

**Note**: This is an educational/analytical tool. For professional sports analysis, consider commercial solutions like Synergy Sports Technology.
