#!/usr/bin/env python3
"""
Basketball Video Analysis Application
Main entry point for the desktop application.
"""

import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.ui.main_window import main

if __name__ == "__main__":
    print("=" * 60)
    print("Basketball Video Analysis - Synergy Style")
    print("=" * 60)
    print("\nStarting application...")
    print("\nFeatures:")
    print("  - Video playback and frame navigation")
    print("  - Automatic player detection using YOLO")
    print("  - Jersey number recognition with OCR")
    print("  - Team detection by jersey color")
    print("  - Manual stat tracking with visual interface")
    print("  - Export stats to CSV")
    print("\nNote: First run will download YOLO model (~6MB)")
    print("=" * 60)
    print()

    main()
