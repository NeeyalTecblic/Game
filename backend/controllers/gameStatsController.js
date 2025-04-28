import Game from '../models/Game.js';
import User from '../models/User.js';

// Get overall statistics for a specific game
export const getGameStats = async (req, res) => {
  try {
    const { gameName } = req.params;
    const userId = req.user.id;

    console.log("gameName...10", gameName)
    console.log("userId...11", userId)
    const games = await Game.find({ 
      user: userId,
      gameName,
      status: 'finished'
    });

    console.log("Games...18", games)
    const totalGames = games.length;
    const gamesWon = games.filter(g => g.data?.won).length;
    const bestScore = Math.max(...games.map(g => g.score || 0));
    const averageScore = totalGames > 0 
      ? games.reduce((sum, g) => sum + (g.score || 0), 0) / totalGames 
      : 0;
    const winRate = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0;

    res.json({
      gamesPlayed: totalGames,
      gamesWon,
      bestScore,
      averageScore,
      winRate,
      gameHistory: games.map(g => ({
        id: g._id,
        date: g.createdAt,
        score: g.score,
        moves: g.data?.moves,
        won: g.data?.won,
        difficulty: g.data?.difficulty,
        gameName: g.gameName
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get game history for a specific game
export const getGameHistory = async (req, res) => {
  try {
    const { gameName } = req.params;
    const userId = req.user.id;

    const games = await Game.find({ 
      user: userId,
      gameName,
      status: 'finished'
    }).sort({ createdAt: -1 });

    res.json(games.map(g => ({
      id: g._id,
      date: g.createdAt,
      score: g.score,
      moves: g.data?.moves,
      won: g.data?.won,
      difficulty: g.data?.difficulty,
      gameName: g.gameName
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save a new game result
export const saveGameResult = async (req, res) => {
  try {
    const { gameName, score, moves, won, difficulty, data } = req.body;
    const userId = req.user.id;

    const game = new Game({
      user: userId,
      gameName,
      score,
      data: {
        ...data,
        moves,
        won,
        difficulty
      },
      status: 'finished'
    });

    await game.save();

    // Update user's best score and games played count
    const user = await User.findById(userId);
    const prevBest = user.bestScores.get(gameName);
    if (!prevBest || score > prevBest) {
      user.bestScores.set(gameName, score);
    }
    user.gamesPlayed.set(gameName, (user.gamesPlayed.get(gameName) || 0) + 1);
    await user.save();

    res.json({
      id: game._id,
      date: game.createdAt,
      score: game.score,
      moves: game.data?.moves,
      won: game.data?.won,
      difficulty: game.data?.difficulty,
      gameName: game.gameName
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's best scores across all games
export const getBestScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(Object.fromEntries(user.bestScores));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get total games played by game type
export const getGamesPlayed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(Object.fromEntries(user.gamesPlayed));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get recent games across all game types
export const getRecentGames = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    const games = await Game.find({ 
      user: userId,
      status: 'finished'
    })
    .sort({ createdAt: -1 })
    .limit(limit);

    res.json(games.map(g => ({
      id: g._id,
      date: g.createdAt,
      score: g.score,
      moves: g.data?.moves,
      won: g.data?.won,
      difficulty: g.data?.difficulty,
      gameName: g.gameName
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 