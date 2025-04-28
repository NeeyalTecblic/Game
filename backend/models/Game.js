import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  value: String,
  isFlipped: { type: Boolean, default: false },
  isMatched: { type: Boolean, default: false }
});

const moveSchema = new mongoose.Schema({
  cardIndex: Number,
  timestamp: { type: Date, default: Date.now }
});

const gameSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gameName: { type: String, required: true }, // e.g., 'flipcard', 'tictactoe', etc.
  score: { type: Number, required: false }, // Score for this game instance
  data: { type: mongoose.Schema.Types.Mixed, default: {} }, // Game-specific data (moves, board, etc.)
  status: { type: String, enum: ['playing', 'finished'], default: 'playing' },
  createdAt: { type: Date, default: Date.now }
});

const Game = mongoose.model('Game', gameSchema);
export default Game; 