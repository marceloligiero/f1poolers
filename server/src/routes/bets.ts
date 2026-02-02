import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// GET /api/bets - Lista todas as apostas
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { userId, eventId } = req.query;
  
  let query = 'SELECT * FROM bets';
  const params: any[] = [];
  
  if (userId) {
    query += ' WHERE user_id = ?';
    params.push(userId);
  } else if (eventId) {
    query += ' WHERE event_id = ?';
    params.push(eventId);
  }
  
  query += ' ORDER BY placed_at DESC';
  
  const bets = db.exec(query, params);
  
  if (bets.length > 0) {
    const result = bets[0].values.map((row: any[]) => ({
      id: row[0],
      userId: row[1],
      eventId: row[2],
      predictions: JSON.parse(row[3] || '[]'),
      teamPredictions: JSON.parse(row[4] || '[]'),
      lockedMultiplier: row[5] || 1,
      timestamp: row[6],
      status: row[7] || 'Active'
    }));
    res.json(result);
  } else {
    res.json([]);
  }
});

// GET /api/bets/:id - Busca aposta por ID
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.exec('SELECT * FROM bets WHERE id = ?', [req.params.id]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    res.json({
      id: row[0],
      userId: row[1],
      eventId: row[2],
      driverId: row[3],
      amount: row[4],
      potentialReturn: row[5],
      placedAt: row[6]
    });
  } else {
    res.status(404).json({ error: 'Bet not found' });
  }
});

// POST /api/bets - Cria nova aposta
router.post('/', (req: Request, res: Response) => {
  const { userId, eventId, predictions, teamPredictions, lockedMultiplier } = req.body;
  const db = getDb();
  
  // Check user balance
  const userResult = db.exec('SELECT balance FROM users WHERE id = ?', [userId]);
  if (userResult.length === 0 || userResult[0].values.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const balance = userResult[0].values[0][0] as number;
  const betAmount = 10; // Fixed bet value
  
  if (balance < betAmount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  const id = `bet-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const placedAt = new Date().toISOString();
  const predictionsJson = JSON.stringify(predictions || []);
  const teamPredictionsJson = JSON.stringify(teamPredictions || []);
  
  // Create bet
  db.run(`INSERT INTO bets (id, user_id, event_id, predictions, team_predictions, locked_multiplier, placed_at, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, eventId, predictionsJson, teamPredictionsJson, lockedMultiplier || 1, placedAt, 'Active']);
  
  // Update user balance
  db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [betAmount, userId]);
  
  saveDatabase();
  
  res.json({
    id,
    userId,
    eventId,
    predictions,
    teamPredictions,
    lockedMultiplier: lockedMultiplier || 1,
    placedAt,
    status: 'Active'
  });
});

// DELETE /api/bets/:id - Cancela aposta
router.delete('/:id', (req: Request, res: Response) => {
  const db = getDb();
  
  // Get bet details
  const betResult = db.exec('SELECT user_id, amount FROM bets WHERE id = ?', [req.params.id]);
  if (betResult.length === 0 || betResult[0].values.length === 0) {
    return res.status(404).json({ error: 'Bet not found' });
  }
  
  const [userId, amount] = betResult[0].values[0];
  
  // Refund user
  db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, userId]);
  
  // Delete bet
  db.run('DELETE FROM bets WHERE id = ?', [req.params.id]);
  
  saveDatabase();
  
  res.json({ success: true });
});

export default router;
