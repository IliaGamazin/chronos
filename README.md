# How to Run

## Development Mode

Start services individually for development:

### 1. Start MongoDB
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### 2. Start Backend API
Open a new terminal:
```bash
cd api && npm start
```

### 3. Start Frontend App
Open another terminal:
```bash
cd app && npm run dev
```

---

## Production Mode

Start all services together using Docker:
```bash
docker compose up -d --build
```

> **Note:** For routine restarts, the `--build` flag can be omitted.