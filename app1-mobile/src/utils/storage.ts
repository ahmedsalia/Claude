import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team, Game } from '../types';

const TEAMS_KEY = '@teams';
const GAMES_KEY = '@games';
const CURRENT_GAME_KEY = '@current_game';

export const saveTeam = async (team: Team): Promise<void> => {
  try {
    const teamsJson = await AsyncStorage.getItem(TEAMS_KEY);
    const teams: Team[] = teamsJson ? JSON.parse(teamsJson) : [];

    const existingIndex = teams.findIndex(t => t.id === team.id);
    if (existingIndex >= 0) {
      teams[existingIndex] = team;
    } else {
      teams.push(team);
    }

    await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  } catch (error) {
    console.error('Error saving team:', error);
  }
};

export const loadTeams = async (): Promise<Team[]> => {
  try {
    const teamsJson = await AsyncStorage.getItem(TEAMS_KEY);
    return teamsJson ? JSON.parse(teamsJson) : [];
  } catch (error) {
    console.error('Error loading teams:', error);
    return [];
  }
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  try {
    const teams = await loadTeams();
    const filtered = teams.filter(t => t.id !== teamId);
    await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting team:', error);
  }
};

export const saveGame = async (game: Game): Promise<void> => {
  try {
    const gamesJson = await AsyncStorage.getItem(GAMES_KEY);
    const games: Game[] = gamesJson ? JSON.parse(gamesJson) : [];

    const existingIndex = games.findIndex(g => g.id === game.id);
    if (existingIndex >= 0) {
      games[existingIndex] = game;
    } else {
      games.push(game);
    }

    await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
  } catch (error) {
    console.error('Error saving game:', error);
  }
};

export const loadGames = async (): Promise<Game[]> => {
  try {
    const gamesJson = await AsyncStorage.getItem(GAMES_KEY);
    return gamesJson ? JSON.parse(gamesJson) : [];
  } catch (error) {
    console.error('Error loading games:', error);
    return [];
  }
};

export const saveCurrentGame = async (game: Game): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(game));
  } catch (error) {
    console.error('Error saving current game:', error);
  }
};

export const loadCurrentGame = async (): Promise<Game | null> => {
  try {
    const gameJson = await AsyncStorage.getItem(CURRENT_GAME_KEY);
    return gameJson ? JSON.parse(gameJson) : null;
  } catch (error) {
    console.error('Error loading current game:', error);
    return null;
  }
};

export const clearCurrentGame = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_GAME_KEY);
  } catch (error) {
    console.error('Error clearing current game:', error);
  }
};
