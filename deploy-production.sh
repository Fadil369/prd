#!/bin/bash

# Production Deployment Script for Ideas to Innovation Platform
# Saudi Arabia - Vision 2030 Aligned

set -e

echo "🚀 Starting Production Deployment for Ideas to Innovation Platform..."
echo "🇸🇦 Deploying Saudi Arabia - Vision 2030 Aligned Platform"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean and Build
echo -e "${BLUE}📦 Step 1: Building for production...${NC}"
rm -rf dist/
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Step 2: Verify build output
echo -e "${BLUE}📋 Step 2: Verifying build output...${NC}"
ls -la dist/

# Check critical files
critical_files=("index.html" "manifest.webmanifest" "sw.js")
for file in "${critical_files[@]}"; do
    if [ -f "dist/$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing!${NC}"
        exit 1
    fi
done

# Step 3: Deploy to Cloudflare Pages
echo -e "${BLUE}🌐 Step 3: Deploying to Cloudflare Pages...${NC}"
wrangler pages deploy dist --project-name=idea-to-market-saudi --branch=main

# Step 4: Deploy Functions (if any)
echo -e "${BLUE}⚡ Step 4: Deploying Cloudflare Workers Functions...${NC}"
if [ -d "functions" ]; then
    echo "Functions directory found, deploying..."
    wrangler deploy
else
    echo "No functions directory found, skipping..."
fi

# Step 5: Success message
echo ""
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}🇸🇦 Ideas to Innovation Platform is now live!${NC}"
echo ""
echo -e "${BLUE}📱 Arabic (RTL): https://idea-to-market-saudi.pages.dev${NC}"
echo -e "${BLUE}🌐 English (LTR): https://idea-to-market-saudi.pages.dev${NC}"
echo ""
echo -e "${BLUE}📊 Next Steps:${NC}"
echo "1. Test Arabic/English switching"
echo "2. Verify Saudi cultural elements"
echo "3. Test brainstorming form functionality"
echo "4. Verify PWA installation"
echo "5. Test payment method display"
echo ""
echo -e "${GREEN}🚀 Ready for Saudi entrepreneurs!${NC}"
