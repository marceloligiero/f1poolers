import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';

const router = express.Router();

// GET /api/drivers - Lista todos os pilotos
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const drivers = db.exec('SELECT * FROM drivers');
  
  if (drivers.length > 0) {
    const result = drivers[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      nationality: row[2],
      teamId: row[3],
      number: row[4],
      imageUrl: row[5]
    }));
    res.json(result);
  } else {
    res.json([]);
  }
});

// GET /api/drivers/:id - Busca um piloto por ID
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.exec('SELECT * FROM drivers WHERE id = ?', [req.params.id]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    res.json({
      id: row[0],
      name: row[1],
      nationality: row[2],
      teamId: row[3],
      number: row[4],
      imageUrl: row[5]
    });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

export default router;
