# API Specification (Version 1.0)
**Project:** Gemma Compass  
**Protocol:** REST API  
**Data Format:** JSON  
**Authentication:** JWT  

## 1. API Design Philosophy
Every endpoint belongs to a platform capability: Identity, Knowledge, Learning, Assessment, Navigation, Progress, System. This mirrors the AKN architecture.

## 2. API Modules

**Module 1 — Authentication API**
- `POST /auth/register` (Create account)
- `POST /auth/login` (Login)
- `POST /auth/logout` (Logout)
- `GET /auth/me` (Current user)

**Module 2 — User API**
- `GET /users/profile`
- `PUT /users/profile`
- `PUT /users/preferences` (Language, education level)

**Module 3 — Document API**
- `POST /documents/upload`
- `GET /documents`
- `GET /documents/{id}`
- `POST /documents/{id}/extract`
- `POST /documents/{id}/analyze` (Triggers Navigation Engine)

**Module 4 — Knowledge API**
- `GET /knowledge/map` (Concepts, relationships, progress)
- `GET /knowledge/concepts`
- `GET /knowledge/concepts/{id}`
- `GET /knowledge/gaps`
- `POST /knowledge/discover` (Starts Adaptive Knowledge Navigation)

**Module 5 — Learning API**
- `POST /learning/goals`
- `GET /learning/goals`
- `POST /learning/roadmap`
- `GET /learning/study-plan`
- `GET /learning/next`

**Module 6 — Quiz API**
- `POST /quiz/generate`
- `POST /quiz/submit`
- `GET /quiz/history`
- `GET /quiz/weak-areas`

**Module 7 — Progress API**
- `GET /progress`
- `GET /progress/mastery`
- `GET /progress/timeline`

**Module 8 — Recommendation API**
- `GET /recommendations`
- `POST /recommendations/regenerate`

**Module 9 — System API**
- `GET /system/status`
- `GET /system/models`

## 3. Adaptive Knowledge Navigation API Flow
`POST /documents/upload` → `POST /documents/{id}/analyze` → `POST /knowledge/discover` → `GET /knowledge/map` → `POST /quiz/generate` → `POST /quiz/submit` → `GET /progress` → `GET /recommendations`

## 4. Standard API Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "meta": {
    "request_id": "uuid",
    "timestamp": "ISO8601"
  }
}
```
Errors return `success: false` with an `error.code`.

## 5. Security & Versioning
- JWT authentication with Role-based access.
- API is versioned at `/api/v1/...`
