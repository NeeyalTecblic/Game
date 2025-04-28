import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserGames } from '../api';
import './GameDashboard.css';

interface GameResult {
  date: string;
  score: number;
  totalPairs?: number;
  attemptsLeft?: number;
  won?: boolean;
}

const MemoryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    bestScore: 0,
    winRate: 0,
    averageScore: 0,
  });

  useEffect(() => {
    async function fetchHistory() {
      const games = await getUserGames();
      // Filter for flipcard games
      const memoryGames = games.filter((g: any) => g.gameName === 'flipcard');
      setGameHistory(memoryGames.map((g: any) => ({
        date: new Date(g.createdAt).toLocaleString(),
        score: g.score,
        won: g.status === 'finished',
      })));
      // Calculate stats
      const totalGames = memoryGames.length;
      const gamesWon = memoryGames.filter((g: any) => g.status === 'finished').length;
      const bestScore = memoryGames.reduce((max: number, g: any) => g.score > max ? g.score : max, 0);
      const totalScore = memoryGames.reduce((sum: number, g: any) => sum + (g.score || 0), 0);
      setStats({
        totalGames,
        gamesWon,
        bestScore,
        winRate: totalGames ? Math.round((gamesWon / totalGames) * 100) : 0,
        averageScore: totalGames ? Math.round(totalScore / totalGames) : 0,
      });
    }
    fetchHistory();
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
          <h2>Recent Games</h2>
          <div className="games-table-container">
            <table className="games-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((game, index) => (
                  <tr key={index} className={game.won ? 'highlight' : ''}>
                    <td>{game.date}</td>
                    <td>{game.score}</td>
                    <td>{game.won ? '🎉 Won!' : '❌ Lost'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDashboard; 