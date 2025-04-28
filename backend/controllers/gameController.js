import Game from '../models/Game.js';
import User from '../models/User.js';

// Helper to generate shuffled cards (pairs)
function generateShuffledCards() {
  const values = ['A', 'B', 'C', 'D', 'E', 'F']; // 6 pairs, 12 cards
  let cards = values.concat(values).map(value => ({ value }));
  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// Create a new game (generic for any game type)
export const createGame = async (req, res) => {
  try {
    const { gameName, data } = req.body;
    if (!gameName) return res.status(400).json({ error: 'gameName is required' });
    const game = new Game({ user: req.user.id, gameName, data: data || {} });
    await game.save();
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get game state
export const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('user', 'username');
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Perform a game action or submit result (generic for all games)
export const gameAction = async (req, res) => {
  try {
    const { action, data, score } = req.body;
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status === 'finished') return res.status(400).json({ error: 'Game already finished' });

    // Save any game-specific data
    if (data) {
      game.data = { ...game.data, ...data };
    }

    // If action is finish, set score and update user bestScores
    if (action === 'finish') {
      if (typeof score !== 'number') return res.status(400).json({ error: 'score is required to finish' });
      game.score = score;
      game.status = 'finished';
      // Update user bestScores and gamesPlayed for this gameName
      const user = await User.findById(game.user);
      const prevBest = user.bestScores.get(game.gameName);
      // For most games, higher score is better. Adjust if lower is better.
      if (!prevBest || score > prevBest) {
        user.bestScores.set(game.gameName, score);
      }
      user.gamesPlayed.set(game.gameName, (user.gamesPlayed.get(game.gameName) || 0) + 1);
      await user.save();
    }

    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all games for a user
export const getGamesByUser = async (req, res) => {
  try {
    const games = await Game.find({ user: req.user.id });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all moves for a game
export const getMoves = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game.moves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 