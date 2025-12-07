# Coding Interview App

Real-time collaborative coding interview platform built with React, Express, Socket.io, and CodeMirror.

## Features
- 🔄 **Real-time Code Sync** - Changes instantly broadcast to all participants
- 💻 **Multi-Language Support** - JavaScript and Python with syntax highlighting
- ▶️ **Live Code Execution** - Run code directly in the browser with instant output
- 📊 **Shared Output** - All participants see execution results in real-time
- 🎨 **Professional Editor** - CodeMirror with VS Code Dark theme
- 👥 **Collaborative Sessions** - Share unique room links with candidates
- 📦 **Production Ready** - Deployed on Render with Docker support

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, CodeMirror
- **Backend**: Express.js, Socket.io, Node.js
- **Execution**: Web Workers (JavaScript), Pyodide (Python)
- **Deployment**: Docker, Render

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Local Development

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure environment (optional):**
   - Client uses `.env.development` for local development
   - Defaults to `http://localhost:3000` for API/Socket connections
   - No additional setup needed if running server on port 3000

3. **Start dev server (both client & server):**
   ```bash
   npm run dev
   ```
   - Server: http://localhost:3000
   - Client: http://localhost:5173

4. **Access the app:**
   - Open http://localhost:5173 in your browser
   - Create a new interview room
   - Share the link with a participant

### Docker

Build and run with Docker:
```bash
docker build -t coding-interview-app .
docker run -p 3000:3000 coding-interview-app
```

## Testing

Run integration tests:
```bash
npm run dev & sleep 3 && node test_integration.js && kill %1
```

Or manually:
1. Start the app: `npm run dev`
2. In another terminal: `node test_integration.js`

Tests verify:
- ✅ Room creation via REST API
- ✅ Client-server Socket.io connections
- ✅ Real-time code synchronization
- ✅ Language switching synchronization

## Deployment

### Deploy to Render (Production)

For complete deployment guide with environment setup, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

Quick steps:
1. Push code to GitHub
2. Connect repository to Render
3. Render auto-detects `render.yaml` config
4. Deployment completes in ~2-3 minutes

**Live Demo**: Check Render dashboard for your app URL

### Key Features for Production
- Health check endpoint: `/health`
- Multi-stage Docker build for optimized images
- Automatic static file serving
- Socket.io configured for production

