import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Player } from '../types';
import { getPlayerSummary } from '../utils/stats';

interface PlayerCardProps {
  player: Player;
  onPress?: () => void;
  showStats?: boolean;
  isSelected?: boolean;
  compact?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onPress,
  showStats = true,
  isSelected = false,
  compact = false,
}) => {
  const summary = getPlayerSummary(player);

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactCard,
          isSelected && styles.selectedCard,
          player.isOnCourt && styles.onCourtCard,
        ]}
        onPress={onPress}
      >
        <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
        <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
        {player.isOnCourt && <View style={styles.onCourtIndicator} />}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        player.isOnCourt && styles.onCourtCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
          <Text style={styles.playerName}>{player.name}</Text>
        </View>
        {player.isOnCourt && (
          <View style={styles.courtBadge}>
            <Text style={styles.courtBadgeText}>ON COURT</Text>
          </View>
        )}
      </View>

      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.points}</Text>
            <Text style={styles.statLabel}>PTS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.rebounds}</Text>
            <Text style={styles.statLabel}>REB</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.assists}</Text>
            <Text style={styles.statLabel}>AST</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.fg}</Text>
            <Text style={styles.statLabel}>FG</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  onCourtCard: {
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jerseyNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  courtBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  courtBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  onCourtIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    marginTop: 2,
  },
});
