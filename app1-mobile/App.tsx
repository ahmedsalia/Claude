import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { TeamManageScreen } from './src/screens/TeamManageScreen';
import { GameScreen } from './src/screens/GameScreen';
import { PlayerStatsScreen } from './src/screens/PlayerStatsScreen';
import { GameHistoryScreen } from './src/screens/GameHistoryScreen';
import { GameStatsDetailScreen } from './src/screens/GameStatsDetailScreen';
import { SeasonStatsScreen } from './src/screens/SeasonStatsScreen';
import { Team, CompletedGame } from './src/types';
import { saveTeam, loadTeams } from './src/utils/storage';

type Screen = 'home' | 'manage-team' | 'game' | 'player-stats' | 'season-stats' | 'game-history' | 'game-detail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedGame, setSelectedGame] = useState<CompletedGame | null>(null);

  const handleStartGame = (team: Team) => {
    setSelectedTeam(team);
    setCurrentScreen('game');
  };

  const handleManageTeam = (team: Team) => {
    setSelectedTeam(team);
    setCurrentScreen('manage-team');
  };

  const handleViewStats = (team: Team) => {
    setSelectedTeam(team);
    setCurrentScreen('player-stats');
  };

  const handleViewHistory = (team: Team) => {
    setSelectedTeam(team);
    setCurrentScreen('game-history');
  };

  const handleViewSeasonStats = (team: Team) => {
    setSelectedTeam(team);
    setCurrentScreen('season-stats');
  };

  const handleViewGameDetail = (game: CompletedGame) => {
    setSelectedGame(game);
    setCurrentScreen('game-detail');
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!selectedTeam) return;

    // Remove game from team's games array
    const updatedTeam: Team = {
      ...selectedTeam,
      games: (selectedTeam.games || []).filter(g => g.id !== gameId),
    };

    // Save updated team
    await saveTeam(updatedTeam);

    // Update local state
    setSelectedTeam(updatedTeam);
  };

  const handleEndGame = (updatedTeam: Team) => {
    setSelectedTeam(null);
    setCurrentScreen('home');
  };

  const handleBackToHome = () => {
    setSelectedTeam(null);
    setSelectedGame(null);
    setCurrentScreen('home');
  };

  const handleBackToHistory = () => {
    setSelectedGame(null);
    setCurrentScreen('game-history');
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
          onViewStats={handleViewStats}
          onViewSeasonStats={handleViewSeasonStats}
          onViewHistory={handleViewHistory}
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

      {currentScreen === 'player-stats' && selectedTeam && (
        <PlayerStatsScreen
          team={selectedTeam}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'season-stats' && selectedTeam && (
        <SeasonStatsScreen
          team={selectedTeam}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'game-history' && selectedTeam && (
        <GameHistoryScreen
          team={selectedTeam}
          onBack={handleBackToHome}
          onViewGameStats={handleViewGameDetail}
          onDeleteGame={handleDeleteGame}
        />
      )}

      {currentScreen === 'game-detail' && selectedGame && (
        <GameStatsDetailScreen
          game={selectedGame}
          onBack={handleBackToHistory}
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
