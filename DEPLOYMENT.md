# 🚀 Railway Deployment Guide

This guide will walk you through deploying Promptrix to Railway with a PostgreSQL database.

## 📋 Prerequisites

- [Railway account](https://railway.app)
- [GitHub repository](https://github.com) with your code
- API keys for LLM services (OpenAI, Anthropic, etc.)

## 🗄️ Step 1: Deploy PostgreSQL Database

### 1.1 Create Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Choose "Deploy from GitHub repo" or "Start from scratch"

### 1.2 Add PostgreSQL Service
1. Click "New Service"
2. Select "Database" → "PostgreSQL"
3. Wait for Railway to provision the database

### 1.3 Get Database Connection String
1. Click on your PostgreSQL service
2. Go to "Connect" tab
3. Copy the connection string (format: `postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway`)

## 🚀 Step 2: Deploy Your Application

### 2.1 Connect GitHub Repository
1. In your Railway project, click "New Service"
2. Choose "GitHub Repo"
3. Select your Promptrix repository
4. Railway will automatically detect it's a Next.js app

### 2.2 Configure Environment Variables
In your app service, go to "Variables" tab and add:

```env
# Database (Railway PostgreSQL)
DATABASE_URL="postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway"

# Authentication
NEXTAUTH_URL="https://your-app-name.railway.app"
NEXTAUTH_SECRET="your-production-secret-key-here"

# LLM APIs
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_API_KEY="your-google-api-key"
MISTRAL_API_KEY="your-mistral-api-key"
COHERE_API_KEY="your-cohere-api-key"

# Optional: Seed database
SEED_DATABASE="true"
```

### 2.3 Deploy
1. Railway will automatically build and deploy your app
2. The build process will:
   - Install dependencies
   - Generate Prisma client
   - Build Next.js app
   - Run database migrations
   - Start the application

## 🔧 Step 3: Database Setup

### 3.1 Initial Migration
Your app will automatically run migrations on startup. If you need to run them manually:

```bash
# Connect to Railway shell
railway shell

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### 3.2 Verify Database
1. Go to your PostgreSQL service in Railway
2. Click "Query" tab
3. Run: `SELECT * FROM information_schema.tables;`
4. You should see your tables: `users`, `workspaces`, `projects`, etc.

## 🌐 Step 4: Configure Domain

### 4.1 Custom Domain (Optional)
1. In your app service, go to "Settings" tab
2. Click "Generate Domain" or add custom domain
3. Update `NEXTAUTH_URL` with your domain

### 4.2 SSL Certificate
Railway automatically provides SSL certificates for all domains.

## 📊 Step 5: Monitor & Debug

### 5.1 Health Check
Your app includes a health check endpoint: `/api/health`
- Railway will use this for health monitoring
- Check: `https://your-app.railway.app/api/health`

### 5.2 Logs
1. In Railway dashboard, click on your app service
2. Go to "Deployments" tab
3. Click on latest deployment to view logs

### 5.3 Database Monitoring
1. Click on PostgreSQL service
2. View metrics, logs, and connection details
3. Use "Query" tab for direct database access

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check DATABASE_URL format
# Ensure database is running
# Verify network access
```

#### 2. Migration Errors
```bash
# Reset database (WARNING: loses data)
npx prisma migrate reset --force

# Or push schema directly
npx prisma db push
```

#### 3. Build Failures
```bash
# Check Node.js version compatibility
# Verify all dependencies are in package.json
# Check for TypeScript errors
```

#### 4. App Won't Start
```bash
# Check startup logs
# Verify start.sh permissions
# Check environment variables
```

### Debug Commands
```bash
# Connect to Railway shell
railway shell

# Check environment variables
env | grep DATABASE

# Test database connection
npx prisma db push --preview-feature

# View app logs
railway logs
```

## 🔄 Step 6: Continuous Deployment

### 6.1 Automatic Deploys
Railway automatically deploys when you push to your main branch.

### 6.2 Manual Deploy
```bash
# Deploy manually
railway up

# Deploy specific branch
railway up --branch feature-branch
```

### 6.3 Rollback
1. Go to "Deployments" tab
2. Click on previous deployment
3. Click "Promote" to rollback

## 📈 Step 7: Scaling

### 7.1 Horizontal Scaling
1. In app service settings
2. Increase "Number of Replicas"
3. Railway will automatically load balance

### 7.2 Database Scaling
1. In PostgreSQL service
2. Upgrade to higher tier if needed
3. Monitor connection limits

## 🔐 Security Best Practices

### 7.1 Environment Variables
- Never commit API keys to Git
- Use Railway's encrypted variables
- Rotate secrets regularly

### 7.2 Database Security
- Use strong passwords
- Limit database access
- Enable SSL connections

### 7.3 Application Security
- Keep dependencies updated
- Use HTTPS everywhere
- Implement rate limiting

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: Report bugs in your repository

## ✅ Deployment Checklist

- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] Database migrations completed
- [ ] Health check endpoint working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented

---

**Your Promptrix app should now be running on Railway with a PostgreSQL database!** 🎉 