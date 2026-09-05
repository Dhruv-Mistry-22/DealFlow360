# DealFlow360

DealFlow360 is an intelligent, self-governing sales operations platform designed to handle complex B2B sales workflows.

## Problem Being Solved

Most simple sales tools handle basics well but fail in complex B2B scenarios (multi-level discount approvals, partial stock across warehouses, bundled subscriptions mixed with one-time hardware, and portal negotiation). DealFlow360 replaces static workflows with a dynamic deal engine that enforces pricing discipline, reacts to inventory in real-time, and provides an actionable AI co-pilot feed.

## Architecture

- **Frontend**: Next.js (TypeScript, React)
- **Backend API**: Python (FastAPI, REST)
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **AI/Logic**: Blended risk engines and deterministic rules, augmented by an AI co-pilot feed.

*Note: The basic UI currently implemented is intentionally temporary. The final polished UI will be implemented after end-to-end business logic is fully functional.*

## Technology Stack

- Next.js (App router)
- Tailwind CSS
- FastAPI
- PostgreSQL & Alembic
- Pytest

## Repository Structure

```
DealFlow360/
├── backend/          # FastAPI Python application
├── frontend/         # Next.js React application
├── docs/             # Documentation & Architecture decisions
├── scripts/          # Helper scripts
└── docker-compose.yml# (Future) Container orchestration
```

## Local Setup

### Environment Variables
Copy the `.env.example` file in the root and in the subdirectories to `.env` and fill in the required values.

### Database Setup
Ensure PostgreSQL is running locally and update the `DATABASE_URL` in `.env`.
Run migrations from the `backend/` directory:
```bash
alembic upgrade head
```

### Running Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate # (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
cd backend
pytest
```

## Current Implementation Status

- [x] Initial Architecture Foundation
- [ ] Database Schema & Migrations
- [ ] Backend API Core Logic
- [ ] Basic UI Connectivity
- [ ] Seed Data Generation

## Documentation Index
- [Architecture](docs/architecture/system-architecture.md)
- [Requirements Traceability](docs/requirements/requirements-traceability.md)
- [API Design](docs/api/api-design.md)
- [Database Schema](docs/database/schema.md)
