# Бастау — Kazakh Language Learning Platform

A full-stack web application for learning the Kazakh language, inspired by Stepik.org and based on an 80-hour intensive textbook.

## Features
- 10 structured lessons with grammar, exercises, dialogue, and quiz tabs
- Progress tracking with streak system
- AI chat assistant powered by Claude API
- Statistics page with charts

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Anthropic API key

### Environment Variables

Copy `.env.example` to `.env` in the server directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/bastau
JWT_SECRET=your_jwt_secret_here
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
```

Copy `.env.example` to `.env` in the client directory:
```
VITE_API_URL=http://localhost:5000
```

### Installation

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### Database

```bash
npx prisma migrate dev --schema=./prisma/schema.prisma
npx ts-node ./prisma/seed.ts
```

### Running

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000
