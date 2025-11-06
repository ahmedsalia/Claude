import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CompletedGame } from '../types';
import { calculateFGPercentage } from '../utils/stats';

interface GameStatsDetailScreenProps {
  game: CompletedGame;
  onBack: () => void;
}

export const GameStatsDetailScreen: React.FC<GameStatsDetailScreenProps> = ({
  game,
  onBack,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderPlayerStats = (playerId: string) => {
    const stats = game.playerStats[playerId];
    const name = game.playerNames[playerId];
    const jersey = game.playerJerseys[playerId];
    const points = (stats.fgm2 * 2) + (stats.fgm3 * 3) + stats.ftm;
    const rebounds = stats.oreb + stats.dreb;

    return (
      <View key={playerId} style={styles.playerCard}>
        <View style={styles.playerHeader}>
          <View style={styles.playerInfo}>
            <Text style={styles.jerseyNumber}>#{jersey}</Text>
            <Text style={styles.playerName}>{name}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{points}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{rebounds}</Text>
            <Text style={styles.statLabel}>REB</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.ast}</Text>
            <Text style={styles.statLabel}>AST</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.stl}</Text>
            <Text style={styles.statLabel}>STL</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.blk}</Text>
            <Text style={styles.statLabel}>BLK</Text>
          </View>
        </View>

        <View style={styles.shootingStats}>
          <Text style={styles.shootingLabel}>
            FG: {stats.fgm2 + stats.fgm3}/{stats.fga2 + stats.fga3} (
            {calculateFGPercentage(stats.fgm2 + stats.fgm3, stats.fga2 + stats.fga3)}%)
          </Text>
          <Text style={styles.shootingLabel}>
            3PT: {stats.fgm3}/{stats.fga3} ({calculateFGPercentage(stats.fgm3, stats.fga3)}%)
          </Text>
          <Text style={styles.shootingLabel}>
            FT: {stats.ftm}/{stats.fta} ({calculateFGPercentage(stats.ftm, stats.fta)}%)
          </Text>
        </View>
      </View>
    );
  };

  // Sort players by points
  const sortedPlayerIds = Object.keys(game.playerStats).sort((a, b) => {
    const aPoints = (game.playerStats[a].fgm2 * 2) + (game.playerStats[a].fgm3 * 3) + game.playerStats[a].ftm;
    const bPoints = (game.playerStats[b].fgm2 * 2) + (game.playerStats[b].fgm3 * 3) + game.playerStats[b].ftm;
    return bPoints - aPoints;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Game Stats</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Game Info */}
        <View style={styles.gameInfo}>
          <Text style={styles.gameDate}>{formatDate(game.date)}</Text>
          <View style={styles.matchup}>
            <Text style={styles.teamName}>{game.teamName}</Text>
            <View style={styles.scoreBox}>
              <Text style={styles.finalScore}>{game.teamScore}</Text>
              <Text style={styles.scoreSeparator}>-</Text>
              <Text style={styles.opponentScoreText}>
                {game.opponentScore !== undefined ? game.opponentScore : '?'}
              </Text>
            </View>
            <Text style={styles.opponentName}>{game.opponent || 'Opponent'}</Text>
          </View>
        </View>

        {/* Player Stats */}
        <Text style={styles.sectionTitle}>Player Statistics</Text>
        {sortedPlayerIds.map(renderPlayerStats)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  gameInfo: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  gameDate: {
    fontSize: 14,
    color: '#E3F2FD',
    textAlign: 'center',
    marginBottom: 12,
  },
  matchup: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  finalScore: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreSeparator: {
    fontSize: 32,
    color: '#fff',
  },
  opponentScoreText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  opponentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E3F2FD',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jerseyNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pointsBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  shootingStats: {
    gap: 4,
  },
  shootingLabel: {
    fontSize: 13,
    color: '#666',
  },
});
