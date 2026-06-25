const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'dashboard.db');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

// ── Initialize SQLite ────────────────────────────────────────────────────────
async function initDb() {
  const SQL = await initSqlJs();

  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
  }

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('Loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('Created new database');
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      section TEXT NOT NULL DEFAULT 'Person Authority Build',
      iteration TEXT NOT NULL,
      health TEXT DEFAULT 'Green',
      status TEXT DEFAULT 'In Progress',
      team TEXT DEFAULT '',
      owner TEXT DEFAULT '',
      current_state TEXT DEFAULT '',
      risks_issues TEXT DEFAULT '',
      next_steps TEXT DEFAULT '',
      business_impact TEXT DEFAULT '',
      link TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS iterations (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default iterations if empty
  const iterCount = db.exec("SELECT COUNT(*) as c FROM iterations")[0];
  if (iterCount && iterCount.values[0][0] === 0) {
    const iters = [
      ['jun23', 'Jun 23, 2026', 'current'],
      ['jul07', 'Jul 7, 2026', 'upcoming'],
      ['jul21', 'Jul 21, 2026', 'upcoming'],
      ['may12', 'May 12–26, 2026', 'past'],
      ['apr27', 'Apr 27–May 12, 2026', 'past'],
      ['apr14', 'Apr 14–27, 2026', 'past'],
      ['mar31', 'Mar 31–Apr 14, 2026', 'past'],
      ['mar17', 'Mar 17–31, 2026', 'past'],
      ['mar03', 'Mar 03–17, 2026', 'past'],
      ['feb17', 'Feb 17–Mar 03, 2026', 'past'],
    ];
    iters.forEach(([id, label, status]) => {
      db.run("INSERT INTO iterations (id, label, status) VALUES (?, ?, ?)", [id, label, status]);
    });
  }

  saveDb();
}

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function rowToObj(columns, values) {
  const obj = {};
  columns.forEach((col, i) => { obj[col] = values[i]; });
  return obj;
}

function queryAll(sql, params = []) {
  try {
    const result = db.exec(sql, params);
    if (!result.length) return [];
    return result[0].values.map(v => rowToObj(result[0].columns, v));
  } catch (e) { return []; }
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length ? rows[0] : null;
}

// ── ITERATIONS ───────────────────────────────────────────────────────────────
app.get('/api/iterations', (req, res) => {
  res.json(queryAll("SELECT * FROM iterations ORDER BY CASE status WHEN 'current' THEN 0 WHEN 'upcoming' THEN 1 ELSE 2 END, id"));
});

app.put('/api/iterations/:id', (req, res) => {
  const { label, status } = req.body;
  db.run("UPDATE iterations SET label=?, status=? WHERE id=?", [label, status, req.params.id]);
  saveDb();
  res.json({ success: true });
});

// ── MILESTONES ───────────────────────────────────────────────────────────────
app.get('/api/milestones', (req, res) => {
  const { iteration } = req.query;
  if (iteration) {
    res.json(queryAll("SELECT * FROM milestones WHERE iteration=? ORDER BY section, id", [iteration]));
  } else {
    res.json(queryAll("SELECT * FROM milestones ORDER BY iteration, section, id"));
  }
});

app.get('/api/milestones/:id', (req, res) => {
  const row = queryOne("SELECT * FROM milestones WHERE id=?", [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

app.post('/api/milestones', (req, res) => {
  const { name, section, iteration, health, status, team, owner,
          current_state, risks_issues, next_steps, business_impact, link } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  db.run(`INSERT INTO milestones 
    (name, section, iteration, health, status, team, owner, current_state, risks_issues, next_steps, business_impact, link)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [name, section || 'Person Authority Build', iteration || 'jun23',
     health || 'Green', status || 'In Progress', team || '', owner || '',
     current_state || '', risks_issues || '', next_steps || '', business_impact || '', link || '']);
  saveDb();
  const id = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
  res.json({ success: true, id });
});

app.put('/api/milestones/:id', (req, res) => {
  const { name, section, iteration, health, status, team, owner,
          current_state, risks_issues, next_steps, business_impact, link } = req.body;
  db.run(`UPDATE milestones SET
    name=?, section=?, iteration=?, health=?, status=?, team=?, owner=?,
    current_state=?, risks_issues=?, next_steps=?, business_impact=?, link=?,
    updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [name, section, iteration, health, status, team, owner,
     current_state, risks_issues, next_steps, business_impact, link, req.params.id]);
  saveDb();
  res.json({ success: true });
});

app.delete('/api/milestones/:id', (req, res) => {
  db.run("DELETE FROM milestones WHERE id=?", [req.params.id]);
  saveDb();
  res.json({ success: true });
});

// ── BULK IMPORT (from CSV/JSON) ───────────────────────────────────────────────
app.post('/api/milestones/bulk', (req, res) => {
  const { iteration, milestones, replace } = req.body;
  if (!milestones || !Array.isArray(milestones)) {
    return res.status(400).json({ error: 'milestones array required' });
  }
  if (replace && iteration) {
    db.run("DELETE FROM milestones WHERE iteration=?", [iteration]);
  }
  milestones.forEach(m => {
    db.run(`INSERT INTO milestones
      (name, section, iteration, health, status, team, owner, current_state, risks_issues, next_steps, business_impact, link)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [m.name || '', m.section || 'Person Authority Build', m.iteration || iteration || 'jun23',
       m.health || 'Green', m.status || 'In Progress', m.team || '', m.owner || '',
       m.current_state || '', m.risks_issues || '', m.next_steps || '', m.business_impact || '', m.link || '']);
  });
  saveDb();
  res.json({ success: true, count: milestones.length });
});

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── START ─────────────────────────────────────────────────────────────────────
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`People Authority Build API running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/health`);
  });
});
