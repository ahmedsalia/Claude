import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Team, Player, Game, StatType } from '../types';
import { PlayerCard } from '../components/PlayerCard';
import { StatButton } from '../components/StatButton';
import { statActions, calculateTeamPoints } from '../utils/stats';
import { saveCurrentGame } from '../utils/storage';
import { showSimpleAlert, showConfirm } from '../utils/alert';

interface GameScreenProps {
  team: Team;
  onEndGame: (updatedTeam: Team) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ team: initialTeam, onEndGame }) => {
  const [team, setTeam] = useState<Team>(initialTeam);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [game, setGame] = useState<Game>({
    id: Date.now().toString(),
    teamId: initialTeam.id,
    teamName: initialTeam.name,
    opponent: '',
    date: new Date().toISOString(),
    activeLineup: [],
    bench: initialTeam.players.map(p => p.id),
    quarter: 1,
    gameTime: 0,
    statsMode: 'normal',
  });
  const [showLineupModal, setShowLineupModal] = useState(true);
  const [tempLineup, setTempLineup] = useState<string[]>([]);

  useEffect(() => {
    saveGameData();
  }, [team, game]);

  const saveGameData = async () => {
    await saveCurrentGame(game);
  };

  const confirmLineup = () => {
    if (tempLineup.length !== 5) {
      showSimpleAlert('Invalid Lineup', 'Please select exactly 5 players to start');
      return;
    }

    const updatedPlayers = team.players.map(p => ({
      ...p,
      isOnCourt: tempLineup.includes(p.id),
    }));

    setTeam({ ...team, players: updatedPlayers });
    setGame({
      ...game,
      activeLineup: tempLineup,
      bench: team.players.filter(p => !tempLineup.includes(p.id)).map(p => p.id),
    });
    setShowLineupModal(false);
  };

  const togglePlayerInLineup = (playerId: string) => {
    if (tempLineup.includes(playerId)) {
      setTempLineup(tempLineup.filter(id => id !== playerId));
    } else {
      if (tempLineup.length < 5) {
        setTempLineup([...tempLineup, playerId]);
      } else {
        showSimpleAlert('Lineup Full', 'You can only have 5 players on court');
      }
    }
  };

  const substitutePlayer = (incomingId: string, outgoingId: string) => {
    const updatedPlayers = team.players.map(p => {
      if (p.id === incomingId) return { ...p, isOnCourt: true };
      if (p.id === outgoingId) return { ...p, isOnCourt: false };
      return p;
    });

    const newLineup = game.activeLineup.map(id => id === outgoingId ? incomingId : id);

    setTeam({ ...team, players: updatedPlayers });
    setGame({
      ...game,
      activeLineup: newLineup,
      bench: team.players.filter(p => !newLineup.includes(p.id)).map(p => p.id),
    });
  };

  const addStat = (statType: StatType) => {
    if (!selectedPlayer) {
      showSimpleAlert('No Player Selected', 'Please select a player first');
      return;
    }

    const updatedPlayers = team.players.map(p => {
      if (p.id === selectedPlayer.id) {
        return {
          ...p,
          stats: {
            ...p.stats,
            [statType]: p.stats[statType] + 1,
          },
        };
      }
      return p;
    });

    setTeam({ ...team, players: updatedPlayers });

    // Update selected player
    const updated = updatedPlayers.find(p => p.id === selectedPlayer.id);
    if (updated) setSelectedPlayer(updated);
  };

  const undoStat = (statType: StatType) => {
    if (!selectedPlayer) return;

    const updatedPlayers = team.players.map(p => {
      if (p.id === selectedPlayer.id && p.stats[statType] > 0) {
        return {
          ...p,
          stats: {
            ...p.stats,
            [statType]: p.stats[statType] - 1,
          },
        };
      }
      return p;
    });

    setTeam({ ...team, players: updatedPlayers });
    const updated = updatedPlayers.find(p => p.id === selectedPlayer.id);
    if (updated) setSelectedPlayer(updated);
  };

  const handleEndGame = () => {
    showConfirm(
      'End Game',
      'Are you sure you want to end this game?',
      () => onEndGame(team),
      undefined,
      'End Game',
      'Cancel'
    );
  };

  const onCourtPlayers = team.players.filter(p => p.isOnCourt);
  const benchPlayers = team.players.filter(p => !p.isOnCourt);
  const teamPoints = calculateTeamPoints(team.players);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.score}>{teamPoints} PTS</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.lineupButton}
            onPress={() => {
              setTempLineup(game.activeLineup);
              setShowLineupModal(true);
            }}
          >
            <Text style={styles.lineupButtonText}>Lineup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endGameButton} onPress={handleEndGame}>
            <Text style={styles.endGameButtonText}>End Game</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Players on Court */}
        <View style={styles.courtSection}>
          <Text style={styles.sectionTitle}>On Court (5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.playerList}>
              {onCourtPlayers.map(player => (
                <View key={player.id} style={styles.playerContainer}>
                  <PlayerCard
                    player={player}
                    compact
                    isSelected={selectedPlayer?.id === player.id}
                    onPress={() => setSelectedPlayer(player)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Selected Player Stats */}
        {selectedPlayer && (
          <View style={styles.selectedPlayerSection}>
            <Text style={styles.selectedPlayerText}>
              Selected: #{selectedPlayer.jerseyNumber} {selectedPlayer.name}
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSelectedPlayer(null)}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stat Buttons */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <ScrollView>
            <View style={styles.statGrid}>
              {statActions.map(({ type, label, icon, color }) => (
                <View key={type} style={styles.statButtonContainer}>
                  <StatButton
                    type={type}
                    label={label}
                    icon={icon}
                    color={color}
                    onPress={() => addStat(type)}
                    count={selectedPlayer?.stats[type]}
                  />
                  {selectedPlayer && selectedPlayer.stats[type] > 0 && (
                    <TouchableOpacity
                      style={styles.undoButton}
                      onPress={() => undoStat(type)}
                    >
                      <Text style={styles.undoButtonText}>Undo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Bench */}
        <View style={styles.benchSection}>
          <Text style={styles.sectionTitle}>Bench ({benchPlayers.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.playerList}>
              {benchPlayers.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  compact
                  onPress={() => {
                    if (selectedPlayer && selectedPlayer.isOnCourt) {
                      showConfirm(
                        'Substitute',
                        `Sub ${player.name} in for ${selectedPlayer.name}?`,
                        () => {
                          substitutePlayer(player.id, selectedPlayer.id);
                          setSelectedPlayer(null);
                        },
                        undefined,
                        'Substitute',
                        'Cancel'
                      );
                    }
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Lineup Selection Modal */}
      <Modal
        visible={showLineupModal}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.lineupModalContent}>
            <Text style={styles.modalTitle}>Select Starting Lineup</Text>
            <Text style={styles.modalSubtitle}>
              Choose 5 players ({tempLineup.length}/5)
            </Text>

            <ScrollView style={styles.lineupList}>
              {team.players.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={[
                    styles.lineupPlayerItem,
                    tempLineup.includes(player.id) && styles.lineupPlayerSelected,
                  ]}
                  onPress={() => togglePlayerInLineup(player.id)}
                >
                  <Text style={styles.lineupPlayerNumber}>#{player.jerseyNumber}</Text>
                  <Text style={styles.lineupPlayerName}>{player.name}</Text>
                  {tempLineup.includes(player.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                tempLineup.length !== 5 && styles.confirmButtonDisabled,
              ]}
              onPress={confirmLineup}
              disabled={tempLineup.length !== 5}
            >
              <Text style={styles.confirmButtonText}>Confirm Lineup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  lineupButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  lineupButtonText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  endGameButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endGameButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  courtSection: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  benchSection: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderTopWidth: 2,
    borderTopColor: '#FF9800',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  playerList: {
    flexDirection: 'row',
    gap: 8,
  },
  playerContainer: {
    marginRight: 4,
  },
  selectedPlayerSection: {
    backgroundColor: '#2196F3',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPlayerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  statsSection: {
    flex: 1,
    padding: 12,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statButtonContainer: {
    alignItems: 'center',
  },
  undoButton: {
    backgroundColor: '#666',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  undoButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineupModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  lineupList: {
    maxHeight: 400,
  },
  lineupPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  lineupPlayerSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  lineupPlayerNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 12,
    width: 40,
  },
  lineupPlayerName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
