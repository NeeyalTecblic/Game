import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameStatsApi, GameHistory as GameHistoryType } from '../api/gameStats';
import GameHistory from '../components/GameHistory';
import './GameDashboard.css';

const MemoryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    bestScore: 0,
    winRate: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const loadGameData = async () => {
      try {
        // Load game stats
        const gameStats = await gameStatsApi.getGameStats('cardFlip');
        setGameHistory(gameStats.gameHistory);

        // Calculate stats
        const totalGames = gameStats.gamesPlayed;
        const gamesWon = gameStats.gameHistory.filter(g => g.won).length;
        const bestScore = Math.max(...gameStats.gameHistory.map(g => g.score));
        const totalScore = gameStats.gameHistory.reduce((sum, g) => sum + g.score, 0);

        setStats({
          totalGames,
          gamesWon,
          bestScore,
          winRate: totalGames ? Math.round((gamesWon / totalGames) * 100) : 0,
          averageScore: totalGames ? Math.round(totalScore / totalGames) : 0,
        });
      } catch (error) {
        console.error('Failed to load game data:', error);
      }
    };

    loadGameData();
  }, []);

  return (
    <div className="game-dashboard memory-theme">
      <nav className="dashboard-nav">
        <button onClick={() => navigate('/')} className="nav-button">
          ← Back to Games
        </button>
        <h1>Memory Card Game Stats</h1>
        <button onClick={() => navigate('/game')} className="nav-button primary">
          Play Now
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Games Won</h3>
            <div className="stat-value">{stats.gamesWon}</div>
            <div className="stat-subtitle">out of {stats.totalGames} games</div>
          </div>
          <div className="stat-card">
            <h3>Win Rate</h3>
            <div className="stat-value">{stats.winRate}%</div>
            <div className="stat-subtitle">success rate</div>
          </div>
          <div className="stat-card">
            <h3>Best Score</h3>
            <div className="stat-value">{stats.bestScore}</div>
            <div className="stat-subtitle">highest score</div>
          </div>
        </div>

        <div className="performance-chart">
          <h2>Game Performance</h2>
          <div className="chart-container">
            <div className="performance-stats">
              <div className="performance-item">
                <span>Average Score:</span>
                <span className="highlight">{stats.averageScore}</span>
              </div>
              <div className="performance-item">
                <span>Games Played:</span>
                <span className="highlight">{stats.totalGames}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-games">
          <h2>Game History</h2>
          <GameHistory 
            gameName="cardFlip" 
            history={gameHistory} 
            onClose={() => {}} 
          />
        </div>
      </div>
    </div>
  );
};

export default MemoryDashboard; 