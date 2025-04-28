import express from 'express';
import {
  getGameStats,
  getGameHistory,
  saveGameResult,
  getBestScores,
  getGamesPlayed,
  getRecentGames
} from '../controllers/gameStatsController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get overall statistics for a specific game
router.get('/stats/:gameName', getGameStats);

// Get game history for a specific game
router.get('/history/:gameName', getGameHistory);

// Save a new game result
router.post('/save', saveGameResult);

// Get user's best scores across all games
router.get('/best-scores', getBestScores);

// Get total games played by game type
router.get('/played', getGamesPlayed);

// Get recent games across all game types
router.get('/recent', getRecentGames);

export default router; 