"""
Jersey Number Detection Module
Uses OCR (Tesseract) to detect and read jersey numbers from player detections.
"""

import cv2
import numpy as np
import pytesseract
from typing import List, Tuple, Optional
from dataclasses import dataclass


@dataclass
class JerseyDetection:
    """Represents a detected jersey number."""
    number: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # x, y, w, h
    team: Optional[str] = None


class JerseyDetector:
    """Detects and recognizes jersey numbers from player images."""

    def __init__(self, tesseract_path: Optional[str] = None):
        """
        Initialize the jersey detector.

        Args:
            tesseract_path: Path to tesseract executable (if not in PATH)
        """
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path

        # Configure Tesseract for number recognition
        self.config = '--psm 7 -c tessedit_char_whitelist=0123456789'

    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess image for better OCR results.

        Args:
            image: Input image (BGR format)

        Returns:
            Preprocessed grayscale image
        """
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Apply bilateral filter to reduce noise while keeping edges sharp
        filtered = cv2.bilateralFilter(gray, 11, 17, 17)

        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            filtered, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 11, 2
        )

        # Apply morphological operations to clean up
        kernel = np.ones((3, 3), np.uint8)
        morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        return morph

    def extract_jersey_region(
        self,
        player_image: np.ndarray
    ) -> np.ndarray:
        """
        Extract the likely jersey region from a player image.
        Focuses on the chest/torso area where numbers typically appear.

        Args:
            player_image: Cropped image of player

        Returns:
            Cropped jersey region
        """
        h, w = player_image.shape[:2]

        # Jersey numbers typically appear in the upper-middle portion
        # of the player's body (chest area)
        start_y = int(h * 0.15)  # Start at 15% from top
        end_y = int(h * 0.55)    # End at 55% from top
        start_x = int(w * 0.25)  # Center horizontally
        end_x = int(w * 0.75)

        jersey_region = player_image[start_y:end_y, start_x:end_x]

        return jersey_region

    def detect_number(
        self,
        player_image: np.ndarray,
        team_color: Optional[Tuple[int, int, int]] = None
    ) -> Optional[JerseyDetection]:
        """
        Detect and recognize jersey number from player image.

        Args:
            player_image: Cropped image of player (BGR format)
            team_color: Optional BGR color to filter jersey region

        Returns:
            JerseyDetection object if number found, None otherwise
        """
        # Extract jersey region
        jersey_region = self.extract_jersey_region(player_image)

        # Preprocess
        processed = self.preprocess_image(jersey_region)

        # Try both normal and inverted images (for dark vs light jerseys)
        images_to_try = [processed, cv2.bitwise_not(processed)]

        best_detection = None
        best_confidence = 0.0

        for img in images_to_try:
            # Run OCR
            data = pytesseract.image_to_data(
                img, config=self.config, output_type=pytesseract.Output.DICT
            )

            # Extract number with highest confidence
            for i, text in enumerate(data['text']):
                if text.strip().isdigit():
                    conf = float(data['conf'][i])
                    if conf > best_confidence:
                        best_confidence = conf
                        x, y, w, h = (
                            data['left'][i],
                            data['top'][i],
                            data['width'][i],
                            data['height'][i]
                        )
                        best_detection = JerseyDetection(
                            number=text.strip(),
                            confidence=conf / 100.0,  # Normalize to 0-1
                            bbox=(x, y, w, h)
                        )

        return best_detection if best_confidence > 50 else None

    def detect_multiple_players(
        self,
        frame: np.ndarray,
        player_bboxes: List[Tuple[int, int, int, int]]
    ) -> List[Optional[JerseyDetection]]:
        """
        Detect jersey numbers for multiple players in a frame.

        Args:
            frame: Full frame image
            player_bboxes: List of player bounding boxes (x, y, w, h)

        Returns:
            List of JerseyDetection objects (or None for undetected)
        """
        detections = []

        for bbox in player_bboxes:
            x, y, w, h = bbox
            player_crop = frame[y:y+h, x:x+w]

            detection = self.detect_number(player_crop)
            detections.append(detection)

        return detections

    def track_jersey_temporal(
        self,
        detections_history: List[List[Optional[JerseyDetection]]],
        player_idx: int
    ) -> Optional[str]:
        """
        Use temporal information to improve jersey number detection.
        Takes the most common detection across multiple frames.

        Args:
            detections_history: History of detections across frames
            player_idx: Index of the player to track

        Returns:
            Most likely jersey number
        """
        numbers = []

        for frame_detections in detections_history:
            if player_idx < len(frame_detections):
                detection = frame_detections[player_idx]
                if detection and detection.confidence > 0.5:
                    numbers.append(detection.number)

        if not numbers:
            return None

        # Return most common number
        return max(set(numbers), key=numbers.count)


def visualize_detection(
    image: np.ndarray,
    detection: JerseyDetection
) -> np.ndarray:
    """
    Visualize jersey detection on image.

    Args:
        image: Input image
        detection: JerseyDetection object

    Returns:
        Image with detection visualization
    """
    result = image.copy()

    if detection:
        x, y, w, h = detection.bbox
        cv2.rectangle(result, (x, y), (x+w, y+h), (0, 255, 0), 2)
        label = f"#{detection.number} ({detection.confidence:.2f})"
        cv2.putText(
            result, label, (x, y-10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2
        )

    return result
