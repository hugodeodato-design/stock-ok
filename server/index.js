const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

/*
  Import initial data from mrdpstock_import.json if articles table is empty.
  This runs once at server startup. It inserts all articles from the JSON into the articles table.
*/
const fs = require('fs');
const path = require('path');

function importInitialArticlesIfEmpty() {
  try {
    const countRow = db.prepare('SELECT COUNT(*) as c FROM articles').get();
    const count = countRow ? countRow.c : 0;
    if (count === 0) {
      const importPath = path.join(__dirname, 'mrdpstock_import.json');
      if (fs.existsSync(importPath)) {
        const raw = fs.readFileSync(importPath, 'utf8');
        const payload = JSON.parse(raw);
        const list = Array.isArray(payload.articles) ? payload.articles : payload;
        if (list.length === 0) {
          console.log('Import file found but contains no articles.');
          return;
        }
        const insert = db.prepare('INSERT OR REPLACE INTO articles (id, client, reference, designation, dateEntree, dateSortie, emplacement, quantite, autresInfos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const insertMany = db.transaction((items) => {
          for (const a of items) {
            const id = a.id ? String(a.id) : require('uuid').v4();
            const emplacement = a.emplacement || {};
            insert.run(id, a.client || '', a.reference || '', a.designation || '', a.dateEntree || '', a.dateSortie || '', JSON.stringify(emplacement), a.quantite || 0, a.autresInfos || a.observation || '');
          }
        });
        insertMany(list);
        console.log('Imported', list.length, 'articles from mrdpstock_import.json into SQLite.');
      } else {
        console.log('No mrdpstock_import.json file to import.');
      }
    } else {
      console.log('Articles table not empty (count=' + count + '), skipping initial import.');
    }
  } catch (err) {
    console.error('Error during initial import:', err);
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Champs manquants' });
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) return res.status(400).json({ error: 'Utilisateur existe déjà' });
  const hash = bcrypt.hashSync(password, 10);
  const id = uuidv4();
  db.prepare('INSERT INTO users (id, username, passwordHash, role) VALUES (?, ?, ?, ?)').run(id, username, hash, role);
  res.json({ id, username, role });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(401).json({ error: 'Identifiants invalides' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });
  res.json({ id: user.id, username: user.username, role: user.role });
});

app.get('/api/users', (req, res) => {
  const rows = db.prepare('SELECT id, username, role FROM users').all();
  res.json(rows);
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ ok: true });
});

app.get('/api/articles', (req, res) => {
  const rows = db.prepare('SELECT * FROM articles').all();
  res.json(rows);
});

app.post('/api/articles', (req, res) => {
  const a = req.body;
  const id = uuidv4();
  db.prepare('INSERT INTO articles (id, client, reference, designation, dateEntree, dateSortie, emplacement, quantite, autresInfos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, a.client, a.reference, a.designation, a.dateEntree, a.dateSortie, a.emplacement, a.quantite || 0, a.autresInfos || '');
  res.json({ id, ...a });
});

app.put('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  const a = req.body;
  db.prepare('UPDATE articles SET client=?, reference=?, designation=?, dateEntree=?, dateSortie=?, emplacement=?, quantite=?, autresInfos=? WHERE id=?')
    .run(a.client, a.reference, a.designation, a.dateEntree, a.dateSortie, a.emplacement, a.quantite || 0, a.autresInfos || '', id);
  res.json({ ok: true });
});

app.delete('/api/articles/:id', (req, res) => {
  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
importInitialArticlesIfEmpty();

app.listen(PORT, () => console.log('API server running on', PORT));
