#!/bin/bash

# 🚀 IMMEDIATE DEPLOYMENT SCRIPT FOR CLOUDFLARE
# Run these commands to deploy the Saudi "Idea to Market" platform

echo "🇸🇦 Deploying Saudi Idea to Market Platform to Cloudflare..."
echo "=============================================="
echo ""

# Step 1: Install Wrangler if not installed
echo "📦 Step 1: Installing Wrangler CLI..."
npm install -g wrangler

# Step 2: Login to Cloudflare
echo ""
echo "🔐 Step 2: Authenticating with Cloudflare..."
wrangler login

# Step 3: Create Cloudflare Resources (First time only)
echo ""
echo "🏗️ Step 3: Creating Cloudflare Resources..."
echo "Creating KV namespaces..."
wrangler kv:namespace create "USER_DATA"
wrangler kv:namespace create "SESSIONS"
wrangler kv:namespace create "CACHE"

echo "Creating D1 database..."
wrangler d1 create idea-to-market-db

echo "Creating R2 buckets..."
wrangler r2 bucket create idea-to-market-uploads
wrangler r2 bucket create idea-to-market-generated

# Step 4: Set Environment Variables
echo ""
echo "🔐 Step 4: Setting Environment Variables..."
echo "Enter your Claude API key:"
read -s CLAUDE_KEY
wrangler secret put CLAUDE_API_KEY <<< "$CLAUDE_KEY"

echo "Enter your JWT secret (or press enter to generate one):"
read -s JWT_KEY
if [ -z "$JWT_KEY" ]; then
  JWT_KEY=$(openssl rand -base64 32)
  echo "Generated JWT secret: $JWT_KEY"
fi
wrangler secret put JWT_SECRET <<< "$JWT_KEY"

# Step 5: Deploy Pages (Static Site)
echo ""
echo "🌐 Step 5: Deploying Static Site to Cloudflare Pages..."
wrangler pages deploy dist \
  --project-name=idea-to-market-saudi \
  --compatibility-date=2024-01-15

# Step 6: Deploy Workers (API Functions)
echo ""
echo "⚡ Step 6: Deploying API Functions to Cloudflare Workers..."
wrangler deploy

# Step 7: Get deployment URLs
echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "=============================================="
echo ""
echo "🌐 Your Saudi Idea to Market Platform is now live at:"
echo ""
echo "Pages URL: https://idea-to-market-saudi.pages.dev"
echo "API URL: https://idea-to-market-saudi.workers.dev"
echo ""
echo "📋 Next Steps:"
echo "1. Configure custom domain (idea-to-market.sa) in Cloudflare Dashboard"
echo "2. Set up Saudi payment gateway API keys"
echo "3. Test the platform with Arabic/English content"
echo "4. Monitor analytics and performance"
echo ""
echo "🇸🇦 من الفكرة إلى السوق - Ready to serve Saudi entrepreneurs!"