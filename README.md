# Air Quality Monitoring System 🌍💨

A robust, event-driven, full-stack monorepo built with **Nx**, **NestJS**, **React**, **RabbitMQ**, and **PostgreSQL**.

This system actively monitors air quality, determines abnormal conditions through an automated pipeline, publishes events via message brokers, persists historical records, and provides a real-time analytics dashboard.

---

## 🏗 Architecture & Stack

This project is structured as an **Nx Monorepo** consisting of three primary applications:

1. **Data Collector (NestJS)**
   - Periodically polls telemetry/air quality data.
   - Evaluates severity using a functional programming pipeline.
   - Publishes type-safe `AirQualityAlertPayload` events to a **RabbitMQ Fanout Exchange**.

2. **Alert Processor (NestJS)**
   - Consumes critical alerts from RabbitMQ.
   - Persists telemetry data to **PostgreSQL** using **Prisma v7**.
   - Broadcasts live events to connected web clients via **WebSockets (Socket.IO)**.
   - Exposes REST API endpoints for fetching historical telemetry records.

3. **Dashboard (React + Vite)**
   - **Real-Time Stream**: Listens to WebSocket events to instantly display critical anomalies on screen with micro-animations.
   - **Historical Data**: Fetches and renders historical database records via REST endpoints.
   - **UI/UX**: Custom premium aesthetic built with CSS Modules / Vanilla CSS Custom Properties (Dark Slate Theme).

### Infrastructure Stack

- **Docker & Docker Compose**: Complete containerization of all services.
- **RabbitMQ**: AMQP Message Broker.
- **PostgreSQL**: Relational Database.
- **Nginx**: Serving the production React build.

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (v20+)
- npm

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <YOUR_GITHUB_URL>
cd air-quality-monitor
npm install
```

### 2. Running Locally (Development)

To run the full stack with hot-reloading in your local environment, you can individually start dependencies and applications using Nx:

**Spin up infrastructure (RabbitMQ & PostgreSQL):**

```bash
docker compose -f docker-compose-deps.yml up -d
```

**Run applications:**

```bash
# Terminal 1: Data Collector
npx nx serve data-collector

# Terminal 2: Alert Processor
npx nx serve alert-processor

# Terminal 3: Dashboard
npx nx serve dashboard
```

*The dashboard will be available at `http://localhost:4200`.*

### 3. Running via Docker Compose (Production Build)

To boot the entire stack (Infrastructure + Microservices + Nginx React Frontend) in containerized isolation:

```bash
docker compose up --build -d
```

| Service | Address | Description |
|---|---|---|
| **Dashboard** | `http://localhost:8080` | The React UI interface |
| **RabbitMQ Mgmt** | `http://localhost:15672` | RabbitMQ metrics (guest/guest) |
| **PostgreSQL** | `localhost:5500` | Database exposed port |
| **API Endpoints** | `http://localhost:3001` | Underlying REST API from Alert Processor |

---

## 🛠 Useful Nx Commands

- `npx nx build dashboard` - Build the React frontend.
- `npx nx build data-collector` - Build the collector service.
- `npx nx build alert-processor` - Build the processor service.
- `npx nx graph` - View the dependency graph of the monorepo.

---

## 🎨 UI/UX Design System

The React Dashboard utilizes a proprietary dark-themed design system characterized by:

- **Glassmorphism:** Semi-transparent cards with background blurs.
- **Data Status Indicators:** Pulsing indicator dots (Green/Red/Orange) reflecting simulated telemetry WebSocket connectivity.
- **Fluid Micro-interactions:** Smooth hover events, sliding list-item entrances, and button transforms.
- **Status Colors:** Semantic color scaling for metrics—Critical (Red), Warning (Orange), and Info (Blue/Green).
