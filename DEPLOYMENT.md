# 🚀 Deployment Guide - Cloudflare Pages & Workers

## من الفكرة إلى السوق | Idea to Market - Saudi Platform

This guide walks through deploying the complete Saudi AI-powered entrepreneurship platform to Cloudflare.

## 📋 Prerequisites

1. **Cloudflare Account** with Pages and Workers enabled
2. **Node.js 18+** and npm 9+
3. **Wrangler CLI** installed globally
4. **Domain** connected to Cloudflare (idea-to-market.sa)
5. **API Keys** for all integrated services

## 🛠️ Initial Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Clone and Install Dependencies

```bash
git clone https://github.com/brainsait/idea-to-market-saudi.git
cd idea-to-market-saudi
npm install
```

## 🏗️ Cloudflare Infrastructure Setup

### Step 1: Create KV Namespaces

```bash
# Development Environment
wrangler kv:namespace create "USER_DATA" --env=development
wrangler kv:namespace create "SESSIONS" --env=development  
wrangler kv:namespace create "CACHE" --env=development

# Staging Environment
wrangler kv:namespace create "USER_DATA" --env=staging
wrangler kv:namespace create "SESSIONS" --env=staging
wrangler kv:namespace create "CACHE" --env=staging

# Production Environment
wrangler kv:namespace create "USER_DATA" --env=production
wrangler kv:namespace create "SESSIONS" --env=production
wrangler kv:namespace create "CACHE" --env=production
```

Update `wrangler.toml` with the returned namespace IDs.

### Step 2: Create D1 Database

```bash
# Create databases for each environment
wrangler d1 create idea-to-market-dev-db
wrangler d1 create idea-to-market-staging-db  
wrangler d1 create idea-to-market-prod-db
```

### Step 3: Create R2 Storage Buckets

```bash
# Development
wrangler r2 bucket create idea-to-market-dev-uploads
wrangler r2 bucket create idea-to-market-dev-generated

# Staging
wrangler r2 bucket create idea-to-market-staging-uploads
wrangler r2 bucket create idea-to-market-staging-generated

# Production
wrangler r2 bucket create idea-to-market-prod-uploads
wrangler r2 bucket create idea-to-market-prod-generated
```

## 🔐 Environment Variables Setup

### Set Secrets for Production

```bash
# AI Integration
wrangler secret put CLAUDE_API_KEY --env=production
# Enter your Claude API key when prompted

# Saudi Payment Gateways
wrangler secret put MADA_API_KEY --env=production
wrangler secret put MADA_WEBHOOK_SECRET --env=production
wrangler secret put STC_PAY_API_KEY --env=production
wrangler secret put STC_PAY_WEBHOOK_SECRET --env=production

# Authentication
wrangler secret put JWT_SECRET --env=production
# Use: openssl rand -base64 32

# Analytics & Monitoring
wrangler secret put GA_TRACKING_ID --env=production
wrangler secret put MIXPANEL_TOKEN --env=production
wrangler secret put SENTRY_DSN --env=production
```

### Set Environment Variables

Update your `wrangler.toml` with non-secret environment variables:

```toml
[env.production]
vars = { 
  ENVIRONMENT = "production",
  DEBUG = "false",
  API_BASE_URL = "https://api.idea-to-market.sa",
  FRONTEND_URL = "https://idea-to-market.sa",
  MADA_API_URL = "https://api.mada.sa/v1",
  STC_PAY_API_URL = "https://api.stcpay.com.sa/v1"
}
```

## 🚀 Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

### Method 2: Manual Deployment

```bash
# Build the application
npm run build

# Deploy Pages (Production)
wrangler pages deploy dist \
  --project-name=idea-to-market-saudi \
  --env=production

# Deploy Workers/Functions
wrangler deploy --env=production
```

### Method 3: GitHub Actions (CI/CD)

Push to the respective branch:
- `staging` branch → auto-deploy to staging
- `main` branch → auto-deploy to production

## 📊 Post-Deployment Verification

### 1. Health Checks

```bash
# Check API health
curl https://idea-to-market.sa/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "environment": "production",
  "region": "iad",
  "version": "1.0.0"
}
```

### 2. Frontend Verification

Visit the deployed URLs:
- **Production**: https://idea-to-market.sa
- **Staging**: https://staging.idea-to-market.sa

Check:
- ✅ Arabic RTL layout displays correctly
- ✅ English LTR layout switches properly
- ✅ Saudi green/gold color scheme loads
- ✅ Cairo/Tajawal Arabic fonts render
- ✅ Payment methods show (Mada, STC Pay)
- ✅ SAR currency displays throughout

### 3. API Integration Tests

```bash
# Test Claude AI integration
curl -X POST https://idea-to-market.sa/api/claude/brainstorm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"businessIdea": "تطبيق توصيل طعام صحي"}'

# Test payment session creation
curl -X POST https://idea-to-market.sa/api/payments/create-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"planType": "professional", "paymentMethod": "mada", "amount": 299}'
```

### 4. E2E Testing

```bash
# Run end-to-end tests
BASE_URL=https://idea-to-market.sa npm run test:e2e
```

## 🌐 Domain & DNS Configuration

### 1. Add Domain to Cloudflare

1. Go to Cloudflare Dashboard
2. Add site: `idea-to-market.sa`
3. Update nameservers at domain registrar

### 2. Configure DNS Records

```bash
# A record for root domain
idea-to-market.sa → CNAME → idea-to-market-saudi.pages.dev

# CNAME for www (redirect)
www.idea-to-market.sa → CNAME → idea-to-market.sa

# API subdomain
api.idea-to-market.sa → CNAME → idea-to-market-saudi.brainsait.workers.dev
```

### 3. SSL/TLS Configuration

1. SSL/TLS → Overview → Full (strict)
2. Edge Certificates → Always Use HTTPS: ON
3. SSL/TLS → Edge Certificates → Minimum TLS Version: 1.2

## 📈 Performance Optimization

### 1. Cloudflare Cache Rules

Create cache rules in Cloudflare dashboard:

```
# Static Assets
/assets/* → Cache Everything, Edge TTL: 1 year

# Images  
/images/* → Cache Everything, Edge TTL: 1 day

# API Routes
/api/* → Bypass Cache
```

### 2. Compression

Enable in Cloudflare:
- Speed → Optimization → Auto Minify: JS, CSS, HTML
- Speed → Optimization → Brotli: ON

### 3. Rocket Loader

Speed → Optimization → Rocket Loader: OFF
(Disabled to prevent conflicts with React)

## 🔍 Monitoring Setup

### 1. Analytics

- Enable Cloudflare Web Analytics
- Configure Google Analytics 4
- Set up custom events for Saudi market metrics

### 2. Error Tracking

```javascript
// Sentry configuration already included in build
// Monitor JavaScript errors and API failures
```

### 3. Performance Monitoring

- Cloudflare Speed tab for Core Web Vitals
- Real User Monitoring (RUM) enabled
- Lighthouse CI in GitHub Actions

## 🛡️ Security Configuration

### 1. Firewall Rules

Create rules in Cloudflare Security:

```
# Block non-Saudi countries for admin routes
(http.request.uri.path contains "/admin" and ip.geoip.country != "SA") → Block

# Rate limiting for API
(http.request.uri.path contains "/api" and rate() > 100) → Challenge
```

### 2. Page Rules

```
# Force HTTPS
http://*idea-to-market.sa/* → Always Use HTTPS: ON

# Security headers
idea-to-market.sa/* → Security Level: High
```

## 🧪 Testing Checklist

### Pre-Deployment

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set

### Post-Deployment

- [ ] Site loads correctly
- [ ] Arabic RTL layout works
- [ ] Language switching functions
- [ ] Payment integration responds
- [ ] Claude AI generates content
- [ ] User registration/login works
- [ ] Mobile responsive design
- [ ] PWA installation available
- [ ] Saudi payment methods visible
- [ ] SAR currency displayed
- [ ] WhatsApp sharing works

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Wrangler Authentication

```bash
# Re-authenticate
wrangler logout
wrangler login
```

#### 3. Environment Variable Issues

```bash
# List current secrets
wrangler secret list --env=production

# Update secret
wrangler secret put VARIABLE_NAME --env=production
```

#### 4. KV Namespace Issues

```bash
# List KV namespaces
wrangler kv:namespace list

# Update wrangler.toml with correct IDs
```

### Performance Issues

1. **Slow API responses**: Check Claude API rate limits
2. **High memory usage**: Optimize image sizes and bundle
3. **Network timeouts**: Increase timeout values in wrangler.toml

### Saudi-Specific Issues

1. **Arabic fonts not loading**: Check font preconnects in index.html
2. **Payment methods not showing**: Verify API keys for Mada/STC Pay
3. **Currency formatting**: Ensure proper SAR locale formatting
4. **RTL layout broken**: Check CSS logical properties

## 📞 Support

### Technical Support

- **Email**: devops@idea-to-market.sa
- **Slack**: #cloudflare-support (internal)
- **Phone**: +966-11-XXX-XXXX (emergency only)

### Cloudflare Support

- **Dashboard**: https://dash.cloudflare.com
- **Docs**: https://developers.cloudflare.com
- **Discord**: https://discord.gg/cloudflaredev

### Service Status

- **Cloudflare**: https://cloudflarestatus.com
- **Claude AI**: https://status.anthropic.com
- **Internal**: https://status.idea-to-market.sa

---

## 🎉 Deployment Complete!

Your Saudi AI-powered entrepreneurship platform is now live on Cloudflare's global edge network, optimized for Saudi users with:

- ⚡ Sub-100ms latency in Saudi Arabia
- 🌐 Arabic-first RTL interface  
- 💳 Local payment methods (Mada, STC Pay)
- 🤖 Claude AI integration for idea generation
- 📱 PWA capabilities for mobile users
- 🔒 Enterprise-grade security and performance

**Production URL**: https://idea-to-market.sa  
**Staging URL**: https://staging.idea-to-market.sa

Ready to help Saudi entrepreneurs transform their ideas into market-ready products! 🇸🇦✨