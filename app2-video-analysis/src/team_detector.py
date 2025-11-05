"""
Team Detection Module
Distinguishes between teams based on jersey colors using K-means clustering.
"""

import cv2
import numpy as np
from typing import List, Tuple, Optional, Dict
from dataclasses import dataclass
from sklearn.cluster import KMeans


@dataclass
class TeamColor:
    """Represents a team's dominant jersey color."""
    name: str
    rgb: Tuple[int, int, int]
    hsv_range: Tuple[Tuple[int, int, int], Tuple[int, int, int]]


class TeamDetector:
    """Detects and distinguishes between teams based on jersey colors."""

    def __init__(self):
        """Initialize team detector."""
        self.team_colors: Dict[str, TeamColor] = {}
        self.color_tolerance = 30  # HSV tolerance for color matching

    def extract_dominant_color(
        self,
        jersey_region: np.ndarray,
        n_colors: int = 3
    ) -> Tuple[int, int, int]:
        """
        Extract dominant color from jersey region using K-means.

        Args:
            jersey_region: Image of jersey region (BGR format)
            n_colors: Number of colors to cluster

        Returns:
            Dominant RGB color as tuple
        """
        # Reshape image to be a list of pixels
        pixels = jersey_region.reshape(-1, 3)

        # Remove very dark and very bright pixels (shadows/highlights)
        brightness = np.mean(pixels, axis=1)
        mask = (brightness > 30) & (brightness < 225)
        filtered_pixels = pixels[mask]

        if len(filtered_pixels) < 10:
            filtered_pixels = pixels

        # Perform K-means clustering
        kmeans = KMeans(n_clusters=min(n_colors, len(filtered_pixels)), random_state=42)
        kmeans.fit(filtered_pixels)

        # Get the cluster with most pixels
        labels = kmeans.labels_
        counts = np.bincount(labels)
        dominant_cluster = np.argmax(counts)

        # Get dominant color (BGR)
        dominant_bgr = kmeans.cluster_centers_[dominant_cluster]

        # Convert BGR to RGB
        dominant_rgb = tuple(int(c) for c in dominant_bgr[::-1])

        return dominant_rgb

    def rgb_to_hsv_range(
        self,
        rgb: Tuple[int, int, int],
        tolerance: int = 30
    ) -> Tuple[Tuple[int, int, int], Tuple[int, int, int]]:
        """
        Convert RGB color to HSV range for matching.

        Args:
            rgb: RGB color tuple
            tolerance: Tolerance for color matching

        Returns:
            (lower_hsv, upper_hsv) range
        """
        # Convert RGB to BGR for OpenCV
        bgr = np.uint8([[[rgb[2], rgb[1], rgb[0]]]])
        hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)[0][0]

        # Create range with tolerance
        lower = np.array([
            max(0, hsv[0] - tolerance),
            max(0, hsv[1] - 50),
            max(0, hsv[2] - 50)
        ])
        upper = np.array([
            min(179, hsv[0] + tolerance),
            min(255, hsv[1] + 50),
            min(255, hsv[2] + 50)
        ])

        return (tuple(lower), tuple(upper))

    def register_team(
        self,
        team_name: str,
        jersey_samples: List[np.ndarray]
    ):
        """
        Register a team by analyzing jersey samples.

        Args:
            team_name: Name of the team
            jersey_samples: List of jersey region images
        """
        # Extract colors from all samples
        colors = []
        for sample in jersey_samples:
            color = self.extract_dominant_color(sample)
            colors.append(color)

        # Average the colors
        avg_color = tuple(int(np.mean([c[i] for c in colors])) for i in range(3))

        # Create HSV range
        hsv_range = self.rgb_to_hsv_range(avg_color, self.color_tolerance)

        # Register team
        self.team_colors[team_name] = TeamColor(
            name=team_name,
            rgb=avg_color,
            hsv_range=hsv_range
        )

    def detect_team(
        self,
        jersey_region: np.ndarray
    ) -> Optional[str]:
        """
        Detect which team a player belongs to based on jersey color.

        Args:
            jersey_region: Image of player's jersey region

        Returns:
            Team name or None if no match
        """
        if not self.team_colors:
            return None

        # Extract dominant color
        dominant_color = self.extract_dominant_color(jersey_region)

        # Convert to HSV
        bgr = np.uint8([[[dominant_color[2], dominant_color[1], dominant_color[0]]]])
        hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)[0][0]

        # Compare with registered teams
        best_match = None
        best_score = float('inf')

        for team_name, team_color in self.team_colors.items():
            # Calculate color distance in HSV space
            team_bgr = np.uint8([[[team_color.rgb[2], team_color.rgb[1], team_color.rgb[0]]]])
            team_hsv = cv2.cvtColor(team_bgr, cv2.COLOR_BGR2HSV)[0][0]

            # HSV distance (weighted)
            h_dist = min(abs(hsv[0] - team_hsv[0]), 180 - abs(hsv[0] - team_hsv[0]))
            s_dist = abs(hsv[1] - team_hsv[1])
            v_dist = abs(hsv[2] - team_hsv[2])

            distance = h_dist * 2 + s_dist * 0.5 + v_dist * 0.5

            if distance < best_score:
                best_score = distance
                best_match = team_name

        # Only return match if distance is reasonable
        return best_match if best_score < 80 else None

    def auto_detect_teams(
        self,
        frame: np.ndarray,
        player_regions: List[np.ndarray],
        n_teams: int = 2
    ) -> Dict[str, List[int]]:
        """
        Automatically detect teams by clustering jersey colors.

        Args:
            frame: Full frame image
            player_regions: List of player jersey region images
            n_teams: Expected number of teams

        Returns:
            Dictionary mapping team names to player indices
        """
        if len(player_regions) < n_teams:
            return {}

        # Extract dominant colors for all players
        colors = [self.extract_dominant_color(region) for region in player_regions]
        colors_array = np.array(colors)

        # Cluster colors into teams
        kmeans = KMeans(n_clusters=n_teams, random_state=42)
        team_labels = kmeans.fit_predict(colors_array)

        # Group players by team
        teams = {}
        for team_id in range(n_teams):
            team_name = f"Team {team_id + 1}"
            player_indices = [i for i, label in enumerate(team_labels) if label == team_id]
            teams[team_name] = player_indices

            # Register team color
            team_color = tuple(int(c) for c in kmeans.cluster_centers_[team_id])
            hsv_range = self.rgb_to_hsv_range(team_color)

            self.team_colors[team_name] = TeamColor(
                name=team_name,
                rgb=team_color,
                hsv_range=hsv_range
            )

        return teams

    def get_team_mask(
        self,
        frame: np.ndarray,
        team_name: str
    ) -> np.ndarray:
        """
        Create a binary mask for a specific team's jersey color.

        Args:
            frame: Input frame (BGR)
            team_name: Name of the team

        Returns:
            Binary mask where team jerseys appear white
        """
        if team_name not in self.team_colors:
            return np.zeros(frame.shape[:2], dtype=np.uint8)

        # Convert to HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Get team color range
        team_color = self.team_colors[team_name]
        lower, upper = team_color.hsv_range

        # Create mask
        mask = cv2.inRange(hsv, np.array(lower), np.array(upper))

        # Apply morphological operations to clean up
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

        return mask


def visualize_teams(
    frame: np.ndarray,
    player_bboxes: List[Tuple[int, int, int, int]],
    team_assignments: List[Optional[str]],
    team_colors: Dict[str, Tuple[int, int, int]]
) -> np.ndarray:
    """
    Visualize team assignments on frame.

    Args:
        frame: Input frame
        player_bboxes: List of player bounding boxes
        team_assignments: List of team names for each player
        team_colors: Dictionary mapping team names to display colors

    Returns:
        Frame with team visualization
    """
    result = frame.copy()

    color_map = {
        'Team 1': (0, 255, 0),    # Green
        'Team 2': (255, 0, 0),    # Blue
        None: (128, 128, 128)     # Gray for unknown
    }

    for bbox, team in zip(player_bboxes, team_assignments):
        x, y, w, h = bbox
        color = color_map.get(team, (128, 128, 128))

        cv2.rectangle(result, (x, y), (x+w, y+h), color, 2)

        if team:
            cv2.putText(
                result, team, (x, y-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2
            )

    return result
