# How to Run the Lens Attendance System

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**

---

## Backend (Terminal 1)

```bash
# From project root
source venv/bin/activate
pip3 install -r backend/requirements.txt

# Run from backend directory
cd backend
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
```

**OR if already in `backend/` directory:**

```bash
source ../venv/bin/activate
pip3 install -r requirements.txt
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Backend runs at **`http://localhost:8000`** (API docs at http://localhost:8000/docs)

The SQLite database (`backend/attendance.db`) is auto-created on first startup — no migration step needed.

---

## Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **`http://localhost:3000`**

---

## Deploy to Render (Free, No Credit Card)

### Backend

1. Push code to GitHub
2. Go to [render.com](https://render.com) → Sign up with GitHub
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name:** `lens-attendance-backend`
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Python Version:** `3.11.8`
6. Click **Create Web Service**

### Database (Required for persistence)

1. In Render dashboard, click **New** → **PostgreSQL**
2. Configure:
   - **Name:** `lens-attendance-db`
   - **Database:** `lens_attendance`
   - **Plan:** Free
3. Click **Create Database**
4. Copy the **Internal Database URL**
5. Go to your Web Service → **Environment** → Add:
   - **Key:** `DATABASE_URL`
   - **Value:** (paste the Internal Database URL)

Or use `render.yaml` (auto-provisions everything):
```bash
# From project root
render deploy
```

### Frontend (Optional - for production)

1. In Render, click **New** → **Static Site**
2. Connect your repo
3. Configure:
   - **Name:** `lens-attendance-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/.next`
4. Add env var: `NEXT_PUBLIC_API_URL` = your backend URL
5. Update `frontend/next.config.ts` to use the deployed backend URL

---

## Deploy to Railway (Trial - No Credit Card Required)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Init project
railway init

# Add Python service
railway add

# Deploy
railway up
```

Railway trial: $5 credit for 30 days, no credit card needed.

---

## Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (from backend directory)
fly launch

# Deploy
fly deploy
```

---

## How It Works

| Page | Role | Description |
|------|------|-------------|
| `/` | Public | Marketing landing page |
| `/dashboard` | Admin/Lecturer | Overview stats and shortcuts |
| `/enroll` | Admin | Register students with photos |
| `/students` | Admin | Manage student directory |
| `/attendance` | Lecturer | Upload class photo → detect faces → confirm |
| `/history` | Lecturer | Past attendance sessions |
| `/integrations` | Admin | Configure Canvas, Banner, or webhook sync |

Switch between **Admin** and **Lecturer** roles using the toggle in the sidebar.

---

## Notes

- No `.env` files needed — all config is hardcoded for local dev.
- No real auth — role switching is client-side via localStorage.
- On macOS zsh, use `pip3` and `python3` to avoid autocorrect prompts.
- For production, swap SQLite for PostgreSQL (Render/Railway provide managed PostgreSQL).

---

## Quick Run (Both at Once)

```bash
# Terminal 1 - Backend (from project root)
source venv/bin/activate && pip3 install -r backend/requirements.txt && cd backend && python3 -m uvicorn main:app --host 127.0.0.1 --port 8000

# Terminal 1 - Backend (if already in backend/ directory)
source ../venv/bin/activate && pip3 install -r requirements.txt && python3 -m uvicorn main:app --host 127.0.0.1 --port 8000

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

The system will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
