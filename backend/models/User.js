import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bestScores: { type: Map, of: Number, default: {} }, // { gameName: bestScore }
  gamesPlayed: { type: Map, of: Number, default: {} } // { gameName: count }
});

const User = mongoose.model('User', userSchema);
export default User; 