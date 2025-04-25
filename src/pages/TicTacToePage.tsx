import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicTacToe.css';

type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';

interface GameResult {
  date: string;
  winner: string;
  moves: number;
}

const TicTacToePage: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [moveCount, setMoveCount] = useState(0);

  const checkWinner = (squares: Player[]): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return 'draw';
    }

    return null;
  };

  const minimax = (
    squares: Player[],
    depth: number,
    isMaximizing: boolean
  ): number => {
    const result = checkWinner(squares);

    if (result === 'X') return -10 + depth;
    if (result === 'O') return 10 - depth;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (squares: Player[]): number => {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const handleClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameState !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);
    setIsPlayerTurn(false);
  };

  const saveGameResult = (result: GameResult) => {
    const history = JSON.parse(localStorage.getItem('tictactoeHistory') || '[]');
    history.unshift(result);
    localStorage.setItem('tictactoeHistory', JSON.stringify(history.slice(0, 100)));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameState('playing');
    setMoveCount(0);
  };

  useEffect(() => {
    if (!isPlayerTurn && gameState === 'playing') {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const bestMove = findBestMove(newBoard);
        newBoard[bestMove] = 'O';
        setBoard(newBoard);
        setMoveCount(prev => prev + 1);
        setIsPlayerTurn(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, gameState]);

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setGameState(winner === 'draw' ? 'draw' : 'won');
      saveGameResult({
        date: new Date().toLocaleString(),
        winner: winner === 'draw' ? 'Draw' : winner === 'X' ? 'Player' : 'Computer',
        moves: moveCount
      });
    }
  }, [board, moveCount]);

  return (
    <div className="tictactoe-container">
      <nav className="game-nav">
        <button onClick={() => navigate('/')} className="nav-button">
          ← Back to Games
        </button>
        <h1>Tic Tac Toe vs AI</h1>
        <button onClick={() => navigate('/tictactoe-dashboard')} className="nav-button">
          View Stats
        </button>
      </nav>

      <div className="game-content">
        <div className="game-status">
          {gameState === 'playing' ? (
            <p>{isPlayerTurn ? "Your turn (X)" : "Computer thinking... (O)"}</p>
          ) : gameState === 'won' ? (
            <p>{!isPlayerTurn ? "You won! 🎉" : "Computer won!"}</p>
          ) : (
            <p>It's a draw! 🤝</p>
          )}
        </div>

        <div className="game-board">
          {board.map((cell, index) => (
            <div
              key={index}
              className={`board-cell ${cell || ''}`}
              onClick={() => handleClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>

        <div className="game-controls">
          <button 
            className="reset-button"
            onClick={resetGame}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToePage; 