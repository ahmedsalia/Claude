import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { TeamManageScreen } from './src/screens/TeamManageScreen';
import { GameScreen } from './src/screens/GameScreen';
import { Team } from './src/types';

type Screen = 'home' | 'manage-team' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleStartGame = (team: Team) => {
    setSelectedTeam(team);
    setCurrentScreen('game');
  };

  const handleManageTeam = (team: Team) => {
    setSelectedTeam(team);
    setCurrentScreen('manage-team');
  };

  const handleEndGame = (updatedTeam: Team) => {
    setSelectedTeam(null);
    setCurrentScreen('home');
  };

  const handleBackToHome = () => {
    setSelectedTeam(null);
    setCurrentScreen('home');
  };

  const handleTeamUpdated = (team: Team) => {
    setSelectedTeam(team);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={handleStartGame}
          onManageTeam={handleManageTeam}
        />
      )}

      {currentScreen === 'manage-team' && selectedTeam && (
        <TeamManageScreen
          team={selectedTeam}
          onBack={handleBackToHome}
          onTeamUpdated={handleTeamUpdated}
        />
      )}

      {currentScreen === 'game' && selectedTeam && (
        <GameScreen
          team={selectedTeam}
          onEndGame={handleEndGame}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
