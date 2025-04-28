import React from 'react';
import { GameHistory as GameHistoryType } from '../api/gameStats';
import './GameHistory.css';

interface GameHistoryProps {
  gameName: string;
  history: GameHistoryType[];
  onClose: () => void;
}

const GameHistory: React.FC<GameHistoryProps> = ({ gameName, history, onClose }) => {
  const getGameIcon = (gameName: string) => {
    switch (gameName.toLowerCase()) {
      case 'snake':
        return '🐍';
      case 'tictactoe':
        return '⭕';
      case 'cardflip':
        return '🎴';
      default:
        return '🎮';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getResultText = (game: GameHistoryType) => {
    switch (gameName.toLowerCase()) {
      case 'snake':
        return game.won ? '🏆 High Score!' : 'Game Over';
      case 'tictactoe':
        return game.won ? 'You Won!' : 'Draw';
      case 'cardflip':
        return game.won ? 'Completed!' : 'Game Over';
      default:
        return game.won ? 'Won' : 'Lost';
    }
  };

  return (
    <div className="history-modal">
      <div className="history-content">
        <div className="history-header">
          <div className="game-title">
            <span className="game-icon">{getGameIcon(gameName)}</span>
            <h2>{gameName.charAt(0).toUpperCase() + gameName.slice(1)} History</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
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
                  {gameName.toLowerCase() === 'snake' && <th>Difficulty</th>}
                  {gameName.toLowerCase() === 'tictactoe' && <th>Moves</th>}
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((game) => (
                  <tr key={game.id} className={game.won ? 'won' : 'lost'}>
                    <td>{formatDate(game.date)}</td>
                    <td>{game.score}</td>
                    {gameName.toLowerCase() === 'snake' && <td>{game.difficulty || 'Easy'}</td>}
                    {gameName.toLowerCase() === 'tictactoe' && <td>{game.moves}</td>}
                    <td className="game-result">{getResultText(game)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHistory; 