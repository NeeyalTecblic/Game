import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaTimes } from 'react-icons/fa';
import { GiCardRandom, GiSnake } from 'react-icons/gi';
import { getLeaderboard } from '../api';
import './LandingPage.css';

const gameNames = [
  { key: 'flipcard', label: 'Memory Card Game' },
  { key: 'snake', label: 'Snake Game' },
  { key: 'tictactoe', label: 'Tic Tac Toe' }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboards, setLeaderboards] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function fetchLeaderboards() {
      const results: Record<string, any[]> = {};
      for (const game of gameNames) {
        results[game.key] = await getLeaderboard(game.key);
      }
      setLeaderboards(results);
    }
    fetchLeaderboards();
  }, []);

  const games = [
    {
      title: 'Memory Card Game',
      description: 'Test your memory and concentration in this classic card-matching challenge. Flip cards, find pairs, and improve your cognitive skills while having fun.',
      icon: <GiCardRandom />,
      playPath: '/game',
      statsPath: '/memory-dashboard',
      className: 'memory-game',
      key: 'flipcard'
    },
    {
      title: 'Snake Game',
      description: 'Guide your snake through the arena, collect food, and grow longer without hitting the walls or yourself. Choose from multiple difficulty levels!',
      icon: <GiSnake />,
      playPath: '/snake',
      statsPath: '/snake-dashboard',
      className: 'snake-game',
      key: 'snake'
    },
    {
      title: 'Tic Tac Toe',
      description: 'Experience the timeless game of Tic Tac Toe with a modern twist. Challenge yourself against our AI opponent and master your strategy.',
      icon: <FaTimes />,
      playPath: '/tic-tac-toe',
      statsPath: '/tictactoe-dashboard',
      className: 'tictactoe-game',
      key: 'tictactoe'
    },
    {
      title: 'Coming Soon',
      description: 'More exciting games are on the way! Stay tuned for new additions to our collection.',
      icon: <FaGamepad />,
      playPath: '#',
      statsPath: '#',
      className: 'coming-soon',
      key: 'comingsoon'
    }
  ];

  return (
    <div className="landing-wrapper">
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Game Hub</span>
          </h1>
          <p className="hero-subtitle">
            Dive into a world of classic games reimagined for the modern web.
            Challenge yourself, track your progress, and compete for high scores.
          </p>
        </div>
      </section>

      <section className="game-showcase">
        {games.map((game, index) => (
          <div key={index} className={`game-preview ${game.className}`}>
            <div className="preview-front">
              <div className="preview-icon">{game.icon}</div>
              <h2>{game.title}</h2>
              <div className="preview-actions">
                <button
                  className="play-now-btn"
                  onClick={() => game.playPath !== '#' && navigate(game.playPath)}
                >
                  Play Now
                </button>
              </div>
            </div>
            <div className="preview-back">
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <div className="preview-actions">
                <button
                  className="play-now-btn"
                  onClick={() => game.playPath !== '#' && navigate(game.playPath)}
                >
                  Play Now
                </button>
                <button
                  className="view-stats-btn"
                  onClick={() => game.statsPath !== '#' && navigate(game.statsPath)}
                >
                  View Stats
                </button>
              </div>
            </div>
            {game.key !== 'comingsoon' && leaderboards[game.key] && (
              <div className="leaderboard-preview">
                <h4>Leaderboard</h4>
                <ol>
                  {leaderboards[game.key].slice(0, 5).map((entry, idx) => (
                    <li key={idx}>
                      {entry.username}: <b>{entry.bestScore}</b>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>Choose your game and start your journey!</p>
          <div className="footer-links">
            {games.slice(0, 3).map((game, index) => (
              <span key={index} onClick={() => navigate(game.playPath)}>
                {game.title}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 