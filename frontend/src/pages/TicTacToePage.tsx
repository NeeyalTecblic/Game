import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame, gameAction } from '../api';
import './TicTacToe.css';

type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';

const TicTacToePage: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [moveCount, setMoveCount] = useState(0);
  const [gameId, setGameId] = useState<string | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    async function createGame() {
      const game = await startGame('tictactoe');
      setGameId(game._id);
    }
    createGame();
  }, []);

  const checkWinner = (squares: Player[]): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
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

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameState('playing');
    setMoveCount(0);
    setGameId(null);
    finishedRef.current = false;
    // Start a new backend game
    startGame('tictactoe').then(game => setGameId(game._id));
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
    if (winner && !finishedRef.current && gameId) {
      finishedRef.current = true;
      setGameState(winner === 'draw' ? 'draw' : 'won');
      let winnerLabel = winner === 'draw' ? 'Draw' : winner === 'X' ? 'Player' : 'Computer';
      gameAction(gameId, 'finish', { winner: winnerLabel }, moveCount);
    }
  }, [board, moveCount, gameId]);

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