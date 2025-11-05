# Running Basketball Stats Tracker in VS Code

This guide shows you how to run both apps directly from VS Code.

## 🚀 Quick Start in VS Code

### Step 1: Open the Workspace

1. Open VS Code
2. **File → Open Workspace from File**
3. Select `basketball-stats-tracker.code-workspace`

Or from terminal:
```bash
code basketball-stats-tracker.code-workspace
```

### Step 2: Install Recommended Extensions

When you open the workspace, VS Code will prompt you to install recommended extensions. Click **Install All**.

Required extensions:
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **React Native Tools** - Mobile app debugging
- **Python** - Python language support
- **Pylance** - Python IntelliSense

---

## 📱 Running App 1 (Mobile) in VS Code

### Method 1: Using Debug Panel (Recommended)

1. Click the **Run and Debug** icon in sidebar (or press `Ctrl+Shift+D`)
2. Select **"📱 Start App 1 (Mobile) - Expo"** from dropdown
3. Click the **green play button** or press `F5`
4. Expo will start in the integrated terminal
5. Scan QR code with Expo Go app on your phone

### Method 2: Using Tasks

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Run Task"
3. Select **"📱 Start App 1 - Expo"**

### Method 3: Using Terminal

1. Open integrated terminal: `Ctrl+` ` (backtick)
2. Navigate to app1-mobile:
   ```bash
   cd app1-mobile
   npm install  # First time only
   npm start
   ```

### First Time Setup for App 1

```bash
# In VS Code terminal
cd app1-mobile
npm install
```

Then use any of the methods above to start.

---

## 🎥 Running App 2 (Video Analysis) in VS Code

### Method 1: Using Debug Panel (Recommended)

1. Click the **Run and Debug** icon in sidebar
2. Select **"🎥 Run App 2 (Video Analysis)"** from dropdown
3. Click the **green play button** or press `F5`
4. App window will open

### Method 2: Using Tasks

1. Press `Ctrl+Shift+P`
2. Type "Run Task"
3. Select **"🎥 Run App 2 (Video Analysis)"**

### Method 3: Using Terminal

1. Open integrated terminal
2. Navigate to app2-video-analysis:
   ```bash
   cd app2-video-analysis
   pip install -r requirements.txt  # First time only
   python main.py
   ```

### First Time Setup for App 2

#### Create Virtual Environment (Recommended)

```bash
# In VS Code terminal
cd app2-video-analysis
python3 -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Or use the VS Code task:
1. `Ctrl+Shift+P` → "Run Task"
2. Select **"🎥 Create Python Virtual Environment"**
3. Then select **"🎥 Install App 2 Dependencies"**

---

## 🚀 Running Both Apps at Once

### Using Compound Configuration

1. Click **Run and Debug** icon
2. Select **"🚀 Run Both Apps"** from dropdown
3. Click play button

This will:
- Start Expo for the mobile app (in one terminal)
- Launch the desktop video analysis app (in another terminal)

---

## 🔧 Available VS Code Tasks

Press `Ctrl+Shift+P` → "Run Task" to access:

### App 1 (Mobile) Tasks:
- **📱 Install App 1 Dependencies** - Run `npm install`
- **📱 Start App 1 - Expo** - Start Expo dev server
- **📱 Run App 1 - Android** - Launch on Android emulator
- **📱 Run App 1 - iOS** - Launch on iOS simulator (Mac only)
- **📱 Clear Expo Cache** - Clear cache if having issues

### App 2 (Desktop) Tasks:
- **🎥 Create Python Virtual Environment** - Set up venv
- **🎥 Install App 2 Dependencies** - Install Python packages
- **🎥 Run App 2 (Video Analysis)** - Start the app

### Combined Tasks:
- **🔧 Install All Dependencies** - Install deps for both apps

---

## 🐛 Debugging in VS Code

### Debug App 2 (Python)

1. Set breakpoints by clicking left of line numbers
2. Select **"🎥 Debug App 2 (Video Analysis)"**
3. Press `F5` to start debugging
4. Use debug controls:
   - `F5` - Continue
   - `F10` - Step Over
   - `F11` - Step Into
   - `Shift+F11` - Step Out

### Debug App 1 (React Native)

For advanced debugging, use React Native Tools extension:
1. Install "React Native Tools" extension
2. Open Debug Panel
3. Select "Debug in Exponent" or similar config
4. Use Chrome DevTools for debugging

---

## 📁 VS Code Workspace Layout

The workspace is organized into 3 folders:

```
🏀 Basketball Stats Tracker (root)
├── 📱 App 1 - Mobile
│   └── All mobile app files
└── 🎥 App 2 - Video Analysis
    └── All desktop app files
```

You can switch between folders in the **Explorer** panel.

---

## ⌨️ Useful VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` | Open Run and Debug |
| `F5` | Start debugging |
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+` ` | Toggle terminal |
| `Ctrl+Shift+` ` | New terminal |
| `Ctrl+P` | Quick file open |
| `Ctrl+B` | Toggle sidebar |
| `F11` | Full screen |

---

## 🔍 IntelliSense and Auto-Complete

VS Code provides smart code completion:

### For TypeScript/React (App 1):
- Type `import` and get auto-suggestions
- Hover over functions for documentation
- `Ctrl+Space` for manual IntelliSense
- `F12` to go to definition

### For Python (App 2):
- Auto-import suggestions
- Function signatures on hover
- Type checking with Pylance
- `Ctrl+Space` for suggestions

---

## 🎨 Code Formatting

Both apps are configured to auto-format on save.

### Manual Formatting:
- `Shift+Alt+F` (Windows/Linux)
- `Shift+Option+F` (Mac)

Or right-click → "Format Document"

---

## 📊 Viewing Output

### Multiple Terminal Windows

Create dedicated terminals for each app:

1. Click "+" in terminal panel
2. Name terminal (right-click → Rename)
3. Suggested names:
   - "Mobile App - Expo"
   - "Desktop App - Python"
   - "General"

### Split Terminals

- Click split icon in terminal
- Or `Ctrl+Shift+5`
- Run apps side-by-side

---

## 🔧 Troubleshooting in VS Code

### "Python interpreter not found"

1. `Ctrl+Shift+P`
2. Type "Python: Select Interpreter"
3. Choose the venv interpreter or system Python

### "npm command not found"

Install Node.js, then restart VS Code.

### "Module not found" errors

Run the install task:
- `Ctrl+Shift+P` → "Run Task" → "Install App X Dependencies"

### Expo won't start

Try clearing cache:
- `Ctrl+Shift+P` → "Run Task" → "📱 Clear Expo Cache"

### Can't see debug output

Check the **Debug Console** tab in the bottom panel.

---

## 💡 Pro Tips

1. **Split Editor**: `Ctrl+\` to view code side-by-side
2. **Multi-cursor**: `Alt+Click` to add cursors
3. **Search in Files**: `Ctrl+Shift+F`
4. **Git Integration**: Use Source Control panel (`Ctrl+Shift+G`)
5. **Zen Mode**: `Ctrl+K Z` for distraction-free coding
6. **Breadcrumbs**: Navigate file structure at top of editor

---

## 📚 Additional Resources

- **VS Code Docs**: https://code.visualstudio.com/docs
- **React Native in VS Code**: https://code.visualstudio.com/docs/nodejs/reactnative-tutorial
- **Python in VS Code**: https://code.visualstudio.com/docs/python/python-tutorial

---

## 🎯 Recommended Workflow

### Daily Development:

1. **Open workspace**: `code basketball-stats-tracker.code-workspace`
2. **Pull latest changes**: Use Source Control panel
3. **Start app(s)**: Use Run and Debug panel
4. **Make changes**: Code with IntelliSense
5. **Auto-save**: Changes save automatically
6. **Test**: Hot reload for App 1, restart App 2
7. **Commit**: Use Source Control panel

---

## ✅ Quick Checklist

Before first run:

- [ ] Workspace file opened
- [ ] Recommended extensions installed
- [ ] Node.js installed (for App 1)
- [ ] Python installed (for App 2)
- [ ] Tesseract OCR installed (for App 2)
- [ ] Dependencies installed (use tasks)

---

**You're ready to develop in VS Code! Press F5 to start.** 🚀
