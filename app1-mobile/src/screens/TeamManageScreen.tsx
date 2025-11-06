import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { Team, Player } from '../types';
import { PlayerCard } from '../components/PlayerCard';
import { saveTeam } from '../utils/storage';
import { createNewPlayer } from '../utils/stats';
import { showSimpleAlert, showDestructiveConfirm } from '../utils/alert';

interface TeamManageScreenProps {
  team: Team;
  onBack: () => void;
  onTeamUpdated: (team: Team) => void;
}

export const TeamManageScreen: React.FC<TeamManageScreenProps> = ({
  team: initialTeam,
  onBack,
  onTeamUpdated,
}) => {
  const [team, setTeam] = useState<Team>(initialTeam);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');

  useEffect(() => {
    saveTeamData();
  }, [team]);

  const saveTeamData = async () => {
    await saveTeam(team);
    onTeamUpdated(team);
  };

  const addPlayer = () => {
    if (!playerName.trim() || !playerNumber.trim()) {
      showSimpleAlert('Error', 'Please enter player name and jersey number');
      return;
    }

    // Check for duplicate jersey number
    if (team.players.some(p => p.jerseyNumber === playerNumber.trim())) {
      showSimpleAlert('Error', 'Jersey number already exists');
      return;
    }

    const newPlayer = createNewPlayer(
      playerName.trim(),
      playerNumber.trim(),
      Date.now().toString()
    );

    setTeam({
      ...team,
      players: [...team.players, newPlayer],
    });

    setPlayerName('');
    setPlayerNumber('');
    setShowAddPlayerModal(false);
  };

  const removePlayer = (playerId: string) => {
    showDestructiveConfirm(
      'Remove Player',
      'Are you sure you want to remove this player?',
      () => {
        setTeam({
          ...team,
          players: team.players.filter(p => p.id !== playerId),
        });
      },
      'Remove'
    );
  };

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <View style={styles.playerRow}>
      <PlayerCard player={item} showStats={false} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePlayer(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{team.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>Team Roster ({team.players.length} players)</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddPlayerModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add Player</Text>
          </TouchableOpacity>
        </View>

        {team.players.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No players yet</Text>
            <Text style={styles.emptyStateSubtext}>Add players to your roster</Text>
          </View>
        ) : (
          <FlatList
            data={team.players}
            keyExtractor={(item) => item.id}
            renderItem={renderPlayerItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      <Modal
        visible={showAddPlayerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddPlayerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Player</Text>
            <TextInput
              style={styles.input}
              placeholder="Player Name"
              value={playerName}
              onChangeText={setPlayerName}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Jersey Number"
              value={playerNumber}
              onChangeText={setPlayerNumber}
              keyboardType="number-pad"
              maxLength={2}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddPlayerModal(false);
                  setPlayerName('');
                  setPlayerNumber('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={addPlayer}
              >
                <Text style={[styles.modalButtonText, styles.createButtonText]}>Add</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 16,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 20,
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#bbb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#1976D2',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  createButtonText: {
    color: '#fff',
  },
});
