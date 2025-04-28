import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameStatsApi, GameHistory as GameHistoryType } from '../api/gameStats';
import GameHistory from '../components/GameHistory';
import './GameDashboard.css';

const SnakeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([]);
  const [highScore, setHighScore] = useState<number>(0);
  const [stats, setStats] = useState({
    totalGames: 0,
    averageScore: 0,
    highScoreEasy: 0,
    highScoreMedium: 0,
    highScoreHard: 0,
  });

  useEffect(() => {
    const loadGameData = async () => {
      try {
        // Load game stats
        const gameStats = await gameStatsApi.getGameStats('snake');
        setGameHistory(gameStats.gameHistory);
        
        // Load best scores
        const bestScores = await gameStatsApi.getBestScores();
        setHighScore(bestScores.snake || 0);

        // Calculate difficulty-specific stats
        const difficultyScores = gameStats.gameHistory.reduce((acc: any, game: GameHistoryType) => {
          if (game.difficulty) {
            acc[game.difficulty] = Math.max(acc[game.difficulty] || 0, game.score);
          }
          return acc;
        }, { easy: 0, medium: 0, hard: 0 });

        setStats({
          totalGames: gameStats.gamesPlayed,
          averageScore: gameStats.averageScore,
          highScoreEasy: difficultyScores.easy,
          highScoreMedium: difficultyScores.medium,
          highScoreHard: difficultyScores.hard,
        });
      } catch (error) {
        console.error('Failed to load game data:', error);
      }
    };

    loadGameData();
  }, []);

  return (
    <div className="game-dashboard snake-theme">
      <nav className="dashboard-nav">
        <button onClick={() => navigate('/')} className="nav-button">
          ← Back to Games
        </button>
        <h1>Snake Game Dashboard</h1>
        <button onClick={() => navigate('/snake')} className="nav-button primary">
          Play Now
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>High Score</h3>
            <div className="stat-value">{highScore}</div>
          </div>
          <div className="stat-card">
            <h3>Games Played</h3>
            <div className="stat-value">{stats.totalGames}</div>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <div className="stat-value">{stats.averageScore}</div>
          </div>
        </div>

        <div className="difficulty-stats">
          <h2>High Scores by Difficulty</h2>
          <div className="difficulty-grid">
            <div className="difficulty-card easy">
              <h3>Easy</h3>
              <div className="score">{stats.highScoreEasy}</div>
            </div>
            <div className="difficulty-card medium">
              <h3>Medium</h3>
              <div className="score">{stats.highScoreMedium}</div>
            </div>
            <div className="difficulty-card hard">
              <h3>Hard</h3>
              <div className="score">{stats.highScoreHard}</div>
            </div>
          </div>
        </div>

        <div className="recent-games">
          <h2>Game History</h2>
          <GameHistory 
            gameName="snake" 
            history={gameHistory} 
            onClose={() => {}} 
          />
        </div>
      </div>
    </div>
  );
};

export default SnakeDashboard; 