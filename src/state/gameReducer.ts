import { GameState, GameAction, GameSettings, WordStatus } from './types';

export const defaultSettings: GameSettings = {
  mode: 'A',
  turnDurationSeconds: 45,
  targetScore: 30,
  maxPassesPerTurn: 3,
};

export const initialState: GameState = {
  players: [],
  teams: [],
  settings: defaultSettings,
  currentRotation: 0,
  currentTurnIndex: 0,
  turnOrder: [],
  currentTurn: null,
  usedWordIds: new Set(),
  matchStarted: false,
  matchEnded: false,
  winner: null,
  matchHistory: [],
};

function calculateTurnScore(
  wordHistory: Array<{ status: WordStatus }>,
  mode: 'A' | 'B'
): number {
  return wordHistory.reduce((score, instance) => {
    switch (instance.status) {
      case 'correct':
        return score + 1;
      case 'pass':
        return mode === 'B' ? score - 0.5 : score;
      case 'foul':
        return mode === 'B' ? score - 1 : score;
      case 'invalid':
        return score;
      default:
        return score;
    }
  }, 0);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return {
        ...state,
        players: action.players,
      };

    case 'SET_TEAMS':
      return {
        ...state,
        teams: action.teams,
      };

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.settings,
      };

    case 'START_MATCH':
      return {
        ...state,
        matchStarted: true,
        turnOrder: state.teams.map(t => t.id),
        currentRotation: 0,
        currentTurnIndex: 0,
        usedWordIds: new Set(),
      };

    case 'START_TURN':
      return {
        ...state,
        currentTurn: {
          teamId: action.teamId,
          startTime: Date.now(),
          endTime: null,
          wordHistory: [],
          currentWord: null,
          passesUsed: 0,
        },
      };

    case 'SHOW_WORD':
      if (!state.currentTurn) return state;
      
      return {
        ...state,
        currentTurn: {
          ...state.currentTurn,
          currentWord: action.word,
        },
      };

    case 'MARK_CORRECT':
      if (!state.currentTurn || !state.currentTurn.currentWord) return state;
      
      return {
        ...state,
        currentTurn: {
          ...state.currentTurn,
          wordHistory: [
            ...state.currentTurn.wordHistory,
            {
              word: state.currentTurn.currentWord,
              status: 'correct',
              timestamp: Date.now(),
            },
          ],
          currentWord: null,
        },
        usedWordIds: new Set([
          ...state.usedWordIds,
          state.currentTurn.currentWord.id,
        ]),
      };

    case 'MARK_PASS':
      if (!state.currentTurn || !state.currentTurn.currentWord) return state;
      
      return {
        ...state,
        currentTurn: {
          ...state.currentTurn,
          wordHistory: [
            ...state.currentTurn.wordHistory,
            {
              word: state.currentTurn.currentWord,
              status: 'pass',
              timestamp: Date.now(),
            },
          ],
          currentWord: null,
          passesUsed: state.currentTurn.passesUsed + 1,
        },
        usedWordIds: new Set([
          ...state.usedWordIds,
          state.currentTurn.currentWord.id,
        ]),
      };

    case 'MARK_FOUL':
      if (!state.currentTurn || !state.currentTurn.currentWord) return state;
      
      return {
        ...state,
        currentTurn: {
          ...state.currentTurn,
          wordHistory: [
            ...state.currentTurn.wordHistory,
            {
              word: state.currentTurn.currentWord,
              status: 'foul',
              timestamp: Date.now(),
            },
          ],
          currentWord: null,
        },
        usedWordIds: new Set([
          ...state.usedWordIds,
          state.currentTurn.currentWord.id,
        ]),
      };

    case 'END_TURN':
      if (!state.currentTurn) return state;
      
      return {
        ...state,
        currentTurn: {
          ...state.currentTurn,
          endTime: Date.now(),
        },
      };

    case 'UPDATE_WORD_STATUS':
      if (!state.currentTurn) return state;
      
      const updatedHistory = [...state.currentTurn.wordHistory];
      if (action.index >= 0 && action.index < updatedHistory.length) {
        updatedHistory[action.index] = {
          ...updatedHistory[action.index],
          status: action.status,
        };
      }
      
      return {
        ...state,
        currentTurn: {
          ...state.currentTurn,
          wordHistory: updatedHistory,
        },
      };

    case 'FINISH_REVIEW':
      if (!state.currentTurn) return state;
      
      // Calculate score for this turn
      const turnScore = calculateTurnScore(
        state.currentTurn.wordHistory,
        state.settings.mode
      );
      
      // Update team score
      const updatedTeams = state.teams.map(team =>
        team.id === state.currentTurn!.teamId
          ? { ...team, score: team.score + turnScore }
          : team
      );
      
      // Move to next turn
      const nextTurnIndex = state.currentTurnIndex + 1;
      const rotationComplete = nextTurnIndex >= state.turnOrder.length;
      
      return {
        ...state,
        teams: updatedTeams,
        currentTurn: null,
        currentTurnIndex: rotationComplete ? 0 : nextTurnIndex,
        currentRotation: rotationComplete ? state.currentRotation + 1 : state.currentRotation,
      };

    case 'END_MATCH':
      return {
        ...state,
        matchEnded: true,
        winner: action.winner,
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        matchHistory: state.matchHistory,
      };

    case 'LOAD_HISTORY':
      return {
        ...state,
        matchHistory: action.history,
      };

    default:
      return state;
  }
}
