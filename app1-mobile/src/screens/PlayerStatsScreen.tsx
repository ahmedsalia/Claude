import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Team, Player } from '../types';
import { getPlayerSummary, calculateFGPercentage } from '../utils/stats';

interface PlayerStatsScreenProps {
  team: Team;
  onBack: () => void;
}

export const PlayerStatsScreen: React.FC<PlayerStatsScreenProps> = ({ team, onBack }) => {
  const renderPlayerStats = (player: Player) => {
    const summary = getPlayerSummary(player);
    const { stats } = player;

    return (
      <View key={player.id} style={styles.playerCard}>
        {/* Player Header */}
        <View style={styles.playerHeader}>
          <View style={styles.playerInfo}>
            <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{summary.points}</Text>
            <Text style={styles.pointsLabel}>PTS</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{summary.rebounds}</Text>
            <Text style={styles.quickStatLabel}>REB</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.ast}</Text>
            <Text style={styles.quickStatLabel}>AST</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.stl}</Text>
            <Text style={styles.quickStatLabel}>STL</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.blk}</Text>
            <Text style={styles.quickStatLabel}>BLK</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.tov}</Text>
            <Text style={styles.quickStatLabel}>TO</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.pf}</Text>
            <Text style={styles.quickStatLabel}>PF</Text>
          </View>
        </View>

        {/* Detailed Shooting Stats */}
        <View style={styles.detailedStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Field Goals</Text>
            <Text style={styles.statValue}>
              {stats.fgm2 + stats.fgm3}/{stats.fga2 + stats.fga3}
            </Text>
            <Text style={styles.statPercentage}>
              {calculateFGPercentage(stats.fgm2 + stats.fgm3, stats.fga2 + stats.fga3)}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>  2-Point</Text>
            <Text style={styles.statValue}>
              {stats.fgm2}/{stats.fga2}
            </Text>
            <Text style={styles.statPercentage}>
              {calculateFGPercentage(stats.fgm2, stats.fga2)}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>  3-Point</Text>
            <Text style={styles.statValue}>
              {stats.fgm3}/{stats.fga3}
            </Text>
            <Text style={styles.statPercentage}>
              {calculateFGPercentage(stats.fgm3, stats.fga3)}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Free Throws</Text>
            <Text style={styles.statValue}>
              {stats.ftm}/{stats.fta}
            </Text>
            <Text style={styles.statPercentage}>
              {calculateFGPercentage(stats.ftm, stats.fta)}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rebounds</Text>
            <Text style={styles.statValue}>{summary.rebounds}</Text>
            <Text style={styles.statDetail}>
              ({stats.oreb} OFF, {stats.dreb} DEF)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Sort players by points
  const sortedPlayers = [...team.players].sort((a, b) => {
    const aPoints = getPlayerSummary(a).points;
    const bPoints = getPlayerSummary(b).points;
    return bPoints - aPoints;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{team.name} Stats</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Stats List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {sortedPlayers.map(renderPlayerStats)}
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
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jerseyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 12,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  pointsBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  detailedStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 60,
    textAlign: 'right',
  },
  statPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    width: 60,
    textAlign: 'right',
  },
  statDetail: {
    fontSize: 12,
    color: '#999',
    width: 60,
    textAlign: 'right',
  },
});
