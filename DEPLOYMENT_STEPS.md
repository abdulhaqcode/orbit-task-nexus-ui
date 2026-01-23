# 🚀 Deployment Steps - Vercel + Render

Follow these steps to deploy your Orbit Task Nexus application.

---

## Part 1: Deploy Backend on Render (with PostgreSQL)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended for auto-deploy)

### Step 2: Deploy PostgreSQL Database
1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `orbit-task-nexus-db`
   - **Database**: `orbit_task_nexus`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
   - **Plan**: **Free**
3. Click **"Create Database"**
4. Wait for database to provision (~2 minutes)
5. **IMPORTANT**: Copy the **"Internal Database URL"** - you'll need this

### Step 3: Deploy Backend Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"** → Select your GitHub repository
3. Configure:
   - **Name**: `orbit-task-nexus-api`
   - **Region**: Same as database (e.g., Oregon)
   - **Root Directory**: `server`
   - **Environment**: **Node**
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=[Paste the Internal Database URL from Step 2]
   JWT_SECRET=[Generate a random 64-character string]
   SESSION_SECRET=[Generate a random 64-character string]
   FRONTEND_URL=https://orbit-task-nexus.vercel.app
   CORS_ORIGINS=https://orbit-task-nexus.vercel.app
   ```

   **To generate secrets**, use this in your terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (~3-5 minutes)
7. **Note your backend URL**: It will be something like:
   ```
   https://orbit-task-nexus-api.onrender.com
   ```

### Step 4: Run Database Migration
1. In Render dashboard, go to your **backend service**
2. Click **"Shell"** tab (in the left sidebar)
3. Wait for shell to connect
4. Run:
   ```bash
   npm run migrate
   ```
5. You should see: "Database schema created successfully!"

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with **GitHub**

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel will auto-detect it's a Vite project

### Step 3: Configure Project
1. **Framework Preset**: Vite (auto-detected)
2. **Root Directory**: Leave empty (`.`)
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `dist` (auto-filled)
5. **Install Command**: `npm install` (auto-filled)

### Step 4: Add Environment Variable
1. Click **"Environment Variables"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://orbit-task-nexus-api.onrender.com/api`
     (Replace with YOUR actual Render backend URL from Part 1, Step 3)
   - **Environment**: All (Production, Preview, Development)

3. Click **"Deploy"**

### Step 5: Wait for Deployment
- Deployment takes ~2-3 minutes
- You'll get a URL like: `https://orbit-task-nexus.vercel.app`

---

## Part 3: Update Backend CORS Settings

After Vercel deployment completes:

1. Go back to **Render Dashboard**
2. Open your **backend service** (`orbit-task-nexus-api`)
3. Go to **"Environment"** tab
4. Update these variables with your actual Vercel URL:
   - `FRONTEND_URL`: `https://orbit-task-nexus.vercel.app`
   - `CORS_ORIGINS`: `https://orbit-task-nexus.vercel.app`
5. Click **"Save Changes"**
6. Service will auto-redeploy (~1 minute)

---

## Part 4: Test Your Application

1. Visit your Vercel URL: `https://orbit-task-nexus.vercel.app`
2. Click **"Sign up"**
3. Create an account with:
   - Username
   - Email
   - Password
4. You should be redirected to the main app
5. Try creating a task to verify everything works!

---

## 🎉 Deployment Complete!

Your app is now live at:
- **Frontend**: `https://orbit-task-nexus.vercel.app`
- **Backend API**: `https://orbit-task-nexus-api.onrender.com/api`
- **Database**: Hosted on Render (PostgreSQL)

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)
**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**Render:**
1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Update DNS records

### OAuth Setup (Optional)

If you want to enable Google/Facebook/GitHub login:

1. **Update OAuth Callback URLs** in respective platforms:
   - Google: `https://orbit-task-nexus-api.onrender.com/api/auth/google/callback`
   - Facebook: `https://orbit-task-nexus-api.onrender.com/api/auth/facebook/callback`
   - GitHub: `https://orbit-task-nexus-api.onrender.com/api/auth/github/callback`

2. **Add OAuth credentials** to Render environment variables:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

---

## 📊 Monitoring & Logs

### Render Logs
- Go to your service → "Logs" tab
- View real-time server logs
- Check for errors

### Vercel Logs
- Go to your project → "Deployments"
- Click on a deployment → "View Function Logs"

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- ✅ Check `VITE_API_URL` in Vercel environment variables
- ✅ Verify backend URL is correct (include `/api`)
- ✅ Check CORS settings in Render

### Database connection errors
- ✅ Verify `DATABASE_URL` in Render environment variables
- ✅ Check if migration ran successfully
- ✅ Ensure database is in the same region as backend

### OAuth not working
- ✅ Update callback URLs to production URLs
- ✅ Verify OAuth credentials are correct
- ✅ Check `FRONTEND_URL` is set correctly

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Render PostgreSQL | Free (90 days) | $0 → $7/month |
| Render Web Service | Free | $0 |
| Vercel Hosting | Hobby (Free) | $0 |
| **Total** | | **$0/month** (then $7/month) |

---

## 🔄 Auto-Deployment

Both Vercel and Render are connected to your GitHub repository:
- **Push to main branch** → Automatic deployment
- **Pull requests** → Preview deployments (Vercel)

---

## 📞 Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Create an issue in your repository

---

**Happy Deploying! 🚀**
