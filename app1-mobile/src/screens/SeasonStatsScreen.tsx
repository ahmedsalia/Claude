import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Team, Player, PlayerStats } from '../types';
import { calculateFGPercentage } from '../utils/stats';

interface SeasonStatsScreenProps {
  team: Team;
  onBack: () => void;
}

export const SeasonStatsScreen: React.FC<SeasonStatsScreenProps> = ({ team, onBack }) => {
  // Aggregate stats from all games
  const aggregatedStats: { [playerId: string]: { stats: PlayerStats; name: string; jersey: string } } = {};

  // Initialize with current players
  team.players.forEach(player => {
    aggregatedStats[player.id] = {
      stats: {
        fgm2: 0,
        fga2: 0,
        fgm3: 0,
        fga3: 0,
        ftm: 0,
        fta: 0,
        oreb: 0,
        dreb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        tov: 0,
        pf: 0,
      },
      name: player.name,
      jersey: player.jerseyNumber,
    };
  });

  // Aggregate stats from all completed games
  (team.games || []).forEach(game => {
    Object.entries(game.playerStats).forEach(([playerId, stats]) => {
      if (!aggregatedStats[playerId]) {
        // Player no longer on team but has historical stats
        aggregatedStats[playerId] = {
          stats: {
            fgm2: 0,
            fga2: 0,
            fgm3: 0,
            fga3: 0,
            ftm: 0,
            fta: 0,
            oreb: 0,
            dreb: 0,
            ast: 0,
            stl: 0,
            blk: 0,
            tov: 0,
            pf: 0,
          },
          name: game.playerNames[playerId],
          jersey: game.playerJerseys[playerId],
        };
      }

      // Add game stats to season totals
      const playerSeasonStats = aggregatedStats[playerId].stats;
      playerSeasonStats.fgm2 += stats.fgm2 || 0;
      playerSeasonStats.fga2 += (stats.fga2 + stats.fgm2) || 0;
      playerSeasonStats.fgm3 += stats.fgm3 || 0;
      playerSeasonStats.fga3 += (stats.fga3 + stats.fgm3) || 0;
      playerSeasonStats.ftm += stats.ftm || 0;
      playerSeasonStats.fta += (stats.fta + stats.ftm) || 0;
      playerSeasonStats.oreb += stats.oreb || 0;
      playerSeasonStats.dreb += stats.dreb || 0;
      playerSeasonStats.ast += stats.ast || 0;
      playerSeasonStats.stl += stats.stl || 0;
      playerSeasonStats.blk += stats.blk || 0;
      playerSeasonStats.tov += stats.tov || 0;
      playerSeasonStats.pf += stats.pf || 0;
    });
  });

  // Filter out players with no stats
  const playersWithStats = Object.entries(aggregatedStats)
    .filter(([_, data]) => {
      const stats = data.stats;
      return stats.fgm2 + stats.fga2 + stats.fgm3 + stats.fga3 + stats.ftm + stats.fta > 0;
    })
    .map(([playerId, data]) => ({
      id: playerId,
      ...data,
    }));

  // Sort by points
  const sortedPlayers = playersWithStats.sort((a, b) => {
    const aPoints = (a.stats.fgm2 * 2) + (a.stats.fgm3 * 3) + a.stats.ftm;
    const bPoints = (b.stats.fgm2 * 2) + (b.stats.fgm3 * 3) + b.stats.ftm;
    return bPoints - aPoints;
  });

  const renderPlayerStats = (player: typeof sortedPlayers[0]) => {
    const { stats } = player;
    const points = (stats.fgm2 * 2) + (stats.fgm3 * 3) + stats.ftm;
    const rebounds = stats.oreb + stats.dreb;
    const gamesPlayed = (team.games || []).filter(g => g.playerStats[player.id]).length;
    const ppg = gamesPlayed > 0 ? (points / gamesPlayed).toFixed(1) : '0.0';

    return (
      <View key={player.id} style={styles.playerCard}>
        {/* Player Header */}
        <View style={styles.playerHeader}>
          <View style={styles.playerInfo}>
            <Text style={styles.jerseyNumber}>#{player.jersey}</Text>
            <View>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.gamesPlayed}>{gamesPlayed} games</Text>
            </View>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{points}</Text>
            <Text style={styles.pointsLabel}>PTS</Text>
            <Text style={styles.ppgText}>{ppg} PPG</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{rebounds}</Text>
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
            <Text style={styles.statValue}>{rebounds}</Text>
            <Text style={styles.statDetail}>
              ({stats.oreb} OFF, {stats.dreb} DEF)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const totalGames = team.games?.length || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{team.name} Season</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Season Info */}
      <View style={styles.seasonInfo}>
        <Text style={styles.seasonInfoText}>Season Stats - {totalGames} Games Played</Text>
      </View>

      {/* Stats List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {sortedPlayers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No games played yet</Text>
            <Text style={styles.emptyStateSubtext}>Start a game to begin tracking season stats</Text>
          </View>
        ) : (
          sortedPlayers.map(renderPlayerStats)
        )}
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
  seasonInfo: {
    backgroundColor: '#4CAF50',
    padding: 12,
    alignItems: 'center',
  },
  seasonInfoText: {
    fontSize: 16,
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
  gamesPlayed: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
  ppgText: {
    fontSize: 11,
    color: '#E8F5E9',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 20,
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
  },
});
