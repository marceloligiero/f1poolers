import initSqlJs, { Database } from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'f1poolers.db');

let db: Database;

export async function initDatabase() {
  const SQL = await initSqlJs();
  
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
    console.log('Database loaded from file');
  } else {
    db = new SQL.Database();
    await createTables();
    await seedInitialData();
    saveDatabase();
    console.log('New database created and seeded');
  }
}

async function createTables() {
  const schema = `
    CREATE TABLE IF NOT EXISTS system_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      theme TEXT DEFAULT 'original',
      terms_content TEXT
    );

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nationality TEXT,
      logo_url TEXT
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nationality TEXT,
      team_id TEXT NOT NULL,
      number INTEGER,
      image_url TEXT,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar_url TEXT,
      balance INTEGER DEFAULT 100,
      points INTEGER DEFAULT 0,
      is_admin INTEGER DEFAULT 0,
      age INTEGER,
      country TEXT,
      lat REAL,
      lng REAL,
      terms_accepted INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS rounds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      country TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      round_number INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      round_id TEXT NOT NULL,
      type TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming',
      FOREIGN KEY (round_id) REFERENCES rounds(id)
    );

    CREATE TABLE IF NOT EXISTS bets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      driver_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      potential_return INTEGER NOT NULL,
      placed_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
    );

    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      driver_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
    );

    CREATE TABLE IF NOT EXISTS leagues (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      admin_id TEXT NOT NULL,
      is_private INTEGER DEFAULT 0,
      invite_code TEXT,
      created_at TEXT NOT NULL,
      has_chat INTEGER DEFAULT 0,
      FOREIGN KEY (admin_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS league_members (
      league_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      PRIMARY KEY (league_id, user_id),
      FOREIGN KEY (league_id) REFERENCES leagues(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS league_messages (
      id TEXT PRIMARY KEY,
      league_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (league_id) REFERENCES leagues(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS coin_packs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      coins INTEGER NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD'
    );
  `;

  db.run(schema);
}

async function seedInitialData() {
  // System Settings
  db.run(`INSERT INTO system_settings (theme, terms_content) VALUES ('original', 'F1™ POOLERS - TERMS AND CONDITIONS...')`);

  // Teams
  const teams = [
    ['redbull', 'Oracle Red Bull Racing', 'Austrian', 'https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing-logo.png.transform/2col/image.png'],
    ['ferrari', 'Scuderia Ferrari HP', 'Italian', 'https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari-logo.png.transform/2col/image.png'],
    ['mclaren', 'McLaren Formula 1 Team', 'British', 'https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren-logo.png.transform/2col/image.png'],
    ['mercedes', 'Mercedes-AMG PETRONAS F1 Team', 'German', 'https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes-logo.png.transform/2col/image.png'],
    ['astonmartin', 'Aston Martin Aramco F1 Team', 'British', 'https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin-logo.png.transform/2col/image.png'],
    ['vcarb', 'Visa Cash App RB F1 Team', 'Italian', 'https://media.formula1.com/content/dam/fom-website/teams/2024/rb-logo.png.transform/2col/image.png'],
    ['haas', 'MoneyGram Haas F1 Team', 'American', 'https://media.formula1.com/content/dam/fom-website/teams/2024/haas-f1-team-logo.png.transform/2col/image.png'],
    ['alpine', 'BWT Alpine F1 Team', 'French', 'https://media.formula1.com/content/dam/fom-website/teams/2024/alpine-logo.png.transform/2col/image.png'],
    ['williams', 'Williams Racing', 'British', 'https://media.formula1.com/content/dam/fom-website/teams/2024/williams-logo.png.transform/2col/image.png'],
    ['audi', 'Audi F1 Team', 'German', 'https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber-logo.png.transform/2col/image.png']
  ];
  
  teams.forEach(([id, name, nationality, logo_url]) => {
    db.run(`INSERT INTO teams (id, name, nationality, logo_url) VALUES (?, ?, ?, ?)`, [id, name, nationality, logo_url]);
  });

  // Drivers
  const drivers = [
    ['verstappen', 'Max Verstappen', 'Dutch', 'redbull', 1, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/verstappen.jpg.img.1024.medium.jpg'],
    ['lawson', 'Liam Lawson', 'New Zealander', 'redbull', 30, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/lawson.jpg.img.1024.medium.jpg'],
    ['leclerc', 'Charles Leclerc', 'Monegasque', 'ferrari', 16, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/leclerc.jpg.img.1024.medium.jpg'],
    ['hamilton', 'Lewis Hamilton', 'British', 'ferrari', 44, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/hamilton.jpg.img.1024.medium.jpg'],
    ['norris', 'Lando Norris', 'British', 'mclaren', 4, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/norris.jpg.img.1024.medium.jpg'],
    ['piastri', 'Oscar Piastri', 'Australian', 'mclaren', 81, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/piastri.jpg.img.1024.medium.jpg'],
    ['russell', 'George Russell', 'British', 'mercedes', 63, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/russell.jpg.img.1024.medium.jpg'],
    ['antonelli', 'Kimi Antonelli', 'Italian', 'mercedes', 12, 'https://picsum.photos/seed/antonelli/200/200'],
    ['alonso', 'Fernando Alonso', 'Spanish', 'astonmartin', 14, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/alonso.jpg.img.1024.medium.jpg'],
    ['stroll', 'Lance Stroll', 'Canadian', 'astonmartin', 18, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/stroll.jpg.img.1024.medium.jpg'],
    ['gasly', 'Pierre Gasly', 'French', 'alpine', 10, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/gasly.jpg.img.1024.medium.jpg'],
    ['doohan', 'Jack Doohan', 'Australian', 'alpine', 7, 'https://picsum.photos/seed/doohan/200/200'],
    ['albon', 'Alexander Albon', 'Thai', 'williams', 23, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/albon.jpg.img.1024.medium.jpg'],
    ['sainz', 'Carlos Sainz', 'Spanish', 'williams', 55, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/sainz.jpg.img.1024.medium.jpg'],
    ['ocon', 'Esteban Ocon', 'French', 'haas', 31, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/ocon.jpg.img.1024.medium.jpg'],
    ['bearman', 'Oliver Bearman', 'British', 'haas', 87, 'https://picsum.photos/seed/bearman/200/200'],
    ['tsunoda', 'Yuki Tsunoda', 'Japanese', 'vcarb', 22, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/tsunoda.jpg.img.1024.medium.jpg'],
    ['hadjar', 'Isack Hadjar', 'French', 'vcarb', 6, 'https://picsum.photos/seed/hadjar/200/200'],
    ['hulkenberg', 'Nico Hulkenberg', 'German', 'audi', 27, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/hulkenberg.jpg.img.1024.medium.jpg'],
    ['bortoleto', 'Gabriel Bortoleto', 'Brazilian', 'audi', 5, 'https://picsum.photos/seed/bortoleto/200/200']
  ];

  drivers.forEach(([id, name, nationality, team_id, number, image_url]) => {
    db.run(`INSERT INTO drivers (id, name, nationality, team_id, number, image_url) VALUES (?, ?, ?, ?, ?, ?)`, [id, name, nationality, team_id, number, image_url]);
  });

  // Admin User
  db.run(`INSERT INTO users (id, username, password, avatar_url, balance, points, is_admin, age, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['admin', 'admin', 'admin', 'https://picsum.photos/seed/adminuser/100/100', 999999, 0, 1, 99, 'FIA']);

  // Global League
  db.run(`INSERT INTO leagues (id, name, description, admin_id, is_private, invite_code, created_at, has_chat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['global-league', 'Official F1™ Pool League', 'The main public league for all users.', 'admin', 0, 'PUBLIC', new Date().toISOString(), 0]);

  db.run(`INSERT INTO league_members (league_id, user_id, status) VALUES (?, ?, ?)`,
    ['global-league', 'admin', 'active']);

  // Coin Packs
  const coinPacks = [
    ['pack1', 'Starter Kit', 100, 0.99],
    ['pack2', 'Racer Bundle', 550, 4.99],
    ['pack3', 'Podium Stash', 1200, 9.99],
    ['pack4', 'Championship Vault', 3000, 24.99]
  ];

  coinPacks.forEach(([id, name, coins, price]) => {
    db.run(`INSERT INTO coin_packs (id, name, coins, price, currency) VALUES (?, ?, ?, ?, 'USD')`, [id, name, coins, price]);
  });
}

export function saveDatabase() {
  const data = db.export();
  writeFileSync(DB_PATH, data);
}

export function getDb(): Database {
  return db;
}

// Auto-save every 5 minutes
setInterval(() => {
  if (db) {
    saveDatabase();
    console.log('Database auto-saved');
  }
}, 5 * 60 * 1000);
