
# Air Quality Monitoring Microservices

A robust, event-driven microservices architecture built with NestJS, RabbitMQ, PostgreSQL, and Prisma v7.

## 🏗 Architecture

This project consists of two isolated microservices communicating via an AMQP Fanout Exchange:

1. **Data Collector:** Periodically polls air quality APIs, evaluates criticality using a functional programming pipeline, and publishes type-safe `AirQualityAlertPayload` events to RabbitMQ.
2. **Alert Processor:** Consumes critical alerts from RabbitMQ and persists them to a PostgreSQL database using Prisma v7 Driver Adapters.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (v25+)

### Installation & Running

1. Clone the repository:
   ```bash
   git clone <YOUR_GITHUB_URL>
   cd <YOUR_REPO_NAME>
   ```
