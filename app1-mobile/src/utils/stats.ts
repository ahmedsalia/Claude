import { Player, PlayerStats, StatType } from '../types';

export const createEmptyStats = (): PlayerStats => ({
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
  plus_minus: 0,
  minutes: 0,
});

export const createNewPlayer = (name: string, jerseyNumber: string, id: string): Player => ({
  id,
  name,
  jerseyNumber,
  stats: createEmptyStats(),
  isOnCourt: false,
});

export const calculatePlayerPoints = (stats: PlayerStats): number => {
  return (stats.fgm2 * 2) + (stats.fgm3 * 3) + stats.ftm;
};

export const calculateTeamPoints = (players: Player[]): number => {
  return players.reduce((total, player) => total + calculatePlayerPoints(player.stats), 0);
};

export const calculateFGPercentage = (made: number, missed: number): string => {
  if (made + missed === 0) return '0.0';
  return ((made / (made+missed)) * 100).toFixed(1);
};

export const calculateTotalRebounds = (stats: PlayerStats): number => {
  return stats.oreb + stats.dreb;
};

export const getPlayerSummary = (player: Player) => {
  const points = calculatePlayerPoints(player.stats);
  const rebounds = calculateTotalRebounds(player.stats);
  const assists = player.stats.ast;

  return {
    points,
    rebounds,
    assists,
    fg: `${player.stats.fgm2 + player.stats.fgm3}/${player.stats.fga2 + player.stats.fga3}`,
    fg_pct: calculateFGPercentage(
      player.stats.fgm2 + player.stats.fgm3,
      player.stats.fga2 + player.stats.fga3
    ),
  };
};

export const statActions = [
  // Shooting - 2PT
  { type: 'fgm2', label: '2PT Made', icon: '✓', color: '#4CAF50', category: 'shooting' },
  { type: 'fga2', label: '2PT Miss', icon: '✗', color: '#F44336', category: 'shooting' },

  // Shooting - 3PT
  { type: 'fgm3', label: '3PT Made', icon: '3✓', color: '#2196F3', category: 'shooting' },
  { type: 'fga3', label: '3PT Miss', icon: '3✗', color: '#FF5722', category: 'shooting' },

  // Free Throws
  { type: 'ftm', label: 'FT Made', icon: 'FT✓', color: '#8BC34A', category: 'shooting' },
  { type: 'fta', label: 'FT Miss', icon: 'FT✗', color: '#E91E63', category: 'shooting' },

  // Rebounds
  { type: 'oreb', label: 'Off Reb', icon: 'OR', color: '#FF9800', category: 'rebounding' },
  { type: 'dreb', label: 'Def Reb', icon: 'DR', color: '#FF9800', category: 'rebounding' },

  // Other stats
  { type: 'ast', label: 'Assist', icon: 'AST', color: '#9C27B0', category: 'other' },
  { type: 'stl', label: 'Steal', icon: 'STL', color: '#00BCD4', category: 'other' },
  { type: 'blk', label: 'Block', icon: 'BLK', color: '#3F51B5', category: 'other' },
  { type: 'tov', label: 'Turnover', icon: 'TO', color: '#795548', category: 'other' },
  { type: 'pf', label: 'Foul', icon: 'PF', color: '#607D8B', category: 'other' },
] as const;
