// Word types with corresponding colors
export type WordType = 'substantiv' | 'adjektiv' | 'verb' | 'personer' | 'platser';

// Word interface
export interface Word {
  id: string;
  text: string;
  type: WordType;
}

// Word status during gameplay
export type WordStatus = 'correct' | 'pass' | 'foul' | 'invalid';

// Word instance in turn history
export interface WordInstance {
  word: Word;
  status: WordStatus;
  timestamp: number;
}

// Player
export interface Player {
  id: string;
  name: string;
}

// Team
export interface Team {
  id: string;
  name: string;
  playerIds: string[];
  score: number;
}

// Game mode
export type GameMode = 'A' | 'B';

// Game settings
export interface GameSettings {
  mode: GameMode;
  turnDurationSeconds: number;
  targetScore: number;
  maxPassesPerTurn: number; // Only used in mode A
}

// Turn state
export interface TurnState {
  teamId: string;
  startTime: number | null;
  endTime: number | null;
  wordHistory: WordInstance[];
  currentWord: Word | null;
  passesUsed: number;
}

// Match history entry
export interface MatchHistoryEntry {
  id: string;
  date: number;
  players: Player[];
  teams: Team[];
  winner: Team;
  settings: GameSettings;
}

// Game state
export interface GameState {
  // Setup
  players: Player[];
  teams: Team[];
  settings: GameSettings;
  
  // Game flow
  currentRotation: number;
  currentTurnIndex: number;
  turnOrder: string[]; // team IDs
  currentTurn: TurnState | null;
  
  // Word tracking
  usedWordIds: Set<string>;
  
  // Match state
  matchStarted: boolean;
  matchEnded: boolean;
  winner: Team | null;
  
  // History
  matchHistory: MatchHistoryEntry[];
}

// Actions
export type GameAction =
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'SET_TEAMS'; teams: Team[] }
  | { type: 'SET_SETTINGS'; settings: GameSettings }
  | { type: 'START_MATCH' }
  | { type: 'START_TURN'; teamId: string }
  | { type: 'SHOW_WORD'; word: Word }
  | { type: 'MARK_CORRECT' }
  | { type: 'MARK_PASS' }
  | { type: 'MARK_FOUL' }
  | { type: 'END_TURN' }
  | { type: 'UPDATE_WORD_STATUS'; index: number; status: WordStatus }
  | { type: 'FINISH_REVIEW' }
  | { type: 'START_TIEBREAKER'; tiedTeamIds: string[] }
  | { type: 'END_MATCH'; winner: Team }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_HISTORY'; history: MatchHistoryEntry[] };
