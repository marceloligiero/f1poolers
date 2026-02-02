import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// GET /api/results - Lista todos os resultados
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { eventId } = req.query;
  
  let query = 'SELECT * FROM results';
  const params: any[] = [];
  
  if (eventId) {
    query += ' WHERE event_id = ?';
    params.push(eventId);
  }
  
  query += ' ORDER BY position';
  
  const results = db.exec(query, params);
  
  if (results.length > 0) {
    const result = results[0].values.map((row: any[]) => ({
      id: row[0],
      eventId: row[1],
      driverId: row[2],
      position: row[3]
    }));
    res.json(result);
  } else {
    res.json([]);
  }
});

// GET /api/results/:id - Busca resultado por ID
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.exec('SELECT * FROM results WHERE id = ?', [req.params.id]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    res.json({
      id: row[0],
      eventId: row[1],
      driverId: row[2],
      position: row[3]
    });
  } else {
    res.status(404).json({ error: 'Result not found' });
  }
});

// POST /api/results - Adiciona resultados (admin)
router.post('/', (req: Request, res: Response) => {
  const { eventId, driverId, position } = req.body;
  const db = getDb();
  
  const id = `result-${Date.now()}-${randomUUID().slice(0, 8)}`;
  
  db.run(`INSERT INTO results (id, event_id, driver_id, position) 
          VALUES (?, ?, ?, ?)`,
    [id, eventId, driverId, position]);
  
  saveDatabase();
  
  res.json({
    id,
    eventId,
    driverId,
    position
  });
});

// POST /api/results/bulk - Adiciona múltiplos resultados (admin)
router.post('/bulk', (req: Request, res: Response) => {
  const { eventId, results } = req.body;
  const db = getDb();
  
  if (!Array.isArray(results)) {
    return res.status(400).json({ error: 'Results must be an array' });
  }
  
  const created: any[] = [];
  
  results.forEach(({ driverId, position }: any) => {
    const id = `result-${Date.now()}-${randomUUID().slice(0, 8)}`;
    
    db.run(`INSERT INTO results (id, event_id, driver_id, position) 
            VALUES (?, ?, ?, ?)`,
      [id, eventId, driverId, position]);
    
    created.push({ id, eventId, driverId, position });
  });
  
  // Update event status to completed
  db.run('UPDATE events SET status = ? WHERE id = ?', ['completed', eventId]);
  
  saveDatabase();
  
  res.json({
    success: true,
    count: created.length,
    results: created
  });
});

export default router;
