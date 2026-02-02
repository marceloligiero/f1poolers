import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';

const router = express.Router();

// GET /api/users - Lista todos os usuários
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const users = db.exec('SELECT id, username, avatar_url, balance, points, is_admin, age, country FROM users');
  
  if (users.length > 0) {
    const result = users[0].values.map((row: any[]) => ({
      id: row[0],
      username: row[1],
      avatarUrl: row[2],
      balance: row[3],
      points: row[4],
      rank: 0,
      isAdmin: row[5] === 1,
      age: row[6],
      country: row[7],
      notifications: [],
      joinedLeagues: []
    }));
    res.json(result);
  } else {
    res.json([]);
  }
});

// GET /api/users/:id - Busca usuário por ID
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.exec('SELECT id, username, avatar_url, balance, points, is_admin, age, country FROM users WHERE id = ?', [req.params.id]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    res.json({
      id: row[0],
      username: row[1],
      avatarUrl: row[2],
      balance: row[3],
      points: row[4],
      rank: 0,
      isAdmin: row[5] === 1,
      age: row[6],
      country: row[7],
      notifications: [],
      joinedLeagues: []
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// PATCH /api/users/:id/balance - Atualiza saldo
router.patch('/:id/balance', (req: Request, res: Response) => {
  const { amount } = req.body;
  const db = getDb();
  
  db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, req.params.id]);
  saveDatabase();
  
  const result = db.exec('SELECT balance FROM users WHERE id = ?', [req.params.id]);
  if (result.length > 0 && result[0].values.length > 0) {
    res.json({ balance: result[0].values[0][0] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// PATCH /api/users/:id/points - Atualiza pontos
router.patch('/:id/points', (req: Request, res: Response) => {
  const { amount } = req.body;
  const db = getDb();
  
  db.run('UPDATE users SET points = points + ? WHERE id = ?', [amount, req.params.id]);
  saveDatabase();
  
  const result = db.exec('SELECT points FROM users WHERE id = ?', [req.params.id]);
  if (result.length > 0 && result[0].values.length > 0) {
    res.json({ points: result[0].values[0][0] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

export default router;
