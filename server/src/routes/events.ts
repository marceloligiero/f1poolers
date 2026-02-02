import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// GET /api/events - Lista todos os eventos
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { roundId, status } = req.query;
  
  let query = 'SELECT * FROM events';
  const params: any[] = [];
  
  if (roundId) {
    query += ' WHERE round_id = ?';
    params.push(roundId);
  } else if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY scheduled_time';
  
  const events = db.exec(query, params);
  
  if (events.length > 0) {
    const result = events[0].values.map((row: any[]) => ({
      id: row[0],
      roundId: row[1],
      type: row[2],
      scheduledTime: row[3],
      status: row[4],
      poolPrize: row[5] || 0,
      betValue: row[6] || 10
    }));
    res.json(result);
  } else {
    res.json([]);
  }
});

// GET /api/events/:id - Busca evento por ID
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.exec('SELECT * FROM events WHERE id = ?', [req.params.id]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    res.json({
      id: row[0],
      roundId: row[1],
      type: row[2],
      scheduledTime: row[3],
      status: row[4]
    });
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// POST /api/events - Cria novo evento (admin)
router.post('/', (req: Request, res: Response) => {
  const { roundId, type, scheduledTime } = req.body;
  const db = getDb();
  
  const id = `event-${Date.now()}-${randomUUID().slice(0, 8)}`;
  
  db.run(`INSERT INTO events (id, round_id, type, scheduled_time, status) 
          VALUES (?, ?, ?, ?, 'upcoming')`,
    [id, roundId, type, scheduledTime]);
  
  saveDatabase();
  
  res.json({
    id,
    roundId,
    type,
    scheduledTime,
    status: 'upcoming'
  });
});

// PATCH /api/events/:id/status - Atualiza status do evento (admin)
router.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const db = getDb();
  
  db.run('UPDATE events SET status = ? WHERE id = ?', [status, req.params.id]);
  saveDatabase();
  
  res.json({ success: true, status });
});

export default router;
