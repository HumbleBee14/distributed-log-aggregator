# Distributed Log Aggregator

A scalable, efficient service for collecting and querying logs from different microservices in real-time.

## Overview

This distributed log aggregation service provides a RESTful API for:
- Ingesting log entries from multiple services
- Querying logs by service name and time range
- Efficient storage with automatic expiration using Redis

This service is designed to be horizontally scalable and thread-safe (because of Async & Non-blocking I/O nature of Node.s which naturally handles many concurrent connections), making it suitable for high-throughput production environments.

## Architecture

- **Language**: Node.js with ES Modules
- **API Layer**: Express.js REST API
- **Storage**: Redis for in-memory storage with TTL support
- **Data Structure**: Redis sorted sets with timestamp scoring for efficient time-range queries

### Key Components

- **Redis Client**: Handles connection to Redis database (Note: I'm using Redis cloud instance, but we can use local instance also)
- **Log Service**: Core business logic for storing and retrieving logs
- **API Routes**: RESTful endpoints for log operations
- **Config**: Environment-based configuration

## Requirements

- Node.js 14+
- Redis 4.7+ (or Redis Cloud account)

## Setup

1. **Clone the repository**:
   ```
   git clone https://github.com/HumbleBee14/distributed-log-aggregator.git
   cd distributed-log-aggregator
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file with:
   ```
   PORT=3000
   REDIS_USERNAME=default
   REDIS_PASSWORD=your-redis-password
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
   LOG_EXPIRY_SECONDS=3600
   ```

4. **Start the service**:
   ```
   npm start
   ```

## API Endpoints

### Log Ingestion
```
POST /logs
```
Request body:
```json
{
  "service_name": "auth-service",
  "timestamp": "2025-03-17T10:15:00Z",
  "message": "User login successful"
}
```

### Log Query
```
GET /logs?service=<service_name>&start=<timestamp>&end=<timestamp>
```
Example:
```
GET /logs?service=auth-service&start=2025-03-17T10:00:00Z&end=2025-03-17T10:30:00Z
```
Note: If you don't pass start and end datetme, it'll fetch all the logs
## Performance Considerations

The implementation uses Redis transactions to ensure atomicity and efficiency of operations. Logs are automatically expired after the configured TTL (1 hour by default).

## Scaling

The service can be horizontally scaled by running multiple instances behind a load balancer. The Redis backend can be configured as a cluster for additional scalability.