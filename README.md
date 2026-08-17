# LinkDiet

> Short links. Less clutter.

A modern, production-quality URL shortener built with Next.js, Express, TypeScript, and Supabase.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, TypeScript
- **Database:** Supabase PostgreSQL
- **Validation:** Zod

## Project Structure

```
linkdiet/
├── frontend/    # Next.js application
├── backend/     # Express REST API
└── supabase/    # Database migrations (Phase 2+)
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API will be available at `http://localhost:5000`.

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## License

MIT
