import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';

const router = express.Router();

// GET /api/teams - Lista todos os times
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const teams = db.exec('SELECT * FROM teams');
  
  if (teams.length > 0) {
    const result = teams[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      nationality: row[2],
      logoUrl: row[3]
    }));
    res.json(result);
  } else {
    res.json([]);
  }
});

export default router;
