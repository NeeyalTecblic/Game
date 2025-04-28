import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  const { gameName } = req.query;
  if (!gameName) return res.status(400).json({ error: 'gameName is required' });
  try {
    const users = await User.find({ [`bestScores.${gameName}`]: { $ne: null } })
      .sort({ [`bestScores.${gameName}`]: -1 }) // -1 for higher-is-better
      .limit(10)
      .select(`username bestScores.${gameName}`);
    res.json(users.map(u => ({
      username: u.username,
      bestScore: u.bestScores.get(gameName)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 