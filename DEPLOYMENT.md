# 🚀 Railway Deployment Guide

This guide will help you deploy PromptStack to Railway with frontend, backend, and database all in one place.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **API Keys**: Get your AI provider API keys ready

## 🎯 Step-by-Step Deployment

### **Step 1: Connect to Railway**

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your PromptStack repository
5. Click "Deploy Now"

### **Step 2: Add PostgreSQL Database**

1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Copy the `DATABASE_URL` from the database variables

### **Step 3: Configure Environment Variables**

1. Go to your app's "Variables" tab
2. Add the following environment variables:

```env
# Database (Railway will provide this)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="https://your-app-name.railway.app"
NEXTAUTH_SECRET="generate-a-secure-random-string"

# AI Provider API Keys (Add your keys)
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GOOGLE_API_KEY="your-google-api-key"
MISTRAL_API_KEY="your-mistral-api-key"
COHERE_API_KEY="your-cohere-api-key"
```

### **Step 4: Generate NEXTAUTH_SECRET**

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### **Step 5: Deploy and Setup Database**

1. Railway will automatically deploy your app
2. Once deployed, go to the "Deployments" tab
3. Click on your latest deployment
4. Open the terminal and run:

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed the database
npx prisma db seed
```

### **Step 6: Verify Deployment**

1. Click on your app's URL in Railway
2. You should see the PromptStack landing page
3. Test the signup/login functionality
4. Test creating prompts and A/B tests

## 🔧 Configuration Details

### **Database Setup**
- Railway automatically provides PostgreSQL
- The `DATABASE_URL` is automatically set
- No additional database configuration needed

### **Environment Variables**
- All variables are set in Railway dashboard
- No `.env` files needed in production
- Railway handles environment management

### **Custom Domain (Optional)**
1. Go to your app's "Settings" tab
2. Click "Custom Domains"
3. Add your domain and configure DNS

## 🚨 Troubleshooting

### **Common Issues:**

1. **Build Fails**
   - Check Railway logs for errors
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check if database is provisioned
   - Run `npx prisma db push` in Railway terminal

3. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Restart deployment after adding variables

4. **API Key Issues**
   - Verify API keys are valid
   - Check if keys have sufficient credits
   - Test keys locally first

### **Useful Commands:**

```bash
# Check deployment logs
railway logs

# Access Railway terminal
railway shell

# View environment variables
railway variables

# Restart deployment
railway up
```

## 📊 Monitoring

### **Railway Dashboard Features:**
- **Real-time logs**: Monitor app performance
- **Metrics**: CPU, memory, and network usage
- **Deployments**: Track deployment history
- **Variables**: Manage environment variables
- **Domains**: Configure custom domains

### **Health Checks:**
- Railway automatically monitors your app
- Automatic restarts on failures
- Built-in load balancing

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit API keys to Git
   - Use Railway's variable management
   - Rotate keys regularly

2. **Database Security**
   - Railway handles database security
   - Automatic backups included
   - SSL connections enabled

3. **App Security**
   - HTTPS automatically enabled
   - Railway handles SSL certificates
   - DDoS protection included

## 💰 Cost Optimization

### **Railway Pricing:**
- **Free Tier**: $5 credit monthly
- **Pro Plan**: $20/month for more resources
- **Pay-as-you-go**: Only pay for what you use

### **Cost Saving Tips:**
1. Use free tier for development
2. Scale down during low usage
3. Monitor resource usage
4. Use efficient Docker images

## 🎉 Success!

Once deployed, your PromptStack app will be available at:
`https://your-app-name.railway.app`

### **Next Steps:**
1. Test all features thoroughly
2. Set up monitoring alerts
3. Configure custom domain (optional)
4. Set up CI/CD for automatic deployments

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: Report bugs in your repo

---

**Happy Deploying! 🚀** 