export interface Player {
  id: string;
  name: string;
  jerseyNumber: string;
  stats: PlayerStats;
  isOnCourt: boolean;
  position?: string;
}

export interface PlayerStats {
  // Shooting
  fgm2: number;  // 2-point field goals made
  fga2: number;  // 2-point field goals attempted
  fgm3: number;  // 3-point field goals made
  fga3: number;  // 3-point field goals attempted
  ftm: number;   // Free throws made
  fta: number;   // Free throws attempted

  // Rebounds
  oreb: number;  // Offensive rebounds
  dreb: number;  // Defensive rebounds

  // Other stats
  ast: number;   // Assists
  stl: number;   // Steals
  blk: number;   // Blocks
  tov: number;   // Turnovers
  pf: number;    // Personal fouls

  // Advanced stats
  plus_minus?: number;
  minutes?: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Game {
  id: string;
  teamId: string;
  teamName: string;
  opponent: string;
  date: string;
  activeLineup: string[];  // Player IDs on court
  bench: string[];          // Player IDs on bench
  quarter: number;
  gameTime: number;
  statsMode: 'normal' | 'advanced';
}

export type StatType =
  | 'fgm2' | 'fga2'     // 2-point FG
  | 'fgm3' | 'fga3'     // 3-point FG
  | 'ftm' | 'fta'       // Free throws
  | 'oreb' | 'dreb'     // Rebounds
  | 'ast' | 'stl' | 'blk' | 'tov' | 'pf';  // Other stats

export interface StatAction {
  type: StatType;
  label: string;
  icon: string;
  color: string;
  category: 'shooting' | 'rebounding' | 'other';
}
