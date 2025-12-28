# Hirfa API - Complete Usage Guide

Welcome to **Hirfa** - Tunisia's Decentralized Service Network! This guide will walk you through every feature of the API.

---

## 📚 Table of Contents

1. [Getting Started](#1-getting-started)
2. [Authentication](#2-authentication)
3. [Jobs & Matching](#3-jobs--matching)
4. [Geo-Location](#4-geo-location)
5. [Real-time Chat](#5-real-time-chat)
6. [Reviews](#6-reviews)
7. [Community Stories](#7-community-stories)
8. [API Documentation](#8-api-documentation)
9. [Error Handling](#9-error-handling)
10. [Deployment](#10-deployment)

---

## 1. Getting Started

### Prerequisites
- **Java 21** or higher
- **Maven 3.8+** or use the included wrapper
- **Docker** (optional, for PostgreSQL)

### Quick Start (Development Mode)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The app will start on `http://localhost:8080` with an **H2 in-memory database**.

### Production Mode (PostgreSQL)
```bash
# Start the database
docker-compose up -d

# Run the app
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Access Points
| Resource | URL |
|:---------|:----|
| API Base | `http://localhost:8080/api/v1` |
| Swagger UI | `http://localhost:8080/docs` |
| OpenAPI JSON | `http://localhost:8080/docs/api` |
| Health Check | `http://localhost:8080/actuator/health` |
| H2 Console (dev) | `http://localhost:8080/h2-console` |

---

## 2. Authentication

Hirfa uses **JWT (JSON Web Token)** authentication. All protected endpoints require a valid token in the `Authorization` header.

### 2.1 Register a New User

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "fullName": "Ahmed Ben Ali",
  "phoneNumber": "55123456",
  "role": "PROVIDER"
}
```

**Roles:**
- `CUSTOMER` - Someone looking to hire services
- `PROVIDER` - A skilled worker offering services
- `ADMIN` - Platform administrator

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.2 Login (Authenticate)

**Endpoint:** `POST /api/v1/auth/authenticate`

**Request Body:**
```json
{
  "phoneNumber": "55123456"
}
```

**Response:** Same as registration - returns a JWT token.

### 2.3 Using the Token

Include the token in all subsequent requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3. Jobs & Matching

The core of Hirfa - connecting customers with service providers.

### 3.1 Create a Job (Customer)

**Endpoint:** `POST /api/v1/jobs`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Fix Bathroom Plumbing",
  "description": "The sink is leaking and needs repair. Available any day this week.",
  "budget": 150.00,
  "latitude": 36.8065,
  "longitude": 10.1815
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "id": 1,
    "title": "Fix Bathroom Plumbing",
    "status": "OPEN",
    "budget": 150.00
  }
}
```

### 3.2 Place a Bid (Provider)

**Endpoint:** `POST /api/v1/jobs/{jobId}/bids`

**Request Body:**
```json
{
  "amount": 120.00,
  "message": "I'm a certified plumber with 5 years experience. Can come tomorrow!"
}
```

### 3.3 View Bids (Fair-Play Sorted)

**Endpoint:** `GET /api/v1/jobs/{jobId}/bids`

Returns bids sorted by the **Fair-Play Algorithm**:
- New workers (< 30 days) get a visibility boost
- High fairness scores are prioritized
- NOT purely price-based!

### 3.4 Job Statuses
| Status | Description |
|:-------|:------------|
| `OPEN` | Accepting bids |
| `IN_PROGRESS` | Bid accepted, work ongoing |
| `COMPLETED` | Work finished |
| `CANCELLED` | Job cancelled |

---

## 4. Geo-Location

Find nearby service providers with PostGIS-powered spatial queries.

### 4.1 Update Provider Location

**Endpoint:** `POST /api/v1/geo/update`

**Request Body:**
```json
{
  "latitude": 36.8065,
  "longitude": 10.1815
}
```

### 4.2 Find Nearby Providers

**Endpoint:** `GET /api/v1/geo/nearby?lat=36.8065&lon=10.1815&radius=5000`

**Parameters:**
- `lat` - Latitude of search center
- `lon` - Longitude of search center
- `radius` - Search radius in meters (default: 5000)

---

## 5. Real-time Chat

Chat between customers and providers for a specific job.

### 5.1 REST API

**Send Message:**
```
POST /api/v1/chat/send
```
```json
{
  "senderId": 1,
  "receiverId": 2,
  "jobId": 1,
  "content": "Hello! When can you come?"
}
```

**Get Chat History:**
```
GET /api/v1/chat/history/{jobId}
```

### 5.2 WebSocket (Real-time)

**Connect to:** `ws://localhost:8080/ws-hirfa`

**Subscribe to job channel:**
```javascript
stompClient.subscribe('/topic/job.1', function(message) {
    console.log('New message:', JSON.parse(message.body));
});
```

**Send message:**
```javascript
stompClient.send('/app/chat.send', {}, JSON.stringify({
    senderId: 1,
    receiverId: 2,
    jobId: 1,
    content: 'Hello!'
}));
```

---

## 6. Reviews

Photo-verified reviews to build trust.

### 6.1 Create a Review

**Endpoint:** `POST /api/v1/reviews`

**Request Body:**
```json
{
  "jobId": 1,
  "rating": 5,
  "comment": "Excellent work! Fixed the issue quickly.",
  "photoUrl": "https://storage.hirfa.tn/reviews/photo123.jpg"
}
```

**Rating Scale:** 1 (Poor) to 5 (Excellent)

---

## 7. Community Stories

24-hour stories for workers to showcase their skills.

### 7.1 Post a Story

**Endpoint:** `POST /api/v1/community/stories`

**Request Body:**
```json
{
  "mediaUrl": "https://storage.hirfa.tn/stories/video123.mp4",
  "caption": "Just finished this beautiful kitchen renovation! 🔨"
}
```

### 7.2 Get Community Feed

**Endpoint:** `GET /api/v1/community/feed`

Returns the last 24 hours of stories from all providers.

---

## 8. API Documentation

### Interactive Docs (Swagger UI)
Open your browser to:
```
http://localhost:8080/docs
```

Features:
- Browse all endpoints
- Try requests directly
- See request/response schemas
- JWT authentication built-in

### OpenAPI Specification
Get the raw OpenAPI JSON:
```
http://localhost:8080/docs/api
```

---

## 9. Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Resource not found with id: 123",
  "data": null
}
```

### HTTP Status Codes
| Code | Meaning |
|:-----|:--------|
| 200 | Success |
| 400 | Bad Request (validation failed) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "phoneNumber": "Invalid Tunisian phone number (8 digits)",
    "fullName": "Name must be between 2 and 100 characters"
  }
}
```

---

## 10. Deployment

### Environment Variables
```bash
# Required for Production
JWT_SECRET=your_256_bit_base64_encoded_secret
SPRING_PROFILES_ACTIVE=prod

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hirfa
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password
```

### Docker Build
```bash
docker build -t hirfa-backend .
docker run -p 8080:8080 \
  -e JWT_SECRET=your_secret \
  -e SPRING_PROFILES_ACTIVE=prod \
  hirfa-backend
```

### Health Checks
- **Liveness:** `GET /actuator/health`
- **Metrics:** `GET /actuator/metrics`

---

## 🇹🇳 Made in Tunisia, for Tunisia

Hirfa - Where every skill matters.

*Support: support@hirfa.tn*
