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
<img width="959" height="473" alt="landing page" src="https://github.com/user-attachments/assets/7f6c531a-a07f-483c-837d-14d3a5c38c95" />
<img width="956" height="467" alt="auth page" src="https://github.com/user-attachments/assets/912affa3-eca2-41e8-bb52-1be629b39acf" />
<img width="959" height="473" alt="auth page" src="https://github.com/user-attachments/assets/95d73ba7-1873-433a-af69-6422f2205fc7" />
<img width="956" height="472" alt="dashboard-calendar" src="https://github.com/user-attachments/assets/cc5fe3d0-6917-4ca6-9a05-4c7e3511f4d4" />
<img width="1731" height="1322" alt="dashboard-board" src="https://github.com/user-attachments/assets/83b646b0-0a31-4270-a380-8cc1aa76e327" />
<img width="955" height="470" alt="new task" src="https://github.com/user-attachments/assets/1cc6524b-b84a-4c0c-b7a9-5682dff2f7ab" />






*Coming soon*

---

## Author

Built by Arshia Aggarwal
(https://github.com/arshiaaggarwal07)
