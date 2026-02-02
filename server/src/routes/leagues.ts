import express, { Request, Response } from 'express';
import { getDb, saveDatabase } from '../database.js';

const router = express.Router();

// GET /api/leagues - Lista todas as ligas
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const leagues = db.exec('SELECT * FROM leagues');
  
  if (leagues.length > 0) {
    const result = leagues[0].values.map((row: any[]) => {
      const leagueId = row[0];
      
      // Get members
      const members = db.exec('SELECT user_id FROM league_members WHERE league_id = ?', [leagueId]);
      const memberIds = members.length > 0 ? members[0].values.map((m: any[]) => m[0]) : [];
      
      return {
        id: row[0],
        name: row[1],
        description: row[2],
        adminId: row[3],
        isPrivate: row[4] === 1,
        inviteCode: row[5],
        createdAt: row[6],
        hasChat: row[7] === 1,
        members: memberIds,
        messages: [],
        memberStatus: {}
      };
    });
    res.json(result);
  } else {
    res.json([]);
  }
});

// GET /api/leagues/:id - Busca liga por ID
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.exec('SELECT * FROM leagues WHERE id = ?', [req.params.id]);
  
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    const leagueId = row[0];
    
    // Get members
    const members = db.exec('SELECT user_id FROM league_members WHERE league_id = ?', [leagueId]);
    const memberIds = members.length > 0 ? members[0].values.map((m: any[]) => m[0]) : [];
    
    res.json({
      id: row[0],
      name: row[1],
      description: row[2],
      adminId: row[3],
      isPrivate: row[4] === 1,
      inviteCode: row[5],
      createdAt: row[6],
      hasChat: row[7] === 1,
      members: memberIds,
      messages: [],
      memberStatus: {}
    });
  } else {
    res.status(404).json({ error: 'League not found' });
  }
});

export default router;
