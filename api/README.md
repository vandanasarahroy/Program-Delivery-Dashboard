# People Authority Build — Live API Backend

A lightweight Node.js + SQLite REST API that powers the People Authority Build 2026 Dashboard with live, collaborative data.

---

## Quick Start (GitHub Codespaces)

1. Push this folder to a GitHub repo
2. Click **Code → Codespaces → Create codespace on main**
3. Codespaces will automatically:
   - Install Node.js dependencies (`npm install`)
   - Start the server (`npm start`)
   - Forward port 3000 publicly
4. Copy the public Codespaces URL (e.g. `https://xyz-3000.app.github.dev`)
5. Paste that URL into the dashboard's API endpoint setting

---

## API Endpoints

### Health
```
GET /api/health
```

### Iterations
```
GET  /api/iterations          — list all iterations
PUT  /api/iterations/:id      — update iteration label/status
```

### Milestones
```
GET    /api/milestones?iteration=jun23   — get all for an iteration
GET    /api/milestones/:id               — get single milestone
POST   /api/milestones                   — create new milestone
PUT    /api/milestones/:id               — update milestone
DELETE /api/milestones/:id               — delete milestone
POST   /api/milestones/bulk              — bulk import (replace iteration)
```

### POST /api/milestones body
```json
{
  "name": "Basis Person Authority Build Up",
  "section": "Person Authority Build",
  "iteration": "jun23",
  "health": "Green",
  "status": "In Progress",
  "team": "NER",
  "owner": "Krishanu Bhattacharya",
  "current_state": "CCH and EQCH runs completed...",
  "risks_issues": "BAHR workflow under investigation...",
  "next_steps": "NER working with Labs to fix...",
  "business_impact": "Not at the moment",
  "link": ""
}
```

---

## Database

SQLite file stored at `data/dashboard.db`. Auto-created on first run. Persists across Codespace restarts as long as the Codespace is not deleted.

---

## Environment Variables

Create a `.env` file (optional):
```
PORT=3000
```

---

## Local Development

```bash
npm install
npm start
# API runs at http://localhost:3000
```
