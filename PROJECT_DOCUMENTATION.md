# Hirfa - The Decentralized Service Network (Project Documentation)

## 1. Executive Summary
**Hirfa** is a mission-driven platform designed to democratize the gig economy in Tunisia. Unlike traditional freelancing platforms that charge high fees and favor established players, Hirfa prioritizes **fairness**, **zero-barrier entry**, and **community**. 

### The "Fair-Play" Promise
- **Zero-Fee Launch**: 100% earnings go to the provider for the first year.
- **Anti-Bias Algo**: New workers get a visibility boost to level the playing field.
- **Hyper-Local**: Focused on neighborhood-level trust and economy.

---

## 2. System Architecture
The backend uses a **Modular Monolith** architecture. This offers the simplicity of a single deployment unit while maintaining clear boundaries between domains, allowing for easy extraction into Microservices in the future.

### Core Modules
| Module | Package | Purpose |
| :--- | :--- | :--- |
| **Auth** | `com.kawn.hirfa.auth` | Identity, Security, JWT Token management. |
| **Geo** | `com.kawn.hirfa.geo` | Spatial queries using PostGIS to find nearby providers. |
| **Match** | `com.kawn.hirfa.match` | The "Brain": Job creation, Bidding, and Matching logic. |
| **Chat** | `com.kawn.hirfa.chat` | Real-time communication via WebSockets. |
| **Review** | `com.kawn.hirfa.review` | Trust layer with photo-verified reviews. |
| **Community** | `com.kawn.hirfa.community` | Engagement layer (Stories/Feeds). |

---

## 3. Technology Stack

### Backend Core
- **Java 21**: The latest LTS version, utilizing Records and Virtual Threads integration potential.
- **Spring Boot 3.3.6**: The framework backbone.
- **Spring Security**: Stateless JWT (JSON Web Token) authentication.
- **Spring Data JPA**: Abstraction over Hibernate for database interactions.

### Database & Spatial
- **PostgreSQL**: Primary relational database.
- **PostGIS**: Spatial extension for handling Geometry types (`Point`) and radius queries (`ST_DWithin`).
- **H2 Database**: In-memory database for rapid development and testing.

### Real-Time & API
- **WebSockets (STOMP)**: For instant chat messaging.
- **OpenAPI / Swagger**: Auto-generated API documentation.

### DevOps
- **Docker**: Multi-stage build (Alpine Linux) for minimal image size.
- **Docker Compose**: Orchestration for local Database (PostGIS).

---

## 4. Detailed Module Analysis

### 4.1 Authentication & Security (`hirfa-auth`)
- **Flow**: Phone Number -> Verified -> JWT Token.
- **Security Chain**: 
    - Stateless Session Policy.
    - `JwtAuthenticationFilter` intercepts every request.
    - Public endpoints: `/api/v1/auth/**`.
- **Entities**: 
    - `User`: Contains `UserRole` (CUSTOMER, PROVIDER), `FairnessScore`, and `Badges`.

### 4.2 Geo-Location Service (`hirfa-geo`)
- **Key Feature**: The "Heatmap" and "Nearby Search".
- **Implementation**:
    - Stores Location as a `Point` (Geometry) with SRID 4326 (GPS coords).
    - **Query**: "Find 'Plumbers' within 5000 meters of (X, Y)".
    - **Optimized**: Uses native PostGIS indexing for speed.

### 4.3 The Match Engine (`hirfa-match`)
- **Workflow**:
    1. Customer Posts Job (`OPEN`).
    2. Providers Place Bids.
    3. **Fair-Play Logic**: The list of bids is NOT sorted just by price. It boosts:
        - New providers (< 30 days active).
        - Providers with high `FairnessScore`.
    4. Customer Accepts Bid -> Job becomes `IN_PROGRESS`.
- **Entities**: `Job`, `Bid`, `JobStatus`.

### 4.4 Real-Time Chat (`hirfa-chat`)
- **Protocol**: STOMP over WebSockets.
- **Endpoints**:
    - `/ws-hirfa`: Handshake endpoint.
    - `/topic/job.{id}`: Public channel for a specific job context.
    - `/app/chat`: Sending messages.
- **Persistence**: Messages are saved to DB for history (offline support).

### 4.5 Community & Addiction (`hirfa-community`)
- **Stories**: Workers can post 24-hour media clips of their work.
- **Feed**: Aggregates stories to keep customers engaged and exploring local talent.

---

## 5. Configuration & DevOps

### Profiles
The application uses YAML-based configuration with Spring Profiles:
- **`dev`** (Default):
    - DB: **H2 In-Memory**.
    - Pros: No setup required, just run. fast.
    - Cons: Data lost on restart.
- **`prod`**:
    - DB: **PostgreSQL**.
    - Logic: Connects to `localhost:5432` (or container link).
    - Spatial: Enables full PostGIS dialect.

### Running the App
**1. Development (Instant Start)**
```bash
./mvnw spring-boot:run
```
*Access H2 Console: `http://localhost:8080/h2-console`*

**2. Production / Docker**
First, start the database:
```bash
docker-compose up -d
```
Then run the app:
```bash
./mvnw spring-boot:run -Dspring.profiles.active=prod
```

**3. Build Docker Image**
```bash
docker build -t hirfa-backend .
docker run -p 8080:8080 hirfa-backend
```

---

## 6. API Documentation
Once the application is running, the **Swagger UI** is available at:
> **http://localhost:8080/swagger-ui.html**

This interface allows you to:
- Visualize all endpoints.
- Test requests (Auth, Geo, Jobs) interactively.
- See the JSON schema for Requests/Responses.

---

## 7. Future Roadmap
- **Payment Integration**: Integrate Flouci / Konnect for secure payouts.
- **AI Matching**: Replace heuristic Fair-Play algorithm with ML model.
- **Mobile App**: Flutter frontend consuming these APIs.

---
*Generated by Antigravity for Hirfa Project.*
