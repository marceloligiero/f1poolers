import express from 'express';
import cors from 'cors';
import { initDatabase } from './database.js';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import driversRoutes from './routes/drivers.js';
import teamsRoutes from './routes/teams.js';
import leaguesRoutes from './routes/leagues.js';
import roundsRoutes from './routes/rounds.js';
import eventsRoutes from './routes/events.js';
import betsRoutes from './routes/bets.js';
import resultsRoutes from './routes/results.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/leagues', leaguesRoutes);
app.use('/api/rounds', roundsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/bets', betsRoutes);
app.use('/api/results', resultsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🏎️  F1 Poolers API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
