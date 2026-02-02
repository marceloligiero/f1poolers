import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// GET /api/rounds - Lista todas as rodadas
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const rounds = db.exec('SELECT * FROM rounds ORDER BY round_number');
  
  if (rounds.length > 0) {
    const result = rounds[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      location: row[2],
      country: row[3],
      startDate: row[4],
      endDate: row[5],
      roundNumber: row[6]
    }));
    res.json(result);
  } else {
    res.json([]);
  }
});

// GET /api/rounds/:id - Busca rodada por ID
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.exec('SELECT * FROM rounds WHERE id = ?', [req.params.id]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    res.json({
      id: row[0],
      name: row[1],
      location: row[2],
      country: row[3],
      startDate: row[4],
      endDate: row[5],
      roundNumber: row[6]
    });
  } else {
    res.status(404).json({ error: 'Round not found' });
  }
});

// POST /api/rounds - Cria nova rodada (admin)
router.post('/', (req: Request, res: Response) => {
  const { name, location, country, startDate, endDate, roundNumber } = req.body;
  const db = getDb();
  
  const id = `round-${roundNumber}-${Date.now()}`;
  
  db.run(`INSERT INTO rounds (id, name, location, country, start_date, end_date, round_number) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, location, country, startDate, endDate, roundNumber]);
  
  saveDatabase();
  
  res.json({
    id,
    name,
    location,
    country,
    startDate,
    endDate,
    roundNumber
  });
});

// PUT /api/rounds/:id - Atualiza rodada (admin)
router.put('/:id', (req: Request, res: Response) => {
  const { name, location, country, startDate, endDate, roundNumber } = req.body;
  const db = getDb();
  
  db.run(`UPDATE rounds SET name = ?, location = ?, country = ?, start_date = ?, end_date = ?, round_number = ? 
          WHERE id = ?`,
    [name, location, country, startDate, endDate, roundNumber, req.params.id]);
  
  saveDatabase();
  
  res.json({ success: true });
});

// DELETE /api/rounds/:id - Deleta rodada (admin)
router.delete('/:id', (req: Request, res: Response) => {
  const db = getDb();
  
  db.run('DELETE FROM rounds WHERE id = ?', [req.params.id]);
  saveDatabase();
  
  res.json({ success: true });
});

export default router;
