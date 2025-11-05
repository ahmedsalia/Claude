"""
Basketball Statistics Extraction Module
Analyzes player movements and actions to extract game statistics.
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from collections import defaultdict
import cv2


@dataclass
class PlayerStats:
    """Basketball statistics for a player."""
    jersey_number: str
    team: str

    # Shooting
    fgm2: int = 0  # 2-point field goals made
    fga2: int = 0  # 2-point field goals attempted
    fgm3: int = 0  # 3-point field goals made
    fga3: int = 0  # 3-point field goals attempted
    ftm: int = 0   # Free throws made
    fta: int = 0   # Free throws attempted

    # Rebounds (estimated from positions)
    rebounds: int = 0

    # Possessions (estimated)
    possessions: int = 0

    # Other trackable stats
    time_on_court: float = 0.0  # Seconds

    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        return {
            'jersey_number': self.jersey_number,
            'team': self.team,
            'fgm2': self.fgm2,
            'fga2': self.fga2,
            'fgm3': self.fgm3,
            'fga3': self.fga3,
            'ftm': self.ftm,
            'fta': self.fta,
            'rebounds': self.rebounds,
            'possessions': self.possessions,
            'time_on_court': round(self.time_on_court, 1),
            'points': self.fgm2 * 2 + self.fgm3 * 3 + self.ftm,
        }


@dataclass
class GameEvent:
    """Represents a game event (shot, rebound, etc.)."""
    timestamp: float
    frame_number: int
    event_type: str  # 'shot_2pt', 'shot_3pt', 'rebound', etc.
    player_id: Optional[str]
    location: Tuple[int, int]
    made: Optional[bool] = None  # For shots


class StatExtractor:
    """Extracts basketball statistics from video analysis."""

    def __init__(self):
        """Initialize stat extractor."""
        self.player_stats: Dict[str, PlayerStats] = {}
        self.events: List[GameEvent] = []

        # Tracking data
        self.player_positions: Dict[str, List[Tuple[float, int, int]]] = defaultdict(list)
        self.hoop_location: Optional[Tuple[int, int]] = None

    def detect_hoop(self, frame: np.ndarray) -> Optional[Tuple[int, int]]:
        """
        Detect basketball hoop location in frame.
        Uses color detection (orange rim) and circle detection.

        Args:
            frame: Input frame

        Returns:
            (x, y) center of hoop, or None if not found
        """
        # Convert to HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Orange color range for rim
        lower_orange = np.array([5, 100, 100])
        upper_orange = np.array([15, 255, 255])

        mask = cv2.inRange(hsv, lower_orange, upper_orange)

        # Find circles
        circles = cv2.HoughCircles(
            mask,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=100,
            param1=50,
            param2=30,
            minRadius=10,
            maxRadius=50
        )

        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")
            # Return the first (most prominent) circle
            if len(circles) > 0:
                x, y, r = circles[0]
                return (x, y)

        return None

    def track_player_position(
        self,
        player_id: str,
        timestamp: float,
        position: Tuple[int, int]
    ):
        """
        Track player position over time.

        Args:
            player_id: Player identifier (track_id or jersey)
            timestamp: Time in video
            position: (x, y) position
        """
        self.player_positions[player_id].append((timestamp, position[0], position[1]))

    def estimate_shot_attempt(
        self,
        player_id: str,
        positions: List[Tuple[float, int, int]],
        window: float = 2.0
    ) -> List[float]:
        """
        Estimate shot attempts based on player movement toward hoop.
        This is a simplified heuristic - real implementation would use
        pose estimation and ball tracking.

        Args:
            player_id: Player identifier
            positions: List of (timestamp, x, y) positions
            window: Time window in seconds to analyze

        Returns:
            List of timestamps where shots were likely attempted
        """
        if not self.hoop_location or len(positions) < 10:
            return []

        shot_timestamps = []
        hoop_x, hoop_y = self.hoop_location

        for i in range(5, len(positions) - 5):
            t, x, y = positions[i]

            # Calculate distance to hoop
            dist_to_hoop = np.sqrt((x - hoop_x)**2 + (y - hoop_y)**2)

            # Look at velocity toward hoop
            prev_positions = positions[max(0, i-5):i]
            if prev_positions:
                prev_x = np.mean([p[1] for p in prev_positions])
                prev_y = np.mean([p[2] for p in prev_positions])

                # Calculate if moving toward hoop
                prev_dist = np.sqrt((prev_x - hoop_x)**2 + (prev_y - hoop_y)**2)

                # Simple heuristic: rapid movement toward hoop might be a shot
                if prev_dist > dist_to_hoop and dist_to_hoop < 300:
                    # Check if we haven't recorded a shot recently
                    if not shot_timestamps or (t - shot_timestamps[-1]) > window:
                        shot_timestamps.append(t)

        return shot_timestamps

    def add_manual_event(
        self,
        timestamp: float,
        frame_number: int,
        event_type: str,
        player_id: str,
        location: Tuple[int, int],
        made: Optional[bool] = None
    ):
        """
        Manually add a game event (for user corrections).

        Args:
            timestamp: Time in video
            frame_number: Frame number
            event_type: Type of event
            player_id: Player identifier
            location: (x, y) location
            made: Whether shot was made (for shot events)
        """
        event = GameEvent(
            timestamp=timestamp,
            frame_number=frame_number,
            event_type=event_type,
            player_id=player_id,
            location=location,
            made=made
        )

        self.events.append(event)
        self._update_stats_from_event(event)

    def _update_stats_from_event(self, event: GameEvent):
        """Update player statistics from event."""
        if not event.player_id:
            return

        # Get or create player stats
        if event.player_id not in self.player_stats:
            # This would be populated with actual jersey number and team
            self.player_stats[event.player_id] = PlayerStats(
                jersey_number=event.player_id,
                team="Unknown"
            )

        stats = self.player_stats[event.player_id]

        # Update stats based on event type
        if event.event_type == 'shot_2pt':
            stats.fga2 += 1
            if event.made:
                stats.fgm2 += 1

        elif event.event_type == 'shot_3pt':
            stats.fga3 += 1
            if event.made:
                stats.fgm3 += 1

        elif event.event_type == 'free_throw':
            stats.fta += 1
            if event.made:
                stats.ftm += 1

        elif event.event_type == 'rebound':
            stats.rebounds += 1

        elif event.event_type == 'possession':
            stats.possessions += 1

    def update_player_stats(
        self,
        jersey_number: str,
        team: str,
        stat_type: str,
        increment: int = 1
    ):
        """
        Update player statistics directly.

        Args:
            jersey_number: Player's jersey number
            team: Player's team
            stat_type: Type of stat to update
            increment: Amount to increment
        """
        key = f"{team}_{jersey_number}"

        if key not in self.player_stats:
            self.player_stats[key] = PlayerStats(
                jersey_number=jersey_number,
                team=team
            )

        stats = self.player_stats[key]

        # Update the appropriate stat
        if hasattr(stats, stat_type):
            current_value = getattr(stats, stat_type)
            setattr(stats, stat_type, current_value + increment)

    def get_player_stats(self, jersey_number: str, team: str) -> Optional[PlayerStats]:
        """Get stats for a specific player."""
        key = f"{team}_{jersey_number}"
        return self.player_stats.get(key)

    def get_all_stats(self) -> List[Dict]:
        """Get all player statistics as list of dictionaries."""
        return [stats.to_dict() for stats in self.player_stats.values()]

    def export_to_dataframe(self) -> pd.DataFrame:
        """Export statistics to pandas DataFrame."""
        return pd.DataFrame(self.get_all_stats())

    def export_to_csv(self, filename: str):
        """Export statistics to CSV file."""
        df = self.export_to_dataframe()
        df.to_csv(filename, index=False)

    def export_events_to_csv(self, filename: str):
        """Export game events to CSV file."""
        events_data = [
            {
                'timestamp': e.timestamp,
                'frame_number': e.frame_number,
                'event_type': e.event_type,
                'player_id': e.player_id,
                'location_x': e.location[0],
                'location_y': e.location[1],
                'made': e.made
            }
            for e in self.events
        ]

        df = pd.DataFrame(events_data)
        df.to_csv(filename, index=False)

    def get_team_stats(self, team: str) -> Dict:
        """
        Get aggregated team statistics.

        Args:
            team: Team name

        Returns:
            Dictionary of team stats
        """
        team_players = [s for s in self.player_stats.values() if s.team == team]

        if not team_players:
            return {}

        return {
            'team': team,
            'total_points': sum(p.fgm2 * 2 + p.fgm3 * 3 + p.ftm for p in team_players),
            'total_fgm': sum(p.fgm2 + p.fgm3 for p in team_players),
            'total_fga': sum(p.fga2 + p.fga3 for p in team_players),
            'fg_percentage': self._calculate_percentage(
                sum(p.fgm2 + p.fgm3 for p in team_players),
                sum(p.fga2 + p.fga3 for p in team_players)
            ),
            'total_3pm': sum(p.fgm3 for p in team_players),
            'total_3pa': sum(p.fga3 for p in team_players),
            'total_rebounds': sum(p.rebounds for p in team_players),
            'player_count': len(team_players),
        }

    @staticmethod
    def _calculate_percentage(made: int, attempted: int) -> float:
        """Calculate shooting percentage."""
        if attempted == 0:
            return 0.0
        return round((made / attempted) * 100, 1)
