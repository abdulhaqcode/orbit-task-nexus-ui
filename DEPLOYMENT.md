# Deployment Guide - Orbit Task Nexus

This guide covers free deployment options for your full-stack task management application.

## 🎯 Recommended Free Deployment Options

### Option 1: Render (Recommended) ⭐

**Best for**: Full-stack apps with PostgreSQL database

#### Features
- ✅ Free PostgreSQL database (90 days, then $7/month)
- ✅ Free web service (spins down after inactivity)
- ✅ Automatic deployments from Git
- ✅ Custom domains
- ✅ Environment variables management

#### Deployment Steps

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `orbit-task-nexus-db`
   - Region: Choose closest to your users
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL" for later

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `orbit-task-nexus-api`
     - **Root Directory**: `server`
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free
   
   - Add Environment Variables:
     ```
     NODE_ENV=production
     PORT=5000
     DATABASE_URL=[paste Internal Database URL]
     JWT_SECRET=[generate strong secret]
     SESSION_SECRET=[generate strong secret]
     FRONTEND_URL=[will add after frontend deployment]
     CORS_ORIGINS=[will add after frontend deployment]
     ```
   
   - Click "Create Web Service"
   - Note the backend URL (e.g., `https://orbit-task-nexus-api.onrender.com`)

4. **Run Database Migration**
   - In Render dashboard, go to your backend service
   - Click "Shell" tab
   - Run: `npm run migrate`

5. **Deploy Frontend**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `orbit-task-nexus`
     - **Root Directory**: Leave empty
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   
   - Add Environment Variable:
     ```
     VITE_API_URL=https://orbit-task-nexus-api.onrender.com/api
     ```
   
   - Click "Create Static Site"
   - Note the frontend URL (e.g., `https://orbit-task-nexus.onrender.com`)

6. **Update Backend Environment Variables**
   - Go back to backend service settings
   - Update:
     ```
     FRONTEND_URL=https://orbit-task-nexus.onrender.com
     CORS_ORIGINS=https://orbit-task-nexus.onrender.com
     ```

---

### Option 2: Railway

**Best for**: Easy deployment with generous free tier

#### Features
- ✅ $5 free credit monthly
- ✅ PostgreSQL included
- ✅ Simple deployment
- ✅ Custom domains

#### Deployment Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision the database

4. **Configure Backend Service**
   - Click "+ New" → "GitHub Repo"
   - Select your repository
   - Settings:
     - **Root Directory**: `server`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
   
   - Add Variables (copy from PostgreSQL service):
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     NODE_ENV=production
     PORT=5000
     JWT_SECRET=[generate]
     SESSION_SECRET=[generate]
     ```

5. **Configure Frontend Service**
   - Click "+ New" → "GitHub Repo"
   - Select your repository
   - Settings:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npx serve -s dist -l 3000`
   
   - Add Variable:
     ```
     VITE_API_URL=https://[backend-url].railway.app/api
     ```

---

### Option 3: Vercel (Frontend) + Supabase (Database) + Render (Backend)

**Best for**: Maximum free tier usage

#### Frontend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave empty
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=[backend-url]/api
   ```

#### Database on Supabase (Free PostgreSQL)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Use in backend deployment

#### Backend on Render
- Follow Render backend steps from Option 1

---

### Option 4: Fly.io

**Best for**: Global edge deployment

#### Features
- ✅ Free tier with 3 VMs
- ✅ PostgreSQL included
- ✅ Global deployment

#### Deployment Steps

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Deploy Backend**
   ```bash
   cd server
   fly launch
   # Follow prompts, select PostgreSQL
   fly deploy
   ```

4. **Deploy Frontend**
   ```bash
   cd ..
   fly launch
   fly deploy
   ```

---

## 🔧 Production Checklist

Before deploying to production:

- [ ] Change all default secrets (JWT_SECRET, SESSION_SECRET)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure OAuth redirect URLs for production
- [ ] Test all API endpoints
- [ ] Set up monitoring (optional: Sentry, LogRocket)
- [ ] Configure rate limiting
- [ ] Review security headers

## 🔐 OAuth Configuration for Production

Update OAuth callback URLs in respective platforms:

**Google**: `https://your-backend-url.com/api/auth/google/callback`
**Facebook**: `https://your-backend-url.com/api/auth/facebook/callback`
**GitHub**: `https://your-backend-url.com/api/auth/github/callback`

## 📊 Cost Comparison

| Platform | Database | Backend | Frontend | Total/Month |
|----------|----------|---------|----------|-------------|
| **Render** | Free (90 days) | Free | Free | $0 (then $7) |
| **Railway** | Included | Included | Included | $0 ($5 credit) |
| **Vercel + Render** | $0 | Free | Free | $0 |
| **Fly.io** | Included | Free | Free | $0 |

## 🚀 Deployment Best Practices

1. **Use Environment Variables**: Never hardcode secrets
2. **Enable Auto-Deploy**: Connect to Git for automatic deployments
3. **Monitor Logs**: Check application logs regularly
4. **Set Up Alerts**: Configure uptime monitoring
5. **Database Backups**: Enable automatic backups
6. **Use CDN**: For static assets (images, fonts)

## 🐛 Common Deployment Issues

### CORS Errors
- Ensure CORS_ORIGINS includes your frontend URL
- Check protocol (http vs https)

### Database Connection Fails
- Verify DATABASE_URL is correct
- Check if database is running
- Ensure migrations ran successfully

### OAuth Not Working
- Update callback URLs to production URLs
- Verify OAuth credentials
- Check FRONTEND_URL is correct

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Review build logs for specific errors

## 📞 Support

For deployment issues:
- **Render**: [render.com/docs](https://render.com/docs)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Fly.io**: [fly.io/docs](https://fly.io/docs)

## 🎉 Post-Deployment

After successful deployment:
1. Test all features thoroughly
2. Share your app URL
3. Monitor performance
4. Collect user feedback
5. Plan future updates

---

**Congratulations! Your app is now live! 🚀**
