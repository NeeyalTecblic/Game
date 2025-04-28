import express from 'express';
import { createGame, getGame, gameAction, getGamesByUser } from '../controllers/gameController.js';
import {auth} from '../middleware/auth.js';

const router = express.Router();

// Create a new game
router.post('/', auth, createGame);

// Get game state
router.get('/:id', auth, getGame);

// Perform a game action or submit result
router.post('/:id/action', auth, gameAction);

// Get all games for the logged-in user
router.get('/user/me', auth, getGamesByUser);

export default router; 