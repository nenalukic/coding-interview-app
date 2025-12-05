# Coding Interview App

Real-time collaborative coding interview platform.

## Features
- Real-time code editing (JS/Python)
- Shared execution environment
- Client-side code execution using Web Workers (JS) and Pyodide (Python)

## Setup

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Run locally (dev mode):
   ```bash
   npm run dev
   ```
   This starts both the server and client concurrently using concurrently.
   
   Server: http://localhost:3000
   Client: http://localhost:5173

3. Build and Run via Docker:
   ```bash
   docker build -t coding-interview-app .
   docker run -p 3000:3000 coding-interview-app
   ```

## Deployment

### Deploy to Render
For production deployment to Render, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.

Quick deploy:
1. Push to GitHub
2. Connect repository to Render dashboard
3. Render automatically detects `render.yaml` configuration
4. Deployment completes in ~2-3 minutes

## Testing

Run all integration tests locally:
```bash
npm run dev & sleep 3 && node test_integration.js && kill %1
```

Or manually:
1. Start the app: `npm run dev`
2. In another terminal, run: `node test_integration.js`
