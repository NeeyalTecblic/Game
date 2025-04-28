import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  averageScore: number;
  winRate: number;
  gameHistory: GameHistory[];
}

export interface GameHistory {
  id: string;
  date: string;
  score: number;
  moves?: number;
  won: boolean;
  difficulty?: string;
  gameName: string;
}

export const gameStatsApi = {
  // Get overall statistics for a specific game
  getGameStats: async (gameName: string): Promise<GameStats> => {
    const response = await api.get(`/games/stats/${gameName}`);
    return response.data;
  },

  // Get game history for a specific game
  getGameHistory: async (gameName: string): Promise<GameHistory[]> => {
    const response = await api.get(`/games/history/${gameName}`);
    return response.data;
  },

  // Save a new game result
  saveGameResult: async (gameData: {
    gameName: string;
    score: number;
    moves?: number;
    won: boolean;
    difficulty?: string;
    data?: any;
  }): Promise<GameHistory> => {
    const response = await api.post(`/games/save`, gameData);
    return response.data;
  },

  // Get user's best scores across all games
  getBestScores: async (): Promise<Record<string, number>> => {
    const response = await api.get(`/games/best-scores`);
    return response.data;
  },

  // Get total games played by game type
  getGamesPlayed: async (): Promise<Record<string, number>> => {
    const response = await api.get(`/games/played`);
    return response.data;
  },

  // Get recent games across all game types
  getRecentGames: async (limit: number = 10): Promise<GameHistory[]> => {
    const response = await api.get(`/games/recent?limit=${limit}`);
    return response.data;
  }
}; 