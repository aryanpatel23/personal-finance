# FinanceAI – Personal Finance Application

A modern personal finance app with AI-powered insights, dark purple UI, and full-stack architecture.

**Live Demo:** https://personal-finance-six-rho.vercel.app

## Features

- 🔐 **User Authentication** – Register/login with JWT and bcrypt password hashing
- 📊 **Dashboard** – Metrics overview, spending chart, and AI insights
- 💳 **Transactions** – Add, filter, and delete income/expense records
- 💰 **Budgets** – Create category budgets with progress tracking
- 📈 **Income Tracking** – Log income sources with frequency support
- 📉 **Analytics** – Monthly trends, category breakdown, savings charts
- 🤖 **Gemini AI** – Financial health score and personalized insights

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v7, Recharts, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt
- **AI:** Google Gemini 1.5 Flash API

## Project Structure

```
personal-finance/
├── src/                  # Frontend source (React/Vite)
│   ├── components/       # Shared components (AppLayout)
│   ├── context/          # AuthContext
│   ├── pages/            # Route pages (Dashboard, Transactions, etc.)
│   ├── utils/            # Axios API helper
│   └── App.jsx           # Routing + auth guards
├── backend/              # Node.js/Express backend
│   ├── controllers/      # Route handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── middleware/        # JWT auth middleware
│   ├── config/           # DB connection
│   └── server.js         # Entry point
├── .env.example          # Environment variable template
└── package.json          # Frontend dependencies
```

## Getting Started

### Frontend
```bash
npm install
cp .env.example .env.local   # set VITE_API_URL
npm run dev
```

### Backend
```bash
cd backend
npm install
cp ../.env.example .env      # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

### Environment Variables

Copy `.env.example` and fill in:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Random secret for JWT signing |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `VITE_API_URL` | Backend URL for the frontend |

The app works with demo data when the backend is not connected.

## Deployment

- **Frontend:** Vercel (auto-detects Vite)
- **Backend:** Render or Railway (set environment variables in dashboard)

