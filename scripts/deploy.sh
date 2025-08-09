#!/bin/bash

# Deployment Script for Idea to Market Saudi on Cloudflare
# Supports staging and production deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-staging}

# Configuration
PROJECT_NAME="idea-to-market-saudi"
STAGING_PROJECT="${PROJECT_NAME}-staging"
PRODUCTION_PROJECT="${PROJECT_NAME}"

echo -e "${BLUE}🚀 Deploying Idea to Market Saudi to Cloudflare...${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo ""

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler
fi

# Check if user is authenticated
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️ Please authenticate with Cloudflare first:${NC}"
    echo "wrangler login"
    exit 1
fi

# Pre-deployment checks
echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci

# Run linting
echo -e "${BLUE}🧹 Running linter...${NC}"
npm run lint

# Run type checking
echo -e "${BLUE}🔍 Running TypeScript checks...${NC}"
npm run typecheck

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm run test

# Build the application
echo -e "${BLUE}🏗️ Building application...${NC}"
npm run build

# Check if dist directory exists
if [[ ! -d "dist" ]]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

# Validate critical files
CRITICAL_FILES=("dist/index.html" "dist/assets")
for file in "${CRITICAL_FILES[@]}"; do
    if [[ ! -e "$file" ]]; then
        echo -e "${RED}❌ Critical file missing: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Build validation passed${NC}"

# Deploy based on environment
if [[ "$ENVIRONMENT" == "staging" ]]; then
    echo -e "${BLUE}🚢 Deploying to staging...${NC}"
    
    # Deploy Pages
    wrangler pages deploy dist \
        --project-name="$STAGING_PROJECT" \
        --env=staging \
        --compatibility-date=2024-01-15
    
    # Deploy Functions
    wrangler deploy --env=staging
    
    DEPLOYED_URL="https://staging.idea-to-market.sa"
    
elif [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${BLUE}🚢 Deploying to production...${NC}"
    
    # Additional production checks
    echo -e "${YELLOW}⚠️ Deploying to PRODUCTION. Continue? (y/N)${NC}"
    read -r confirmation
    if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
        echo -e "${YELLOW}Deployment cancelled${NC}"
        exit 0
    fi
    
    # Deploy Pages
    wrangler pages deploy dist \
        --project-name="$PRODUCTION_PROJECT" \
        --env=production \
        --compatibility-date=2024-01-15
    
    # Deploy Functions
    wrangler deploy --env=production
    
    DEPLOYED_URL="https://idea-to-market.sa"
fi

# Post-deployment verification
echo -e "${BLUE}🔍 Verifying deployment...${NC}"

# Wait for deployment to propagate
sleep 10

# Check if the site is accessible
if curl -f -s "$DEPLOYED_URL" > /dev/null; then
    echo -e "${GREEN}✅ Site is accessible at $DEPLOYED_URL${NC}"
else
    echo -e "${RED}❌ Site verification failed${NC}"
    exit 1
fi

# Check API health
API_URL="${DEPLOYED_URL}/api/health"
if curl -f -s "$API_URL" | grep -q "healthy"; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${YELLOW}⚠️ API health check failed or not available yet${NC}"
fi

# Run E2E tests for production
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${BLUE}🧪 Running production E2E tests...${NC}"
    BASE_URL="$DEPLOYED_URL" npm run test:e2e
fi

# Success message
echo ""
echo -e "${GREEN}🎉 Deployment successful!${NC}"
echo -e "${BLUE}🌐 URL: ${DEPLOYED_URL}${NC}"
echo -e "${BLUE}📊 Cloudflare Dashboard: https://dash.cloudflare.com${NC}"

# Additional information
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo ""
    echo -e "${YELLOW}📋 Post-deployment checklist:${NC}"
    echo "• Monitor analytics for any issues"
    echo "• Check payment gateway integration"
    echo "• Verify Arabic/RTL functionality"
    echo "• Test Saudi payment methods"
    echo "• Monitor error rates in Sentry"
    echo "• Check performance metrics"
fi

# Cache invalidation
echo -e "${BLUE}🗑️ Purging Cloudflare cache...${NC}"
wrangler pages project list | grep -q "$PROJECT_NAME" && \
wrangler pages deployment list --project-name="$PROJECT_NAME" --env="$ENVIRONMENT" | head -1 | \
xargs -I {} wrangler pages deployment tail {} || true

echo -e "${GREEN}✅ Deployment complete!${NC}"