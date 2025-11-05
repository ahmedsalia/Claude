"""
Video Processing Module
Handles video loading, frame extraction, and player detection using YOLO.
"""

import cv2
import numpy as np
from typing import List, Tuple, Optional, Generator
from dataclasses import dataclass
from ultralytics import YOLO
import torch


@dataclass
class PlayerDetection:
    """Represents a detected player in a frame."""
    bbox: Tuple[int, int, int, int]  # x, y, w, h
    confidence: float
    track_id: Optional[int] = None
    jersey_number: Optional[str] = None
    team: Optional[str] = None


@dataclass
class FrameData:
    """Data for a single frame."""
    frame_number: int
    timestamp: float
    frame: np.ndarray
    players: List[PlayerDetection]


class VideoProcessor:
    """Processes basketball game videos and detects players."""

    def __init__(self, model_path: Optional[str] = None, device: str = 'auto'):
        """
        Initialize video processor.

        Args:
            model_path: Path to custom YOLO model (uses default if None)
            device: Device to use ('cpu', 'cuda', or 'auto')
        """
        # Determine device
        if device == 'auto':
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        else:
            self.device = device

        # Load YOLO model
        if model_path:
            self.model = YOLO(model_path)
        else:
            # Use YOLOv8 pre-trained model
            self.model = YOLO('yolov8n.pt')  # nano model for speed

        self.model.to(self.device)

        # Video properties
        self.cap: Optional[cv2.VideoCapture] = None
        self.fps: float = 0
        self.total_frames: int = 0
        self.width: int = 0
        self.height: int = 0

    def load_video(self, video_path: str) -> bool:
        """
        Load video file.

        Args:
            video_path: Path to video file

        Returns:
            True if successful, False otherwise
        """
        self.cap = cv2.VideoCapture(video_path)

        if not self.cap.isOpened():
            return False

        # Get video properties
        self.fps = self.cap.get(cv2.CAP_PROP_FPS)
        self.total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self.width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        return True

    def get_frame(self, frame_number: int) -> Optional[np.ndarray]:
        """
        Get specific frame from video.

        Args:
            frame_number: Frame number to retrieve

        Returns:
            Frame as numpy array, or None if failed
        """
        if not self.cap:
            return None

        self.cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        ret, frame = self.cap.read()

        return frame if ret else None

    def detect_players(
        self,
        frame: np.ndarray,
        conf_threshold: float = 0.5
    ) -> List[PlayerDetection]:
        """
        Detect players (people) in a frame using YOLO.

        Args:
            frame: Input frame
            conf_threshold: Confidence threshold for detections

        Returns:
            List of PlayerDetection objects
        """
        # Run YOLO detection
        results = self.model(frame, verbose=False)[0]

        players = []

        for box in results.boxes:
            # Filter for person class (class 0 in COCO dataset)
            if int(box.cls[0]) == 0:
                conf = float(box.conf[0])

                if conf >= conf_threshold:
                    # Get bounding box
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    x, y, w, h = int(x1), int(y1), int(x2-x1), int(y2-y1)

                    # Get track ID if available
                    track_id = int(box.id[0]) if box.id is not None else None

                    players.append(PlayerDetection(
                        bbox=(x, y, w, h),
                        confidence=conf,
                        track_id=track_id
                    ))

        return players

    def detect_players_with_tracking(
        self,
        frame: np.ndarray,
        conf_threshold: float = 0.5
    ) -> List[PlayerDetection]:
        """
        Detect and track players across frames.

        Args:
            frame: Input frame
            conf_threshold: Confidence threshold

        Returns:
            List of PlayerDetection objects with track IDs
        """
        # Run YOLO with tracking
        results = self.model.track(frame, persist=True, verbose=False)[0]

        players = []

        if results.boxes.id is not None:
            for box in results.boxes:
                if int(box.cls[0]) == 0:  # Person class
                    conf = float(box.conf[0])

                    if conf >= conf_threshold:
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        x, y, w, h = int(x1), int(y1), int(x2-x1), int(y2-y1)

                        track_id = int(box.id[0]) if box.id is not None else None

                        players.append(PlayerDetection(
                            bbox=(x, y, w, h),
                            confidence=conf,
                            track_id=track_id
                        ))

        return players

    def process_video(
        self,
        video_path: str,
        frame_skip: int = 5,
        conf_threshold: float = 0.5,
        use_tracking: bool = True
    ) -> Generator[FrameData, None, None]:
        """
        Process entire video and yield frame data.

        Args:
            video_path: Path to video file
            frame_skip: Process every Nth frame (for speed)
            conf_threshold: Detection confidence threshold
            use_tracking: Whether to use object tracking

        Yields:
            FrameData objects for each processed frame
        """
        if not self.load_video(video_path):
            raise ValueError(f"Could not load video: {video_path}")

        frame_number = 0

        while True:
            ret, frame = self.cap.read()

            if not ret:
                break

            # Skip frames if needed
            if frame_number % frame_skip == 0:
                # Detect players
                if use_tracking:
                    players = self.detect_players_with_tracking(frame, conf_threshold)
                else:
                    players = self.detect_players(frame, conf_threshold)

                # Calculate timestamp
                timestamp = frame_number / self.fps

                yield FrameData(
                    frame_number=frame_number,
                    timestamp=timestamp,
                    frame=frame,
                    players=players
                )

            frame_number += 1

    def filter_players_on_court(
        self,
        players: List[PlayerDetection],
        court_bounds: Optional[Tuple[int, int, int, int]] = None
    ) -> List[PlayerDetection]:
        """
        Filter players to only include those on the basketball court.

        Args:
            players: List of player detections
            court_bounds: Optional court bounding box (x, y, w, h)

        Returns:
            Filtered list of players
        """
        if not court_bounds:
            # Simple heuristic: filter out small detections (likely audience)
            # and detections near edges (coaches, refs)
            filtered = []
            for player in players:
                x, y, w, h = player.bbox
                # Minimum size threshold
                if w > 30 and h > 50:
                    # Not too close to edges
                    if x > 50 and (x + w) < (self.width - 50):
                        filtered.append(player)
            return filtered
        else:
            # Filter based on court bounds
            cx, cy, cw, ch = court_bounds
            filtered = []
            for player in players:
                x, y, w, h = player.bbox
                # Check if player center is within court bounds
                center_x = x + w // 2
                center_y = y + h // 2

                if (cx <= center_x <= cx + cw) and (cy <= center_y <= cy + ch):
                    filtered.append(player)

            return filtered

    def release(self):
        """Release video capture resources."""
        if self.cap:
            self.cap.release()

    def __del__(self):
        """Cleanup on deletion."""
        self.release()


def draw_detections(
    frame: np.ndarray,
    players: List[PlayerDetection],
    show_ids: bool = True,
    show_jersey: bool = True
) -> np.ndarray:
    """
    Draw player detections on frame.

    Args:
        frame: Input frame
        players: List of player detections
        show_ids: Whether to show track IDs
        show_jersey: Whether to show jersey numbers

    Returns:
        Frame with visualizations
    """
    result = frame.copy()

    for player in players:
        x, y, w, h = player.bbox

        # Draw bounding box
        color = (0, 255, 0)
        cv2.rectangle(result, (x, y), (x+w, y+h), color, 2)

        # Build label
        labels = []
        if show_ids and player.track_id is not None:
            labels.append(f"ID: {player.track_id}")
        if show_jersey and player.jersey_number:
            labels.append(f"#{player.jersey_number}")
        if player.team:
            labels.append(player.team)

        # Draw labels
        label_y = y - 10
        for label in labels:
            cv2.putText(
                result, label, (x, label_y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2
            )
            label_y -= 20

        # Draw confidence
        conf_label = f"{player.confidence:.2f}"
        cv2.putText(
            result, conf_label, (x, y+h+20),
            cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1
        )

    return result
