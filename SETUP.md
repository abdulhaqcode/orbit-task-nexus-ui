# Orbit Task Nexus - Setup Guide

A full-stack task management application with custom authentication, built with React, TypeScript, Express.js, and PostgreSQL.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + REST APIs
- **Database**: PostgreSQL
- **Authentication**: JWT + OAuth (Google, Facebook, GitHub)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd orbit-task-nexus-ui
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE orbit_task_nexus;

# Exit psql
\q
```

### 5. Configure Environment Variables

#### Frontend (.env)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (server/.env)

Create a `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/orbit_task_nexus
DB_HOST=localhost
DB_PORT=5432
DB_NAME=orbit_task_nexus
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# OAuth Configuration - Google (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# OAuth Configuration - Facebook (Optional)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# OAuth Configuration - GitHub (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 6. Run Database Migrations

```bash
cd server
npm run migrate
cd ..
```

### 7. Start the Application

#### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option 2: Use Concurrently (Recommended)

Add to root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev\" \"cd server && npm run dev\"",
    "dev:frontend": "vite",
    "dev:backend": "cd server && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then run:
```bash
npm install concurrently --save-dev
npm run dev
```

### 8. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🔐 Setting Up OAuth (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Add redirect URI: `http://localhost:5000/api/auth/facebook/callback`
5. Copy App ID and App Secret to your `.env` file

### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Client Secret to your `.env` file

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/username
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth
- `GET /api/auth/github` - GitHub OAuth

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:taskId/subtasks` - Add subtask
- `PUT /api/tasks/:taskId/subtasks/:subtaskId` - Update subtask
- `DELETE /api/tasks/:taskId/subtasks/:subtaskId` - Delete subtask

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🧪 Testing

```bash
# Frontend
npm run test

# Backend
cd server
npm run test
```

## 🏗️ Building for Production

```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use

- Change `PORT` in `server/.env`
- Change `VITE_API_URL` in frontend `.env`

### OAuth Not Working

- Verify callback URLs match exactly
- Check OAuth credentials are correct
- Ensure OAuth apps are in development/production mode

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
