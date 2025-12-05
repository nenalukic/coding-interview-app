# Deploying to Render

## Prerequisites
- GitHub account with your repository
- Render account (https://render.com)

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Connect to Render

**Option A: Using render.yaml (Recommended)**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` configuration
5. Click "Deploy"

**Option B: Manual Configuration**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in the configuration:
   - **Name**: coding-interview-app
   - **Runtime**: Node
   - **Region**: Select closest to your users
   - **Branch**: main
   - **Build Command**: `npm run install:all && npm run build --prefix client`
   - **Start Command**: `node server/index.js`
5. Click "Advanced" and add environment variables:
   - `NODE_ENV`: production
6. Click "Create Web Service"

### 3. Environment Variables in Render Dashboard
After deployment, you can manage environment variables in:
Settings → Environment → Add Environment Variable

**Recommended variables:**
- `NODE_ENV`: production
- `PORT`: 3000 (auto-set by Render)

### 4. Monitor Deployment
- View logs: Dashboard → Your Service → Logs
- Check status: Dashboard → Your Service → Events
- Health check: The `/health` endpoint monitors your app

## Architecture

Your deployment uses:
- **Frontend**: React app (built by Vite, served from `/client/dist`)
- **Backend**: Express server with Socket.io
- **Server**: Handles both API routes (`/rooms`) and serves static client files
- **Real-time**: Socket.io connections work seamlessly on Render

## Environment-Specific Configuration

The app automatically detects:
- **Development** (`NODE_ENV=development`): Uses Vite dev server
- **Production** (`NODE_ENV=production`): Serves built client files from Express

## Troubleshooting

**Build fails:**
- Check logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (18.x)

**App crashes after deploy:**
- Check health check endpoint: `https://your-app.onrender.com/health`
- Review logs in dashboard
- Verify environment variables are set

**Client app not loading:**
- Confirm client build succeeded in Render logs
- Check that `/client/dist` exists in production build
- Verify server is serving static files correctly

**Socket.io connection issues:**
- Ensure CORS is properly configured in server
- Check browser console for connection errors
- Verify WebSocket support on your Render plan

## Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First spin-up takes ~30 seconds (cold start)
- Limited to 0.5 GB RAM

**For production, consider upgrading to Starter or higher plan.**

## Next Steps
1. Push this code to GitHub
2. Deploy via Render dashboard
3. Test at your Render URL: `https://your-app.onrender.com`
4. Monitor logs and performance
5. Scale up if needed

## Useful Render Resources
- Docs: https://render.com/docs
- Support: https://render.com/support
- Deployment environment: Node.js, Express, Socket.io ready
