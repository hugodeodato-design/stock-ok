const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'mrdp.db');
const db = new Database(dbPath);

db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  passwordHash TEXT,
  role TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  client TEXT,
  reference TEXT,
  designation TEXT,
  dateEntree TEXT,
  dateSortie TEXT,
  emplacement TEXT,
  quantite INTEGER,
  autresInfos TEXT
)`).run();

module.exports = db;
