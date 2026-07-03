# Monday

> Stop negotiating with your future self.

Monday is a full-stack task commitment app built around a behavioural insight: people perpetually defer goals to their future self. The app converts intentions into trackable commitments with a calendar, category board, and reminder system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (access + refresh tokens), bcrypt |
| Styling | CSS Modules, custom design system |

---

## Features

- **Month Calendar** — tasks pinned to dates, click any day to see commitments
- **Board View** — sticky-note kanban grouped by task category
- **List View** — filtered task lists per category
- **Authentication** — secure JWT auth with silent token refresh
- **Reminders** — per-task reminder toggle
- **Repeat schedules** — daily, weekday, weekend, specific days

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/monday.git
cd monday
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secrets
```

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Set up the frontend

```bash
cd ../frontend
npm install
```

### 5. Run both servers

Backend (port 3001):
```bash
cd backend
npm run dev
```

Frontend (port 5173):
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

---

## Project Structure

```
monday/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seeds task types
│   └── src/
│       ├── controllers/     # HTTP request handlers
│       ├── services/        # Business logic
│       ├── routes/          # API route definitions
│       ├── middleware/       # Auth guard
│       └── utils/           # JWT, Prisma client
│
└── frontend/
    └── src/
        ├── api/             # Axios client + typed API functions
        ├── components/      # UI primitives, layout, calendar, board
        ├── contexts/        # AuthContext, ToastContext
        ├── hooks/           # useMonthCalendar, useBoardData, useTasks
        ├── pages/           # Landing, Auth, Dashboard, Settings
        └── types/           # Shared TypeScript interfaces
```

---

## Environment Variables

Copy `.env.example` to `.env` in the backend folder and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `FRONTEND_URL` | Frontend origin for CORS |

---

## Screenshots

*Coming soon*

---

## Author

Built by Arshia Aggarwal
(https://github.com/arshiaaggarwal07)