import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = getDb();
  
  const result = db.exec('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    const user = {
      id: row[0],
      username: row[1],
      avatarUrl: row[3],
      balance: row[4],
      points: row[5],
      isAdmin: row[6] === 1,
      age: row[7],
      country: row[8],
      notifications: [],
      joinedLeagues: []
    };
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// POST /api/auth/signup
router.post('/signup', (req: Request, res: Response) => {
  const { username, password, age, country, location } = req.body;
  const db = getDb();
  
  // Check if username exists
  const existing = db.exec('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length > 0 && existing[0].values.length > 0) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const userId = randomUUID();
  const avatarUrl = `https://picsum.photos/seed/${username}/100/100`;
  const lat = location?.lat || null;
  const lng = location?.lng || null;
  
  db.run(`INSERT INTO users (id, username, password, avatar_url, balance, points, is_admin, age, country, lat, lng) 
          VALUES (?, ?, ?, ?, 100, 0, 0, ?, ?, ?, ?)`,
    [userId, username, password, avatarUrl, age, country, lat, lng]);
  
  // Add user to global league
  db.run(`INSERT INTO league_members (league_id, user_id, status) VALUES ('global-league', ?, 'active')`, [userId]);
  
  saveDatabase();
  
  const user = {
    id: userId,
    username,
    avatarUrl,
    balance: 100,
    points: 0,
    isAdmin: false,
    age,
    country,
    notifications: [],
    joinedLeagues: ['global-league']
  };
  
  res.json(user);
});

export default router;
