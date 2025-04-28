import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import gameStatsRoutes from './routes/gameStats.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/games', gameStatsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 