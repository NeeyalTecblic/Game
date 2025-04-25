import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number | null;
  averageTime: number;
}

interface GameHistory {
  id: string;
  date: string;
  timeSpent: number;
  moves: number;
  won: boolean;
}

interface GameContextType {
  stats: GameStats;
  gameHistory: GameHistory[];
  updateGameStats: (gameData: { timeSpent: number; moves: number; won: boolean }) => void;
  resetStats: () => void;
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: null,
  averageTime: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  // Load user's game data when component mounts or user changes
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`gameStats_${user.id}`);
      const savedHistory = localStorage.getItem(`gameHistory_${user.id}`);
      
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        setStats(defaultStats);
      }

      if (savedHistory) {
        setGameHistory(JSON.parse(savedHistory));
      } else {
        setGameHistory([]);
      }
    } else {
      setStats(defaultStats);
      setGameHistory([]);
    }
  }, [user]);

  const updateGameStats = (gameData: { timeSpent: number; moves: number; won: boolean }) => {
    if (!user) return;

    // Update stats
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (gameData.won ? 1 : 0),
      bestTime: stats.bestTime === null 
        ? gameData.timeSpent 
        : Math.min(stats.bestTime, gameData.timeSpent),
      averageTime: (stats.averageTime * stats.gamesPlayed + gameData.timeSpent) / (stats.gamesPlayed + 1),
    };

    // Update history
    const newGameRecord: GameHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      timeSpent: gameData.timeSpent,
      moves: gameData.moves,
      won: gameData.won,
    };

    const updatedHistory = [newGameRecord, ...gameHistory].slice(0, 10); // Keep only last 10 games

    // Save to localStorage
    localStorage.setItem(`gameStats_${user.id}`, JSON.stringify(newStats));
    localStorage.setItem(`gameHistory_${user.id}`, JSON.stringify(updatedHistory));

    // Update state
    setStats(newStats);
    setGameHistory(updatedHistory);
  };

  const resetStats = () => {
    if (!user) return;
    
    setStats(defaultStats);
    setGameHistory([]);
    localStorage.setItem(`gameStats_${user.id}`, JSON.stringify(defaultStats));
    localStorage.setItem(`gameHistory_${user.id}`, JSON.stringify([]));
  };

  return (
    <GameContext.Provider value={{
      stats,
      gameHistory,
      updateGameStats,
      resetStats,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 