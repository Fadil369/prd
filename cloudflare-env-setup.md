# Cloudflare Environment Variables Setup

This document outlines the environment variables that need to be configured in Cloudflare for the Idea to Market Saudi platform.

## 🚀 Cloudflare Pages Environment Variables

### Development Environment

```bash
# Application Configuration
ENVIRONMENT=development
DEBUG=true
API_BASE_URL=https://dev-api.idea-to-market.sa
FRONTEND_URL=https://dev.idea-to-market.sa

# AI Integration
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
CLAUDE_MODEL=claude-3-sonnet-20240229

# Saudi Payment Gateways
MADA_API_KEY=your_mada_dev_api_key
MADA_API_URL=https://sandbox.mada.sa/v1
MADA_MERCHANT_ID=your_mada_dev_merchant_id
MADA_WEBHOOK_SECRET=your_mada_webhook_secret

STC_PAY_API_KEY=your_stc_pay_dev_api_key
STC_PAY_API_URL=https://sandbox.stcpay.com.sa/v1
STC_PAY_MERCHANT_ID=your_stc_pay_dev_merchant_id
STC_PAY_WEBHOOK_SECRET=your_stc_pay_webhook_secret

STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Authentication
JWT_SECRET=your_super_secure_dev_jwt_secret_key_256_bits_long

# Analytics
GA_TRACKING_ID=G-DEV123456789
MIXPANEL_TOKEN=your_dev_mixpanel_token

# Communication
SENDGRID_API_KEY=your_sendgrid_dev_api_key
SENDGRID_FROM_EMAIL=dev-noreply@idea-to-market.sa
```

### Staging Environment

```bash
# Application Configuration
ENVIRONMENT=staging
DEBUG=false
API_BASE_URL=https://staging-api.idea-to-market.sa
FRONTEND_URL=https://staging.idea-to-market.sa

# AI Integration
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
CLAUDE_MODEL=claude-3-sonnet-20240229

# Saudi Payment Gateways (Staging)
MADA_API_KEY=your_mada_staging_api_key
MADA_API_URL=https://staging.mada.sa/v1
MADA_MERCHANT_ID=your_mada_staging_merchant_id
MADA_WEBHOOK_SECRET=your_mada_staging_webhook_secret

STC_PAY_API_KEY=your_stc_pay_staging_api_key
STC_PAY_API_URL=https://staging.stcpay.com.sa/v1
STC_PAY_MERCHANT_ID=your_stc_pay_staging_merchant_id
STC_PAY_WEBHOOK_SECRET=your_stc_pay_staging_webhook_secret

# Authentication
JWT_SECRET=your_super_secure_staging_jwt_secret_key_256_bits_long

# Analytics
GA_TRACKING_ID=G-STAGING123456789
MIXPANEL_TOKEN=your_staging_mixpanel_token
```

### Production Environment

```bash
# Application Configuration
ENVIRONMENT=production
DEBUG=false
API_BASE_URL=https://api.idea-to-market.sa
FRONTEND_URL=https://idea-to-market.sa

# AI Integration
CLAUDE_API_KEY=your_claude_production_api_key
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
CLAUDE_MODEL=claude-3-sonnet-20240229

# Saudi Payment Gateways (Production)
MADA_API_KEY=your_mada_production_api_key
MADA_API_URL=https://api.mada.sa/v1
MADA_MERCHANT_ID=your_mada_production_merchant_id
MADA_WEBHOOK_SECRET=your_mada_production_webhook_secret

STC_PAY_API_KEY=your_stc_pay_production_api_key
STC_PAY_API_URL=https://api.stcpay.com.sa/v1
STC_PAY_MERCHANT_ID=your_stc_pay_production_merchant_id
STC_PAY_WEBHOOK_SECRET=your_stc_pay_production_webhook_secret

APPLE_PAY_MERCHANT_ID=merchant.sa.idea-to-market
APPLE_PAY_COUNTRY_CODE=SA
APPLE_PAY_CURRENCY_CODE=SAR

# Authentication
JWT_SECRET=your_super_secure_production_jwt_secret_key_256_bits_long

# Analytics
GA_TRACKING_ID=G-PROD123456789
MIXPANEL_TOKEN=your_production_mixpanel_token

# Communication
SENDGRID_API_KEY=your_sendgrid_production_api_key
SENDGRID_FROM_EMAIL=noreply@idea-to-market.sa

# Monitoring
SENTRY_DSN=your_production_sentry_dsn
LOGROCKET_APP_ID=your_production_logrocket_app_id
```

## 🔧 Cloudflare KV Namespaces

Create the following KV namespaces in your Cloudflare dashboard:

### Development
- `idea-to-market-dev-user-data`
- `idea-to-market-dev-sessions`
- `idea-to-market-dev-cache`

### Staging
- `idea-to-market-staging-user-data`
- `idea-to-market-staging-sessions`
- `idea-to-market-staging-cache`

### Production
- `idea-to-market-prod-user-data`
- `idea-to-market-prod-sessions`
- `idea-to-market-prod-cache`

## 💾 Cloudflare D1 Database

Create D1 databases for each environment:

### Development
- Database name: `idea-to-market-dev-db`

### Staging
- Database name: `idea-to-market-staging-db`

### Production
- Database name: `idea-to-market-prod-db`

## 📦 Cloudflare R2 Storage

Create R2 buckets for file storage:

### Development
- `idea-to-market-dev-uploads`
- `idea-to-market-dev-generated`

### Staging
- `idea-to-market-staging-uploads`
- `idea-to-market-staging-generated`

### Production
- `idea-to-market-prod-uploads`
- `idea-to-market-prod-generated`

## ⚙️ Setup Commands

### 1. Create KV Namespaces

```bash
# Development
npx wrangler kv:namespace create "USER_DATA" --env=development
npx wrangler kv:namespace create "SESSIONS" --env=development
npx wrangler kv:namespace create "CACHE" --env=development

# Staging
npx wrangler kv:namespace create "USER_DATA" --env=staging
npx wrangler kv:namespace create "SESSIONS" --env=staging
npx wrangler kv:namespace create "CACHE" --env=staging

# Production
npx wrangler kv:namespace create "USER_DATA" --env=production
npx wrangler kv:namespace create "SESSIONS" --env=production
npx wrangler kv:namespace create "CACHE" --env=production
```

### 2. Create D1 Database

```bash
# Development
npx wrangler d1 create idea-to-market-dev-db

# Staging
npx wrangler d1 create idea-to-market-staging-db

# Production
npx wrangler d1 create idea-to-market-prod-db
```

### 3. Create R2 Buckets

```bash
# Development
npx wrangler r2 bucket create idea-to-market-dev-uploads
npx wrangler r2 bucket create idea-to-market-dev-generated

# Staging
npx wrangler r2 bucket create idea-to-market-staging-uploads
npx wrangler r2 bucket create idea-to-market-staging-generated

# Production
npx wrangler r2 bucket create idea-to-market-prod-uploads
npx wrangler r2 bucket create idea-to-market-prod-generated
```

### 4. Set Environment Variables

```bash
# Example for setting environment variables
npx wrangler secret put CLAUDE_API_KEY --env=production
npx wrangler secret put JWT_SECRET --env=production
npx wrangler secret put MADA_API_KEY --env=production
npx wrangler secret put STC_PAY_API_KEY --env=production
```

## 🔐 Security Notes

1. **Never commit API keys** to version control
2. **Use different keys** for each environment
3. **Rotate secrets regularly** (every 90 days)
4. **Monitor API usage** to detect anomalies
5. **Use strong JWT secrets** (256+ bits)
6. **Enable 2FA** on all external service accounts

## 📊 Monitoring Setup

### Cloudflare Analytics Engine

Enable Analytics Engine to track:
- User interactions
- Payment success rates
- API response times
- Error rates by region

### Custom Analytics Events

Track Saudi-specific metrics:
- Arabic vs English usage
- Mobile vs desktop usage in Saudi
- Payment method preferences
- Regional usage patterns

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] KV namespaces created and linked
- [ ] D1 database created and migrated
- [ ] R2 buckets created and configured
- [ ] Domain DNS configured
- [ ] SSL certificates active
- [ ] Payment gateway integration tested
- [ ] Saudi payment methods verified
- [ ] Analytics tracking confirmed
- [ ] Error monitoring active
- [ ] Performance monitoring setup

## 📞 Support

For Cloudflare-specific issues:
- Cloudflare Support: https://support.cloudflare.com
- Cloudflare Discord: https://discord.gg/cloudflaredev
- Cloudflare Docs: https://developers.cloudflare.com

For project-specific issues:
- Email: devops@idea-to-market.sa
- Slack: #cloudflare-support