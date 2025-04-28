import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card";
import Modal from "../components/Modal";
import "../App.css";
import { gameStatsApi } from '../api/gameStats';

const emojis = ["🍕", "🍔", "🍟", "🌮", "🍣", "🍩"];
const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

interface CardData {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameResult {
  date: string;
  score: number;
  totalPairs: number;
  attemptsLeft: number;
  won: boolean;
}

const STORAGE_KEY = 'cardFlipGameHistory';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const [leftAttempts, setLeftAttempts] = useState(20);
  const [score, setScore] = useState(0);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    const initialized = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialized);
  }, []);

  const saveGameResult = async (won: boolean) => {
    const result: GameResult = {
      date: new Date().toLocaleString(),
      score,
      totalPairs: emojis.length,
      attemptsLeft: leftAttempts,
      won
    };
    
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    const gameHistory = savedHistory ? JSON.parse(savedHistory) : [];
    const updatedHistory = [result, ...gameHistory];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    try {
      await gameStatsApi.saveGameResult({
        gameName: 'cardFlip',
        score: score,
        moves: leftAttempts,
        won: won,
        difficulty: 'medium'
      });
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  };

  useEffect(() => {
    if (leftAttempts === 0 && score < emojis.length) {
      setShowGameOverModal(true);
      saveGameResult(false);
    }
  }, [leftAttempts, score]);

  useEffect(() => {
    if (score === emojis.length && cards.length > 0) {
      setShowWinModal(true);
      saveGameResult(true);
    }
  }, [score, cards.length]);

  const returnToDashboard = () => {
    navigate('/');
  };

  const resetGame = () => {
    const initialized = shuffled.sort(() => Math.random() - 0.5).map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialized);
    setFlipped([]);
    setLeftAttempts(20);
    setScore(0);
    setShowGameOverModal(false);
    setShowWinModal(false);
  };

  const handleClick = (index: number) => {
    if (lock || cards[index].isFlipped || cards[index].isMatched || leftAttempts === 0) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    const newFlipped = [...flipped, index];
    setCards(newCards);
    setFlipped(newFlipped);
    setLeftAttempts(leftAttempts - 1);
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      setLock(true);
      if (newCards[first].value === newCards[second].value) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setScore(score + 1);
        setTimeout(() => {
          setCards([...newCards]);
          setFlipped([]);
          setLock(false);
        }, 500);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards([...newCards]);
          setFlipped([]);
          setLock(false);
        }, 1000);
      }
    }
  };

  const loadStats = async () => {
    try {
      const stats = await gameStatsApi.getGameStats('cardFlip');
      console.log('Game stats:', stats);
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={returnToDashboard}>← Back to Dashboard</button>
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Attempts Left</span>
            <span className="stat-value">{leftAttempts}</span>
          </div>
        </div>
      </div>

      <div className="game-board">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            value={card.value}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>

      <Modal
        isOpen={showGameOverModal}
        title="Game Over!"
        message={`You ran out of attempts! You matched ${score} pairs out of ${emojis.length}.`}
        onClose={returnToDashboard}
        buttonText="Return to Dashboard"
      />

      <Modal
        isOpen={showWinModal}
        title="Congratulations!"
        message={`You won the game with ${leftAttempts} attempts remaining!`}
        onClose={returnToDashboard}
        buttonText="Return to Dashboard"
      />
    </div>
  );
};

export default GamePage; 