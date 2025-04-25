import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameDashboard.css';

interface GameResult {
  date: string;
  score: number;
  totalPairs: number;
  attemptsLeft: number;
  won: boolean;
}

const MemoryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    bestAttempts: 0,
    winRate: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('cardFlipGameHistory') || '[]');
    setGameHistory(history);

    // Calculate stats
    const totalGames = history.length;
    const gamesWon = history.filter((game: GameResult) => game.won).length;
    const bestAttempts = history.reduce((max: number, game: GameResult) => 
      game.won ? Math.max(max, game.attemptsLeft) : max, 0);
    const totalScore = history.reduce((sum: number, game: GameResult) => sum + game.score, 0);

    setStats({
      totalGames,
      gamesWon,
      bestAttempts,
      winRate: totalGames ? Math.round((gamesWon / totalGames) * 100) : 0,
      averageScore: totalGames ? Math.round(totalScore / totalGames) : 0,
    });
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
            <h3>Best Performance</h3>
            <div className="stat-value">{stats.bestAttempts}</div>
            <div className="stat-subtitle">attempts remaining</div>
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
                  <th>Pairs Found</th>
                  <th>Attempts Left</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((game, index) => (
                  <tr key={index} className={game.won ? 'highlight' : ''}>
                    <td>{game.date}</td>
                    <td>{game.score}</td>
                    <td>{game.totalPairs}</td>
                    <td>{game.attemptsLeft}</td>
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