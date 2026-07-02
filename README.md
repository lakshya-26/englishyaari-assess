# EnglishYaari Backend API

A REST API for a teacher-session booking platform built with Node.js, TypeScript, Express.js, MongoDB, and Mongoose.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express.js**
- **MongoDB** + **Mongoose**

## Prerequisites

- Node.js >= 18
- MongoDB running locally (or a MongoDB Atlas URI)

## Setup

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable    | Description                             | Default                                    |
|-------------|-----------------------------------------|--------------------------------------------|
| `PORT`      | Port the server listens on              | `3000`                                     |
| `MONGO_URI` | MongoDB connection string               | `mongodb://localhost:27017/englishyaari`   |

### 3. Run in development mode

```bash
npm run dev
```

### 4. Build and run in production

```bash
npm run build
npm start
```

---

## API Reference

All responses follow the shape:

```json
{ "success": true, "data": { ... } }
// or on error:
{ "success": false, "message": "..." }
```

### Teachers

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| POST   | `/teachers`   | Create a teacher   |

**POST /teachers** – body:
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "specialization": "Grammar",
  "experience": 5
}
```

---

### Users

| Method | Endpoint               | Description                   |
|--------|------------------------|-------------------------------|
| POST   | `/users`               | Create a user                 |
| GET    | `/users/:id/sessions`  | Get user's session history    |

**POST /users** – body:
```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

**GET /users/:id/sessions** – response:
```json
{
  "success": true,
  "data": {
    "upcomingSessions": [...],
    "completedSessions": [...]
  }
}
```

---

### Sessions

| Method | Endpoint                        | Description                         |
|--------|---------------------------------|-------------------------------------|
| POST   | `/sessions`                     | Create a session for a teacher      |
| GET    | `/sessions/available?dateTimestamp={ts}` | Get all available sessions for a date |
| POST   | `/sessions/:id/book`            | Book a session                      |
| PATCH  | `/sessions/:id/complete`        | Mark a session as completed         |

**POST /sessions** – body:
```json
{
  "teacherId": "<ObjectId>",
  "startTime": "2024-08-01T10:00:00.000Z",
  "endTime": "2024-08-01T11:00:00.000Z"
}
```

**GET /sessions/available** – query param `dateTimestamp` as Unix timestamp (ms or s):
```
GET /sessions/available?dateTimestamp=1722470400000
```

**POST /sessions/:id/book** – body:
```json
{ "userId": "<ObjectId>" }
```

**PATCH /sessions/:id/complete** – no body required.

---

## Project Structure

```
src/
├── config/
│   └── db.ts               # MongoDB connection
├── models/
│   ├── User.ts
│   ├── Teacher.ts
│   └── Session.ts
├── routes/
│   ├── user.routes.ts
│   ├── teacher.routes.ts
│   └── session.routes.ts
├── controllers/
│   ├── user.controller.ts
│   ├── teacher.controller.ts
│   └── session.controller.ts
├── services/
│   ├── user.service.ts
│   ├── teacher.service.ts
│   └── session.service.ts
├── helpers/
│   └── date.helper.ts      # Timestamp → day range utility
├── middlewares/
│   └── errorHandler.ts     # Centralized error handler
├── utils/
│   └── AppError.ts         # Custom error class
└── app.ts                  # Express entry point
```

## Postman Collection

Import `EnglishYaari.postman_collection.json` into Postman to test all endpoints.
Set the `baseUrl` collection variable to `http://localhost:3000`.
