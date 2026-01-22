# OrgoPivy

An organic chemistry workbench for students with tools for mechanisms, NMR spectra analysis, and note search/QA.

## Project Structure

- `web/` - Next.js frontend (React + TypeScript)
- `api/` - FastAPI backend (Python)
- `infra/` - Docker Compose configuration for PostgreSQL + pgvector

## Features

- **Mechanism Canvas** - Draw and visualize organic reaction mechanisms
- **NMR Studio** - Analyze NMR spectra
- **Search Notes** - Search through ingested text files
- **Upload and Ingest** - Upload files and create searchable chunks
- **Ask** - Q&A system that answers questions from ingested materials

## Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose (for PostgreSQL)

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

   The API will be available at `http://127.0.0.1:8000`
   API docs at `http://127.0.0.1:8000/docs`

### Frontend Setup

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Database (Optional)

If you want to use PostgreSQL with pgvector:

1. Start the database:
   ```bash
   cd infra
   docker-compose up -d
   ```

2. The database will be available at `localhost:5432`
   - User: `orgo`
   - Password: `orgo`
   - Database: `orgopivy`

## Development

- Backend API runs on port 8000
- Frontend runs on port 3000
- Make sure both are running for full functionality

## Environment Variables

The frontend uses `NEXT_PUBLIC_API_BASE` or `NEXT_PUBLIC_API_BASE_URL` to connect to the backend (defaults to `http://127.0.0.1:8000`).

## Storage

Uploaded files are stored in `api/storage/uploads/` and indexes in `api/storage/index/`. These directories are created automatically and are gitignored.
