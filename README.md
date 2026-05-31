# LibMgmt — Library Management System

A full-stack library management system with a REST API backend, a React dashboard for tracking book issuances, and a MySQL database — all containerized with Docker. I built this to handle the core workflows a librarian actually needs: managing members, tracking which books are out, and seeing at a glance what's overdue.

## Tech Stack

- **Database**: MySQL 8.0
- **Backend**: Node.js + Express (REST API)
- **Frontend**: React 18 (Vite) with plain CSS
- **Containerization**: Docker + Docker Compose

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) (comes bundled with Docker Desktop)

### Setup

1. **Clone the repo**

   ```bash
   git clone <your-repo-url>
   cd library-management
   ```

2. **Start everything**

   ```bash
   docker compose up --build
   ```

   This spins up three containers:
   - `libmgmt-db` — MySQL 8 database (seeded with sample data)
   - `libmgmt-api` — Express backend API
   - `libmgmt-frontend` — React dashboard served via nginx

3. **Wait for all containers to be healthy**

   The backend has a retry loop that waits for MySQL to be ready, so give it 15–30 seconds on first run. You'll see `✅ MySQL connected` and `🚀 LibMgmt API running on port 3000` in the logs when it's ready.

4. **Access the app**

   | Service    | URL                        |
   |------------|----------------------------|
   | API        | http://localhost:3000       |
   | Dashboard  | http://localhost:5173       |
   | Health     | http://localhost:3000/health |

## API Reference

All endpoints (except `/health`) require the `x-api-key` header.

### Members

| Method | Path           | Description                                |
|--------|----------------|--------------------------------------------|
| GET    | /member        | List all members with membership status    |
| GET    | /member/:id    | Get member details + issuance history      |
| POST   | /member        | Create new member (auto-creates membership)|
| PUT    | /member/:id    | Update member details                      |

### Books

| Method | Path           | Description                                |
|--------|----------------|--------------------------------------------|
| GET    | /book          | List all books with category & collection  |
| GET    | /book/:id      | Get book details + issuance count          |
| POST   | /book          | Add a new book                             |
| PUT    | /book/:id      | Update book details                        |

### Issuances

| Method | Path                    | Description                         |
|--------|-------------------------|-------------------------------------|
| GET    | /issuance               | List all issuances                  |
| GET    | /issuance/pending/today | All pending issuances (dashboard)   |
| GET    | /issuance/:id           | Get single issuance details         |
| POST   | /issuance               | Create new issuance                 |
| PUT    | /issuance/:id           | Update issuance (e.g., mark returned)|

### Other

| Method | Path    | Description          |
|--------|---------|----------------------|
| GET    | /health | Health check (no auth)|

## Authentication

All API requests (except `GET /health`) require the `x-api-key` header:

```bash
curl -H "x-api-key: libmgmt-secret-key-2024" http://localhost:3000/book
```

Without the header, you'll get:

```json
{ "error": "Unauthorized: invalid or missing API key" }
```

The default key is `libmgmt-secret-key-2024` — change it in the `.env` file for production.

## SQL Queries

The `sql/queries.sql` file contains three useful analytical queries:

1. **Books never borrowed** — finds books that have never been issued
2. **Outstanding books** — all currently pending issuances ordered by due date
3. **Top 10 most borrowed** — books ranked by borrow count with unique member counts

You can run these directly against the database:

```bash
docker exec -i libmgmt-db mysql -ulibuser -plibpass123 libmgmt < sql/queries.sql
```

## Project Structure

```
library-management/
├── docker-compose.yml
├── .env
├── README.md
├── db/
│   ├── schema.sql              # Database schema (6 tables)
│   └── seed.sql                # Sample data (12 members, 25 books, 20 issuances)
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js               # Express entry point
│   ├── db.js                   # MySQL connection pool with retry
│   ├── middleware/
│   │   └── auth.js             # API key authentication
│   └── routes/
│       ├── member.js           # Member CRUD
│       ├── book.js             # Book CRUD
│       └── issuance.js         # Issuance CRUD + pending endpoint
├── frontend/
│   ├── Dockerfile              # Multi-stage build (Vite → nginx)
│   ├── nginx.conf              # SPA routing config
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # App shell with nav
│       ├── api.js              # API fetch wrapper
│       └── components/
│           └── Dashboard.jsx   # Pending returns dashboard
└── sql/
    └── queries.sql             # Analytical SQL queries
```

## AI Assistance Note

Parts of this project were built with AI assistance (Claude). The database schema, API structure, SQL queries, and Docker configuration were all reviewed, understood, and adjusted by me. The AI was used as a productivity tool, similar to using documentation or Stack Overflow.
