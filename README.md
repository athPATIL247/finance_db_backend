# Finance Dashboard Backend

A production-grade backend for a finance dashboard system with role-based access control, built by **Atharva Patil** for the Zorvyn internship assignment.

## Tech Stack
- **Runtime:** Node.js (ESM – `"type": "module"`)
- **Framework:** Express.js
- **Database:** PostgreSQL + Sequelize ORM
- **Auth:** JWT (access + refresh tokens)
- **Docs:** Swagger (OpenAPI 3.0)
- **Security:** bcryptjs, CORS, express-rate-limit

## Folder Structure
```
├── config/         # DB, Swagger, constants
├── controllers/    # Route handlers
├── middleware/     # Auth, validation, error handling
├── models/         # Sequelize models + associations
├── routes/         # Express routers with Swagger JSDoc
├── services/       # Business logic layer
├── utils/          # JWT, audit logger, pagination, seeder
├── validators/     # express-validator chains
├── app.js          # Express app setup
└── server.js       # Entry point
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your PostgreSQL credentials and JWT secrets
```

### 3. Create database
```sql
CREATE DATABASE finance_dashboard;
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Start the server
```bash
npm run dev     # development (nodemon)
npm start       # production
```

## API Docs
Visit `http://localhost:5000/api/docs` for full Swagger UI.

## Why this project fits the Zorvyn assignment
- Implements role-based access control with `viewer`, `analyst`, and `admin` roles.
- Supports full financial record CRUD with filtering, search, pagination, and soft delete.
- Provides dashboard analytics: total income, total expenses, net balance, category totals, monthly/weekly trends, and recent activity.
- Enforces backend validation, meaningful error responses, and auth-level restrictions in middleware.
- Uses PostgreSQL persistence with Sequelize models and audit logging for key operations.
- Includes admin user management via `POST /api/users`, plus secure public registration as viewer.

## Test Credentials (after seeding)
| Role    | Email                          | Password     |
|---------|-------------------------------|--------------|
| Admin   | admin@finance.com              | password123  |
| Analyst | analyst@finance.com            | password123  |
| Viewer  | viewer@finance.com             | password123  |

## Roles & Permissions
| Endpoint                    | Viewer | Analyst | Admin |
|----------------------------|--------|---------|-------|
| GET /records               | own    | own     | all   |
| POST /records              | no     | yes     | yes   |
| PATCH /records/:id         | no     | own     | all   |
| DELETE /records/:id        | no     | no      | yes   |
| GET /dashboard/summary     | yes    | yes     | yes   |
| GET /dashboard/categories  | no     | yes     | yes   |
| GET /dashboard/trends/*    | no     | yes     | yes   |
| GET /dashboard/recent      | no     | yes     | yes   |
| POST /users                | no     | no      | yes   |
| GET /users                 | no     | no      | yes   |
| GET /audit                 | no     | no      | yes   |

## Assumptions
1. Viewers can see only their own records and the basic summary dashboard.
2. Analysts can create and update records (their own) and access all analytics.
3. Soft-deleted users are excluded from all queries (`deleted_at IS NULL`).
4. Refresh tokens are stateless — for production, add a token blacklist.

## API Endpoints Summary
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me

POST   /api/users
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id

POST   /api/records
GET    /api/records
GET    /api/records/:id
PATCH  /api/records/:id
DELETE /api/records/:id

GET    /api/dashboard/summary
GET    /api/dashboard/categories
GET    /api/dashboard/trends/monthly?year=2025
GET    /api/dashboard/trends/weekly
GET    /api/dashboard/recent?limit=10

GET    /api/audit

GET    /api/health
GET    /api/docs
```

## Demo / Verification Guide
Use these sample requests after starting the server and seeding the database.

1. Login as admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@finance.com","password":"password123"}'
```

2. Get dashboard summary
```bash
curl http://localhost:5000/api/dashboard/summary \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

3. Create a new financial record (admin or analyst)
```bash
curl -X POST http://localhost:5000/api/records \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"amount":2500,"type":"income","category":"freelance","date":"2026-04-01","notes":"Project payout"}'
```

4. Filter records by category or date
```bash
curl "http://localhost:5000/api/records?category=freelance&date_from=2026-04-01&date_to=2026-04-30" \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

5. Create a new user as admin
```bash
curl -X POST http://localhost:5000/api/users \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"name":"New Analyst","email":"newanalyst@finance.com","password":"password123","role":"analyst"}'
```

6. Inspect audit logs (admin only)
```bash
curl http://localhost:5000/api/audit \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```
