import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export interface GameResult {
  date: string;
  score?: number;
  totalPairs?: number;
  attemptsLeft?: number;
  winner?: 'X' | 'O' | 'Draw';
  moves?: number;
  won: boolean;
}

interface GameInfo {
  id: string;
  name: string;
  description: string;
  route: string;
  storageKey: string;
  icon: string;
  renderResult: (result: GameResult) => { score: string; result: string };
}

const GAMES: GameInfo[] = [
  {
    id: 'flip-card',
    name: 'Memory Card Game',
    description: 'Challenge your memory! Match pairs of cards before running out of attempts. Perfect for improving concentration and memory skills.',
    route: '/game',
    storageKey: 'cardFlipGameHistory',
    icon: '🎴',
    renderResult: (result: GameResult) => ({
      score: `${result.score}/${result.totalPairs}`,
      result: result.won ? 'Won! 🎉' : 'Lost 😢'
    })
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: "The classic game of X's and O's. Challenge your friends or play against yourself in this timeless strategic battle.",
    route: '/tic-tac-toe',
    storageKey: 'ticTacToeHistory',
    icon: '⭕',
    renderResult: (result: GameResult) => ({
      score: `Moves: ${result.moves}`,
      result: result.winner === 'Draw' ? 'Draw 🤝' : `${result.winner} Wins! ${result.winner === 'X' ? '❌' : '⭕'}`
    })
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Guide your snake to eat food and grow longer, but don\'t hit the walls or yourself! Test your reflexes in three difficulty levels.',
    route: '/snake',
    storageKey: 'snakeGameHistory',
    icon: '🐍',
    renderResult: (result: GameResult) => ({
      score: `Score: ${result.score}`,
      result: result.won ? 'New High Score! 🏆' : 'Game Over 🐍'
    })
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const startGame = (route: string) => {
    navigate(route);
  };

  const viewHistory = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const closeHistory = () => {
    setSelectedGame(null);
  };

  const GameHistory: React.FC<{ game: GameInfo }> = ({ game }) => {
    const history = JSON.parse(localStorage.getItem(game.storageKey) || '[]');
    
    return (
      <div className="history-modal">
        <div className="history-content">
          <div className="history-header">
            <h2>{game.name} History</h2>
            <button className="close-button" onClick={closeHistory}>×</button>
          </div>
          <div className="history-body">
            {history.length === 0 ? (
              <p className="no-history">No games played yet</p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((result: GameResult, index: number) => {
                    const renderedResult = game.renderResult(result);
                    return (
                      <tr key={index} className={result.won ? 'won' : result.winner === 'Draw' ? 'draw' : 'lost'}>
                        <td>{result.date}</td>
                        <td>{renderedResult.score}</td>
                        <td className="game-result">{renderedResult.result}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1 className="title">Welcome to Game Center</h1>
        <p className="subtitle">Choose your adventure from our collection of classic games!</p>
      </div>

      <div className="games-grid">
        {GAMES.map(game => (
          <div key={game.id} className="game-card">
            <div className="game-card-content">
              <div className="game-icon">{game.icon}</div>
              <h2 className="game-title">{game.name}</h2>
              <p className="game-description">{game.description}</p>
              <div className="game-buttons">
                <button 
                  className="play-button"
                  onClick={() => startGame(game.route)}
                >
                  Play Game
                </button>
                <button 
                  className="history-button"
                  onClick={() => viewHistory(game.id)}
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGame && (
        <GameHistory game={GAMES.find(g => g.id === selectedGame)!} />
      )}
    </div>
  );
};

export default Dashboard; 