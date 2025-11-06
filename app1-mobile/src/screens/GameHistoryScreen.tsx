import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Team, CompletedGame } from '../types';
import { calculatePlayerPoints } from '../utils/stats';
import { showDestructiveConfirm } from '../utils/alert';

interface GameHistoryScreenProps {
  team: Team;
  onBack: () => void;
  onViewGameStats: (game: CompletedGame) => void;
  onDeleteGame: (gameId: string) => void;
}

export const GameHistoryScreen: React.FC<GameHistoryScreenProps> = ({
  team,
  onBack,
  onViewGameStats,
  onDeleteGame,
}) => {
  const games = team.games || [];

  const handleDeleteGame = (game: CompletedGame, event: any) => {
    event.stopPropagation(); // Prevent triggering the view game action

    showDestructiveConfirm(
      'Delete Game',
      `Delete game from ${formatDate(game.date)}? This cannot be undone.`,
      () => onDeleteGame(game.id),
      'Delete'
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderGameCard = (game: CompletedGame) => {
    // Calculate top scorers
    const scorers = Object.entries(game.playerStats)
      .map(([playerId, stats]) => ({
        name: game.playerNames[playerId],
        points: (stats.fgm2 * 2) + (stats.fgm3 * 3) + stats.ftm,
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);

    return (
      <View key={game.id} style={styles.gameCardContainer}>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => onViewGameStats(game)}
        >
          <View style={styles.gameHeader}>
            <Text style={styles.gameDate}>{formatDate(game.date)}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.teamScore}>{game.teamScore}</Text>
              <Text style={styles.scoreSeparator}>-</Text>
              <Text style={styles.opponentScore}>
                {game.opponentScore !== undefined ? game.opponentScore : '?'}
              </Text>
            </View>
          </View>

          <View style={styles.matchup}>
            <Text style={styles.teamNameText}>{game.teamName}</Text>
            <Text style={styles.vs}>vs</Text>
            <Text style={styles.opponentText}>
              {game.opponent || 'Opponent'}
            </Text>
          </View>

          {scorers.length > 0 && (
            <View style={styles.topScorers}>
              <Text style={styles.topScorersLabel}>Top Scorers:</Text>
              {scorers.map((scorer, index) => (
                <Text key={index} style={styles.scorerText}>
                  {scorer.name}: {scorer.points} pts
                </Text>
              ))}
            </View>
          )}

          <View style={styles.cardFooter}>
            <Text style={styles.viewDetails}>Tap to view full stats →</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => handleDeleteGame(game, e)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Game History</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Games List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {games.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No games played yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start a game to begin tracking stats
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsHeader}>
              <Text style={styles.statsHeaderText}>
                Total Games: {games.length}
              </Text>
            </View>
            {games
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(renderGameCard)}
          </>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsHeader: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statsHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  gameCardContainer: {
    marginBottom: 12,
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreSeparator: {
    fontSize: 20,
    color: '#666',
  },
  opponentScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  teamNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  vs: {
    fontSize: 14,
    color: '#999',
  },
  opponentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  topScorers: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 8,
  },
  topScorersLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 6,
  },
  scorerText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  viewDetails: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
