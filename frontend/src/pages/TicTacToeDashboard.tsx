import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserGames } from '../api';
import './GameDashboard.css';

interface GameResult {
  date: string;
  winner: string;
  moves: number;
}

const TicTacToeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    playerWins: 0,
    computerWins: 0,
    draws: 0,
    winRate: 0,
    averageMoves: 0,
  });

  useEffect(() => {
    async function fetchHistory() {
      const games = await getUserGames();
      const tttGames = games.filter((g: any) => g.gameName === 'tictactoe');
      setGameHistory(tttGames.map((g: any) => ({
        date: new Date(g.createdAt).toLocaleString(),
        winner: g.data?.winner || '',
        moves: g.score || 0
      })));
      // Calculate stats
      const totalGames = tttGames.length;
      const playerWins = tttGames.filter((g: any) => g.data?.winner === 'Player').length;
      const computerWins = tttGames.filter((g: any) => g.data?.winner === 'Computer').length;
      const draws = tttGames.filter((g: any) => g.data?.winner === 'Draw').length;
      const totalMoves = tttGames.reduce((sum: number, g: any) => sum + (g.score || 0), 0);
      setStats({
        totalGames,
        playerWins,
        computerWins,
        draws,
        winRate: totalGames ? Math.round((playerWins / totalGames) * 100) : 0,
        averageMoves: totalGames ? Math.round(totalMoves / totalGames) : 0,
      });
    }
    fetchHistory();
  }, []);

  return (
    <div className="game-dashboard tictactoe-theme">
      <nav className="dashboard-nav">
        <button onClick={() => navigate('/')} className="nav-button">
          ← Back to Games
        </button>
        <h1>Tic Tac Toe Stats</h1>
        <button onClick={() => navigate('/tic-tac-toe')} className="nav-button primary">
          Play Now
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Win Rate</h3>
            <div className="stat-value">{stats.winRate}%</div>
            <div className="stat-subtitle">success rate</div>
          </div>
          <div className="stat-card">
            <h3>Your Wins</h3>
            <div className="stat-value">{stats.playerWins}</div>
            <div className="stat-subtitle">victories</div>
          </div>
          <div className="stat-card">
            <h3>Computer Wins</h3>
            <div className="stat-value">{stats.computerWins}</div>
            <div className="stat-subtitle">AI victories</div>
          </div>
          <div className="stat-card">
            <h3>Draws</h3>
            <div className="stat-value">{stats.draws}</div>
            <div className="stat-subtitle">tied games</div>
          </div>
        </div>

        <div className="performance-chart">
          <h2>Game Performance</h2>
          <div className="chart-container">
            <div className="performance-stats">
              <div className="performance-item">
                <span>Average Moves:</span>
                <span className="highlight">{stats.averageMoves}</span>
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
                  <th>Winner</th>
                  <th>Moves</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((game, index) => (
                  <tr key={index} className={game.winner === 'Player' ? 'highlight' : ''}>
                    <td>{game.date}</td>
                    <td>{game.winner}</td>
                    <td>{game.moves}</td>
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

export default TicTacToeDashboard; 