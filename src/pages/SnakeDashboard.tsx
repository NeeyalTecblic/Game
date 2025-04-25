import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameDashboard.css';

interface GameResult {
  date: string;
  score: number;
  won: boolean;
  difficulty?: string;
}

const SnakeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [highScore, setHighScore] = useState<number>(0);
  const [stats, setStats] = useState({
    totalGames: 0,
    averageScore: 0,
    highScoreEasy: 0,
    highScoreMedium: 0,
    highScoreHard: 0,
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('snakeGameHistory') || '[]');
    const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    
    setGameHistory(history);
    setHighScore(scores.snake || 0);

    // Calculate stats
    const totalGames = history.length;
    const totalScore = history.reduce((sum: number, game: GameResult) => sum + game.score, 0);
    
    const difficultyScores = history.reduce((acc: any, game: GameResult) => {
      if (game.difficulty) {
        acc[game.difficulty] = Math.max(acc[game.difficulty], game.score);
      }
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });

    setStats({
      totalGames,
      averageScore: totalGames ? Math.round(totalScore / totalGames) : 0,
      highScoreEasy: difficultyScores.easy,
      highScoreMedium: difficultyScores.medium,
      highScoreHard: difficultyScores.hard,
    });
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
          <h2>Recent Games</h2>
          <div className="games-table-container">
            <table className="games-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Difficulty</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((game, index) => (
                  <tr key={index} className={game.won ? 'highlight' : ''}>
                    <td>{game.date}</td>
                    <td>{game.score}</td>
                    <td>{game.difficulty || 'Easy'}</td>
                    <td>{game.won ? '🏆 High Score!' : 'Game Over'}</td>
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

export default SnakeDashboard; 