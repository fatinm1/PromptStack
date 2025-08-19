#!/bin/bash

echo "🚀 Promptrix Railway Deployment Script"
echo "======================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
else
    echo "✅ Railway CLI found"
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
else
    echo "✅ Already logged in to Railway"
fi

echo ""
echo "📋 Next steps:"
echo "1. Create a new Railway project"
echo "2. Add PostgreSQL service"
echo "3. Deploy your app from GitHub"
echo "4. Configure environment variables"
echo ""
echo "🔧 Useful commands:"
echo "  railway projects list          # List your projects"
echo "  railway up                     # Deploy current branch"
echo "  railway shell                  # Access Railway shell"
echo "  railway logs                   # View deployment logs"
echo "  railway variables              # Manage environment variables"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "�� Happy deploying!"
