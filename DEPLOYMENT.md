# Deployment Guide for OrgoPivy

This guide covers deploying both the Next.js frontend and FastAPI backend.

## Architecture

- **Frontend**: Next.js app (in `web/` directory)
- **Backend**: FastAPI app (in `api/` directory)
- **Storage**: Local file storage (uploads, practice exams, indexes)

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Deploy Frontend to Vercel

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `pivy-off/OrgoPivy` repository

2. **Configure Vercel Project**:
   - **Root Directory**: `web`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL (e.g., `https://your-api.railway.app`)

4. **Deploy**: Click "Deploy"

#### Deploy Backend to Railway

1. **Connect GitHub to Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Railway Service**:
   - Railway will detect the `railway.json` or `Dockerfile` in `api/`
   - Set the root directory to `api/`

3. **Environment Variables**:
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `PORT`: Railway will set this automatically

4. **Deploy**: Railway will automatically deploy

### Option 2: Vercel (Frontend) + Render (Backend)

#### Deploy Frontend to Vercel
Same as Option 1 above.

#### Deploy Backend to Render

1. **Create New Web Service**:
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Render Service**:
   - **Name**: `orgopivy-api`
   - **Root Directory**: `api`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**:
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL
   - `PORT`: Render sets this automatically

4. **Deploy**: Click "Create Web Service"

### Option 3: Full Docker Deployment

If you prefer Docker:

1. **Build and push Docker images**:
   ```bash
   # Build backend
   cd api
   docker build -t orgopivy-api .
   
   # Tag and push to Docker Hub or your registry
   docker tag orgopivy-api your-registry/orgopivy-api
   docker push your-registry/orgopivy-api
   ```

2. **Deploy to any Docker-compatible platform**:
   - Fly.io
   - DigitalOcean App Platform
   - AWS ECS/Fargate
   - Google Cloud Run

## Post-Deployment Checklist

1. ✅ Update `NEXT_PUBLIC_API_BASE_URL` in Vercel to point to your deployed backend
2. ✅ Update `ALLOWED_ORIGINS` in backend to include your Vercel frontend URL
3. ✅ Test the API connection from frontend
4. ✅ Verify file uploads work (check storage permissions)
5. ✅ Test practice exam downloads
6. ✅ Verify CORS is working correctly

## Environment Variables Reference

### Frontend (Vercel)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL

### Backend (Railway/Render)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs
- `PORT`: Server port (usually set automatically by platform)

## Storage Considerations

⚠️ **Important**: The current setup uses local file storage. For production:

1. **For persistent storage**, consider:
   - AWS S3 for file uploads
   - PostgreSQL with pgvector for vector storage
   - Redis for session storage

2. **Current limitations**:
   - Files are stored locally and may be lost on container restart
   - Consider implementing cloud storage for production use

## Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check that URLs match exactly (including https/http)

### API Connection Issues
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check backend logs for errors
- Ensure backend is accessible from the internet

### File Upload Issues
- Check storage directory permissions
- Verify storage directories exist
- Check file size limits in `api/app/security.py`
