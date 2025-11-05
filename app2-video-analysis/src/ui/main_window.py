"""
Main GUI Window for Basketball Video Analysis
Uses tkinter for cross-platform desktop GUI.
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import cv2
from PIL import Image, ImageTk
import threading
from typing import Optional, List
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from src.video_processor import VideoProcessor, PlayerDetection, draw_detections
from src.jersey_detector import JerseyDetector
from src.team_detector import TeamDetector
from src.stat_extractor import StatExtractor, PlayerStats


class VideoAnalysisWindow:
    """Main window for video analysis application."""

    def __init__(self, root):
        """Initialize the main window."""
        self.root = root
        self.root.title("Basketball Video Analysis - Synergy Style")
        self.root.geometry("1400x900")

        # Modules
        self.video_processor = VideoProcessor()
        self.jersey_detector = JerseyDetector()
        self.team_detector = TeamDetector()
        self.stat_extractor = StatExtractor()

        # State
        self.current_frame: Optional[cv2.ndarray] = None
        self.current_frame_number: int = 0
        self.current_players: List[PlayerDetection] = []
        self.selected_player: Optional[PlayerDetection] = None
        self.is_playing: bool = False
        self.video_path: Optional[str] = None

        self.setup_ui()

    def setup_ui(self):
        """Setup the user interface."""
        # Menu bar
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)

        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Open Video", command=self.load_video)
        file_menu.add_separator()
        file_menu.add_command(label="Export Stats (CSV)", command=self.export_stats)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.root.quit)

        # Main container
        main_container = ttk.Frame(self.root)
        main_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Left panel - Video display
        left_panel = ttk.Frame(main_container)
        left_panel.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Video canvas
        self.canvas = tk.Canvas(left_panel, bg='black', width=960, height=540)
        self.canvas.pack(fill=tk.BOTH, expand=True)

        # Video controls
        controls_frame = ttk.Frame(left_panel)
        controls_frame.pack(fill=tk.X, pady=5)

        self.play_button = ttk.Button(controls_frame, text="Play", command=self.toggle_play)
        self.play_button.pack(side=tk.LEFT, padx=5)

        ttk.Button(controls_frame, text="Previous Frame", command=self.prev_frame).pack(side=tk.LEFT, padx=5)
        ttk.Button(controls_frame, text="Next Frame", command=self.next_frame).pack(side=tk.LEFT, padx=5)

        # Timeline slider
        self.timeline = ttk.Scale(controls_frame, from_=0, to=100, orient=tk.HORIZONTAL,
                                  command=self.on_timeline_change)
        self.timeline.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)

        self.time_label = ttk.Label(controls_frame, text="00:00 / 00:00")
        self.time_label.pack(side=tk.LEFT, padx=5)

        # Right panel - Stats and controls
        right_panel = ttk.Frame(main_container, width=400)
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, padx=(10, 0))
        right_panel.pack_propagate(False)

        # Team detection section
        team_frame = ttk.LabelFrame(right_panel, text="Team Detection", padding=10)
        team_frame.pack(fill=tk.X, pady=5)

        ttk.Button(team_frame, text="Auto-Detect Teams", command=self.auto_detect_teams).pack(fill=tk.X, pady=2)
        ttk.Button(team_frame, text="Detect Jerseys", command=self.detect_jerseys).pack(fill=tk.X, pady=2)

        # Player list
        player_frame = ttk.LabelFrame(right_panel, text="Detected Players", padding=10)
        player_frame.pack(fill=tk.BOTH, expand=True, pady=5)

        # Scrollable player list
        list_container = ttk.Frame(player_frame)
        list_container.pack(fill=tk.BOTH, expand=True)

        scrollbar = ttk.Scrollbar(list_container)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.player_listbox = tk.Listbox(list_container, yscrollcommand=scrollbar.set)
        self.player_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.player_listbox.yview)

        self.player_listbox.bind('<<ListboxSelect>>', self.on_player_select)

        # Stat entry section
        stat_frame = ttk.LabelFrame(right_panel, text="Add Stats", padding=10)
        stat_frame.pack(fill=tk.X, pady=5)

        # Selected player info
        self.selected_label = ttk.Label(stat_frame, text="No player selected")
        self.selected_label.pack(fill=tk.X, pady=5)

        # Stat buttons grid
        stat_grid = ttk.Frame(stat_frame)
        stat_grid.pack(fill=tk.X)

        stats = [
            ("2PT Made", "fgm2"), ("2PT Miss", "fga2"),
            ("3PT Made", "fgm3"), ("3PT Miss", "fga3"),
            ("FT Made", "ftm"), ("FT Miss", "fta"),
            ("Rebound", "rebounds")
        ]

        row, col = 0, 0
        for stat_label, stat_type in stats:
            btn = ttk.Button(stat_grid, text=stat_label,
                           command=lambda st=stat_type: self.add_stat(st))
            btn.grid(row=row, column=col, padx=2, pady=2, sticky='ew')
            col += 1
            if col > 1:
                col = 0
                row += 1

        stat_grid.columnconfigure(0, weight=1)
        stat_grid.columnconfigure(1, weight=1)

        # Stats display
        stats_display_frame = ttk.LabelFrame(right_panel, text="Current Stats", padding=10)
        stats_display_frame.pack(fill=tk.X, pady=5)

        self.stats_text = tk.Text(stats_display_frame, height=10, wrap=tk.WORD)
        self.stats_text.pack(fill=tk.BOTH, expand=True)

        # Status bar
        self.status_label = ttk.Label(self.root, text="Ready", relief=tk.SUNKEN, anchor=tk.W)
        self.status_label.pack(side=tk.BOTTOM, fill=tk.X)

    def load_video(self):
        """Load a video file."""
        file_path = filedialog.askopenfilename(
            title="Select Basketball Game Video",
            filetypes=[
                ("Video files", "*.mp4 *.avi *.mov *.mkv"),
                ("All files", "*.*")
            ]
        )

        if file_path:
            self.video_path = file_path
            if self.video_processor.load_video(file_path):
                self.status_label.config(text=f"Loaded: {os.path.basename(file_path)}")
                self.timeline.config(to=self.video_processor.total_frames - 1)
                self.current_frame_number = 0
                self.show_frame(0)
                messagebox.showinfo("Success", "Video loaded successfully!")
            else:
                messagebox.showerror("Error", "Failed to load video")

    def show_frame(self, frame_number: int):
        """Display a specific frame."""
        frame = self.video_processor.get_frame(frame_number)

        if frame is None:
            return

        self.current_frame = frame
        self.current_frame_number = frame_number

        # Detect players
        self.current_players = self.video_processor.detect_players(frame)

        # Draw detections
        display_frame = draw_detections(frame, self.current_players)

        # Convert to PhotoImage and display
        self.display_image(display_frame)

        # Update timeline and time label
        self.timeline.set(frame_number)
        current_time = frame_number / self.video_processor.fps
        total_time = self.video_processor.total_frames / self.video_processor.fps
        self.time_label.config(text=f"{self.format_time(current_time)} / {self.format_time(total_time)}")

        # Update player list
        self.update_player_list()

    def display_image(self, frame):
        """Display frame on canvas."""
        # Resize to fit canvas
        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()

        if canvas_width <= 1 or canvas_height <= 1:
            canvas_width, canvas_height = 960, 540

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_resized = cv2.resize(frame_rgb, (canvas_width, canvas_height))

        image = Image.fromarray(frame_resized)
        photo = ImageTk.PhotoImage(image)

        self.canvas.delete("all")
        self.canvas.create_image(0, 0, anchor=tk.NW, image=photo)
        self.canvas.image = photo  # Keep a reference

    def toggle_play(self):
        """Toggle play/pause."""
        self.is_playing = not self.is_playing

        if self.is_playing:
            self.play_button.config(text="Pause")
            self.play_video()
        else:
            self.play_button.config(text="Play")

    def play_video(self):
        """Play video in a separate thread."""
        if not self.is_playing:
            return

        if self.current_frame_number < self.video_processor.total_frames - 1:
            self.current_frame_number += 1
            self.show_frame(self.current_frame_number)
            self.root.after(int(1000 / self.video_processor.fps), self.play_video)
        else:
            self.is_playing = False
            self.play_button.config(text="Play")

    def prev_frame(self):
        """Go to previous frame."""
        if self.current_frame_number > 0:
            self.current_frame_number -= 1
            self.show_frame(self.current_frame_number)

    def next_frame(self):
        """Go to next frame."""
        if self.current_frame_number < self.video_processor.total_frames - 1:
            self.current_frame_number += 1
            self.show_frame(self.current_frame_number)

    def on_timeline_change(self, value):
        """Handle timeline slider change."""
        if not self.is_playing:
            frame_num = int(float(value))
            self.show_frame(frame_num)

    def update_player_list(self):
        """Update the player listbox."""
        self.player_listbox.delete(0, tk.END)

        for i, player in enumerate(self.current_players):
            jersey = player.jersey_number if player.jersey_number else "Unknown"
            team = player.team if player.team else "?"
            track_id = player.track_id if player.track_id is not None else "?"

            label = f"ID:{track_id} | #{jersey} | {team} | Conf:{player.confidence:.2f}"
            self.player_listbox.insert(tk.END, label)

    def on_player_select(self, event):
        """Handle player selection."""
        selection = self.player_listbox.curselection()
        if selection:
            idx = selection[0]
            if idx < len(self.current_players):
                self.selected_player = self.current_players[idx]
                jersey = self.selected_player.jersey_number or "Unknown"
                team = self.selected_player.team or "Unknown"
                self.selected_label.config(text=f"Selected: #{jersey} ({team})")

    def auto_detect_teams(self):
        """Auto-detect teams in current frame."""
        if self.current_frame is None or not self.current_players:
            messagebox.showwarning("Warning", "No players detected in current frame")
            return

        # Extract jersey regions
        jersey_regions = []
        for player in self.current_players:
            x, y, w, h = player.bbox
            player_crop = self.current_frame[y:y+h, x:x+w]
            jersey_regions.append(player_crop)

        # Auto-detect teams
        teams = self.team_detector.auto_detect_teams(self.current_frame, jersey_regions)

        # Assign teams to players
        for team_name, player_indices in teams.items():
            for idx in player_indices:
                if idx < len(self.current_players):
                    self.current_players[idx].team = team_name

        self.update_player_list()
        self.show_frame(self.current_frame_number)
        messagebox.showinfo("Success", f"Detected {len(teams)} teams")

    def detect_jerseys(self):
        """Detect jersey numbers for all players."""
        if self.current_frame is None or not self.current_players:
            messagebox.showwarning("Warning", "No players detected in current frame")
            return

        detected_count = 0
        for player in self.current_players:
            x, y, w, h = player.bbox
            player_crop = self.current_frame[y:y+h, x:x+w]

            detection = self.jersey_detector.detect_number(player_crop)

            if detection and detection.confidence > 0.6:
                player.jersey_number = detection.number
                detected_count += 1

        self.update_player_list()
        self.show_frame(self.current_frame_number)
        messagebox.showinfo("Success", f"Detected {detected_count} jersey numbers")

    def add_stat(self, stat_type: str):
        """Add a stat for the selected player."""
        if not self.selected_player:
            messagebox.showwarning("Warning", "Please select a player first")
            return

        if not self.selected_player.jersey_number or not self.selected_player.team:
            messagebox.showwarning("Warning", "Player jersey number and team must be detected first")
            return

        # Add stat
        self.stat_extractor.update_player_stats(
            self.selected_player.jersey_number,
            self.selected_player.team,
            stat_type,
            increment=1
        )

        # Update stats display
        self.update_stats_display()

        self.status_label.config(text=f"Added {stat_type} for #{self.selected_player.jersey_number}")

    def update_stats_display(self):
        """Update the stats text display."""
        self.stats_text.delete(1.0, tk.END)

        stats = self.stat_extractor.get_all_stats()

        for player_stats in stats:
            text = f"#{player_stats['jersey_number']} ({player_stats['team']})\n"
            text += f"  Points: {player_stats['points']}\n"
            text += f"  FG: {player_stats['fgm2'] + player_stats['fgm3']}/{player_stats['fga2'] + player_stats['fga3']}\n"
            text += f"  3PT: {player_stats['fgm3']}/{player_stats['fga3']}\n"
            text += f"  FT: {player_stats['ftm']}/{player_stats['fta']}\n"
            text += f"  REB: {player_stats['rebounds']}\n"
            text += "\n"

            self.stats_text.insert(tk.END, text)

    def export_stats(self):
        """Export statistics to CSV."""
        if not self.stat_extractor.player_stats:
            messagebox.showwarning("Warning", "No statistics to export")
            return

        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if file_path:
            self.stat_extractor.export_to_csv(file_path)
            messagebox.showinfo("Success", f"Stats exported to {file_path}")

    @staticmethod
    def format_time(seconds: float) -> str:
        """Format seconds as MM:SS."""
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{minutes:02d}:{secs:02d}"


def main():
    """Main entry point."""
    root = tk.Tk()
    app = VideoAnalysisWindow(root)
    root.mainloop()


if __name__ == "__main__":
    main()
