import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SnakeGame.css';

type Position = {
  x: number;
  y: number;
};

type Difficulty = 'easy' | 'medium' | 'hard';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const SPEED_MAP = {
  easy: 200,
  medium: 150,
  hard: 100,
};

const SCORE_MULTIPLIER = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<string>('right');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<number>();
  const navigate = useNavigate();

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const checkCollision = useCallback((head: Position) => {
    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }, [snake]);

  const saveGameResult = useCallback((finalScore: number) => {
    // Save high score
    const existingScores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    const isHighScore = finalScore > (existingScores.snake || 0);
    existingScores.snake = Math.max(existingScores.snake || 0, finalScore);
    localStorage.setItem('gameScores', JSON.stringify(existingScores));

    // Save game history
    const gameResult = {
      date: new Date().toLocaleDateString(),
      score: finalScore,
      won: isHighScore,
    };

    const history = JSON.parse(localStorage.getItem('snakeGameHistory') || '[]');
    history.unshift(gameResult);
    // Keep only last 10 games
    if (history.length > 10) {
      history.pop();
    }
    localStorage.setItem('snakeGameHistory', JSON.stringify(history));
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      saveGameResult(score);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + (10 * SCORE_MULTIPLIER[difficulty]));
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, generateFood, checkCollision, gameOver, isPaused, difficulty, score, saveGameResult]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED_MAP[difficulty]);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, difficulty, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    generateFood();
    setDirection('right');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <div className="snake-game-container">
      <div className="game-header">
        <h1>Snake Game</h1>
        <div className="score">Score: {score}</div>
        <div className="difficulty-controls">
          <button
            className={difficulty === 'easy' ? 'active' : ''}
            onClick={() => handleDifficultyChange('easy')}
          >
            Easy
          </button>
          <button
            className={difficulty === 'medium' ? 'active' : ''}
            onClick={() => handleDifficultyChange('medium')}
          >
            Medium
          </button>
          <button
            className={difficulty === 'hard' ? 'active' : ''}
            onClick={() => handleDifficultyChange('hard')}
          >
            Hard
          </button>
        </div>
      </div>

      <div 
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE + 'px',
          height: GRID_SIZE * CELL_SIZE + 'px',
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: segment.x * CELL_SIZE + 'px',
              top: segment.y * CELL_SIZE + 'px',
              width: CELL_SIZE + 'px',
              height: CELL_SIZE + 'px',
            }}
          />
        ))}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE + 'px',
            top: food.y * CELL_SIZE + 'px',
            width: CELL_SIZE + 'px',
            height: CELL_SIZE + 'px',
          }}
        />
      </div>

      <div className="game-controls">
        {gameOver ? (
          <button onClick={resetGame}>Play Again</button>
        ) : (
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default SnakeGame; 