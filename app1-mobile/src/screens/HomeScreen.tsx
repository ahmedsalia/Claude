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
import { loadTeams, saveTeam, deleteTeam } from '../utils/storage';
import { createNewPlayer } from '../utils/stats';
import { showSimpleAlert, showDestructiveConfirm } from '../utils/alert';

interface HomeScreenProps {
  onStartGame: (team: Team) => void;
  onManageTeam: (team: Team) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onManageTeam }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    loadTeamsData();
  }, []);

  const loadTeamsData = async () => {
    const loadedTeams = await loadTeams();
    setTeams(loadedTeams);
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      showSimpleAlert('Error', 'Please enter a team name');
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      players: [],
    };

    await saveTeam(newTeam);
    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setShowNewTeamModal(false);
    onManageTeam(newTeam);
  };

  const handleDeleteTeam = (team: Team) => {
    showDestructiveConfirm(
      'Delete Team',
      `Are you sure you want to delete ${team.name}?`,
      async () => {
        await deleteTeam(team.id);
        setTeams(teams.filter(t => t.id !== team.id));
      },
      'Delete'
    );
  };

  const renderTeamItem = ({ item }: { item: Team }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name}</Text>
        <Text style={styles.playerCount}>{item.players.length} players</Text>
      </View>
      <View style={styles.teamActions}>
        <TouchableOpacity
          style={[styles.button, styles.manageButton]}
          onPress={() => onManageTeam(item)}
        >
          <Text style={styles.buttonText}>Manage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={() => {
            if (item.players.length < 5) {
              showSimpleAlert('Not Enough Players', 'You need at least 5 players to start a game');
              return;
            }
            onStartGame(item);
          }}
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteTeam(item)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Basketball Stats Tracker</Text>
        <TouchableOpacity
          style={styles.newTeamButton}
          onPress={() => setShowNewTeamModal(true)}
        >
          <Text style={styles.newTeamButtonText}>+ New Team</Text>
        </TouchableOpacity>
      </View>

      {teams.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No teams yet</Text>
          <Text style={styles.emptyStateSubtext}>Create a team to get started</Text>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={renderTeamItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={showNewTeamModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewTeamModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Team</Text>
            <TextInput
              style={styles.input}
              placeholder="Team Name"
              value={newTeamName}
              onChangeText={setNewTeamName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowNewTeamModal(false);
                  setNewTeamName('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createTeam}
              >
                <Text style={[styles.modalButtonText, styles.createButtonText]}>Create</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  newTeamButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newTeamButtonText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  teamCard: {
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
  teamInfo: {
    marginBottom: 12,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  playerCount: {
    fontSize: 14,
    color: '#666',
  },
  teamActions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButton: {
    backgroundColor: '#FF9800',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
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
