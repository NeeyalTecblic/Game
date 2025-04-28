import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameStatsApi, GameHistory as GameHistoryType } from '../api/gameStats';
import GameHistory from '../components/GameHistory';
import './GameDashboard.css';

const TicTacToeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    playerWins: 0,
    computerWins: 0,
    draws: 0,
    winRate: 0,
    averageMoves: 0,
  });

  useEffect(() => {
    const loadGameData = async () => {
      try {
        // Load game stats
        const gameStats = await gameStatsApi.getGameStats('tictactoe');
        setGameHistory(gameStats.gameHistory);

        // Calculate stats
        const totalGames = gameStats.gamesPlayed;
        const playerWins = gameStats.gameHistory.filter(g => g.won).length;
        const computerWins = gameStats.gameHistory.filter(g => !g.won && g.score > 0).length;
        const draws = gameStats.gameHistory.filter(g => !g.won && g.score === 0).length;
        const totalMoves = gameStats.gameHistory.reduce((sum, g) => sum + (g.moves || 0), 0);

        setStats({
          totalGames,
          playerWins,
          computerWins,
          draws,
          winRate: totalGames ? Math.round((playerWins / totalGames) * 100) : 0,
          averageMoves: totalGames ? Math.round(totalMoves / totalGames) : 0,
        });
      } catch (error) {
        console.error('Failed to load game data:', error);
      }
    };

    loadGameData();
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
          <h2>Game History</h2>
          <GameHistory 
            gameName="tictactoe" 
            history={gameHistory} 
            onClose={() => {}} 
          />
        </div>
      </div>
    </div>
  );
};

export default TicTacToeDashboard; 