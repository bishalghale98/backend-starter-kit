# Render Deployment Fix Guide

## Issues Found

1. **Database IPv6 Connection Error** - `ENETUNREACH 2406:da1c:...`
2. **Email Service Timeout** - SMTP configuration issue
3. **Redis Connection** - localhost won't work on Render

## Solutions

### 1. Fix Database Connection (Critical)

Your Supabase database is resolving to IPv6, but Render may not support it properly.

**Option A: Use Connection Pooler (Recommended)**

```env
DATABASE_URL="postgresql://postgres:5RfoHcyYK2cKQKaR@db.gcyttoetqefkprfiqvre.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
```

Note: Port changed to `6543` for connection pooler

**Option B: Force IPv4 with SSL**

```env
DATABASE_URL="postgresql://postgres:5RfoHcyYK2cKQKaR@db.gcyttoetqefkprfiqvre.supabase.co:5432/postgres?sslmode=require"
```

**Option C: Use Supabase Transaction Mode**
Go to your Supabase dashboard → Settings → Database → Connection String → Transaction Mode
Copy that URL instead.

### 2. Fix SMTP Password

Your SMTP password has spaces. Remove them:

**Current (Wrong):**

```env
SMTP_PASS=hafe nnjw juvg zraa
```

**Fixed:**

```env
SMTP_PASS=hafennjwjuvgzraa
```

### 3. Fix Redis Configuration

**Option A: Use Upstash Redis (Free Tier Available)**

1. Go to [upstash.com](https://upstash.com)
2. Create a free Redis database
3. Get the connection details
4. Update your environment variables:

```env
REDIS_HOST=your-upstash-endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-upstash-password
REDIS_TLS=true
```

**Option B: Disable Redis Temporarily**
Comment out Redis-related code if it's not critical for initial deployment.

## Steps to Fix on Render

### Step 1: Update Environment Variables

Go to your Render dashboard → Your Web Service → Environment

Update these variables:

```env
DATABASE_URL=postgresql://postgres:5RfoHcyYK2cKQKaR@db.gcyttoetqefkprfiqvre.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
SMTP_PASS=hafennjwjuvgzraa
NODE_ENV=production
```

### Step 2: Add Connection Pooling Settings

Add these to your Prisma configuration if using connection pooler:

```env
# Add to your .env on Render
DATABASE_URL=postgresql://postgres:5RfoHcyYK2cKQKaR@db.gcyttoetqefkprfiqvre.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:5RfoHcyYK2cKQKaR@db.gcyttoetqefkprfiqvre.supabase.co:5432/postgres
```

### Step 3: Update Prisma Schema (if using connection pooler)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Step 4: Redeploy

After updating environment variables, trigger a new deployment.

## Verification

After deployment, check the logs for:

- ✅ Database connection successful
- ✅ No SMTP timeout errors
- ✅ Application starts without errors

## Quick Test

Test the login endpoint:

```bash
curl -X POST https://your-app.onrender.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Common Issues

### Still getting IPv6 errors?

- Use the Transaction pooler URL from Supabase (port 6543)
- Or use a different database provider (Railway, Neon, etc.)

### SMTP still timing out?

- Verify your Gmail app password is correct (no spaces)
- Enable "Less secure app access" in Gmail (if using regular password)
- Consider using a service like SendGrid or Resend instead

### Redis errors?

- Set up Upstash Redis (free tier)
- Or temporarily disable Redis features
