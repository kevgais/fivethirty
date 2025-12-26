# Five Thirty - Credentials & Setup Checklist

## Overview

This document lists all accounts, API keys, and credentials needed to build and deploy **Five Thirty** ("Kill the 5:30 panic"). Most services are **free tier** and don't require payment information.

---

## Required Accounts

### 1. Cloudflare Account ✅ (You likely have this already)

**URL:** https://dash.cloudflare.com/sign-up  
**Cost:** Free  
**Purpose:** Hosting (Pages), Database (D1), API (Workers), AI, Auth (Access)

**What you need:**
- [ ] Cloudflare account (email verified)
- [ ] Domain `helpmecomputing.com` added to Cloudflare

**To verify:**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Verify connection
wrangler whoami
```

---

### 2. Cloudflare D1 Database

**URL:** https://dash.cloudflare.com/?to=/:account/workers/d1  
**Cost:** Free tier (5M reads/day, 100K writes/day, 5GB storage)  
**Purpose:** SQLite database for all app data

**Setup steps:**
```bash
# Create the database
wrangler d1 create fivethirty-db

# Note the database_id returned - you'll need this for wrangler.toml
# Example output:
# [[d1_databases]]
# binding = "DB"
# database_name = "fivethirty-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Credentials to save:**
- [ ] `database_id`: ________________________________

---

### 3. Cloudflare Pages

**URL:** https://dash.cloudflare.com/?to=/:account/pages  
**Cost:** Free (unlimited sites, bandwidth)  
**Purpose:** Frontend hosting

**Setup steps:**
1. Create new Pages project
2. Connect to GitHub (once you have a repo)
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: `/`

**No credentials needed** - uses your Cloudflare login

---

### 4. Cloudflare Workers AI

**URL:** https://dash.cloudflare.com/?to=/:account/ai  
**Cost:** Free (certain models including Llama 3.1)  
**Purpose:** "What can I make?" meal suggestions

**Setup steps:**
- Automatically available with Workers
- No separate API key needed
- Access via `env.AI` binding in Workers

**wrangler.toml config:**
```toml
[ai]
binding = "AI"
```

**No credentials needed** - uses Workers binding

---

### 5. Cloudflare Access (Zero Trust)

**URL:** https://one.dash.cloudflare.com/  
**Cost:** Free (up to 50 users)  
**Purpose:** Authentication for you and Lucy

**Setup steps:**
1. Go to Zero Trust dashboard
2. Create Access Application:
   - Name: Five Thirty
   - Domain: `home.helpmecomputing.com`
   - Session duration: 30 days
3. Create Access Policy:
   - Name: Family Only
   - Action: Allow
   - Include: Emails ending in... OR specific emails
   
**Emails to allow:**
- [ ] Kev's email: ________________________________
- [ ] Lucy's email: ________________________________

**No API key needed** - configured via dashboard

---

### 6. Open Food Facts API

**URL:** https://world.openfoodfacts.org/data  
**Cost:** Free (no limits for personal use)  
**Purpose:** Barcode scanning product lookup

**No account needed!** ✅

The API is completely public:
```bash
# Test it works
curl "https://world.openfoodfacts.org/api/v2/product/5000112628180.json"
```

**Usage:**
```typescript
const response = await fetch(
  `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
);
```

---

### 7. GitHub Repository

**URL:** https://github.com/new  
**Cost:** Free  
**Purpose:** Version control, CI/CD trigger for Cloudflare Pages

**Setup steps:**
1. Create new private repository: `fivethirty`
2. Clone locally
3. Connect to Cloudflare Pages

**Credentials:**
- [ ] Repository created: `github.com/YOUR_USERNAME/fivethirty`

---

## Environment Variables Summary

### wrangler.toml (Complete Example)

```toml
name = "fivethirty"
main = "functions/api/[[path]].ts"
compatibility_date = "2024-12-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "fivethirty-db"
database_id = "YOUR_DATABASE_ID_HERE"

# Workers AI binding
[ai]
binding = "AI"

# Environment variables (non-secret)
[vars]
ENVIRONMENT = "production"
APP_NAME = "Five Thirty"
```

### Secrets (if any needed later)

```bash
# Set secrets via wrangler (if you add any external APIs later)
wrangler secret put SECRET_NAME
```

**Currently no secrets required** for MVP!

---

## Domain Configuration

### DNS Setup for home.helpmecomputing.com

In Cloudflare DNS dashboard:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | home | fivethirty.pages.dev | ✅ Proxied |

Or if using custom domain directly in Pages:
1. Go to Pages project → Custom domains
2. Add `home.helpmecomputing.com`
3. Cloudflare auto-configures DNS

---

## Pre-Flight Checklist

Before starting development, verify:

### Accounts
- [ ] Cloudflare account active
- [ ] `helpmecomputing.com` in Cloudflare
- [ ] GitHub account active

### Local Setup
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Wrangler installed (`wrangler --version`)
- [ ] Wrangler logged in (`wrangler whoami`)
- [ ] Git installed (`git --version`)

### Cloudflare Services
- [ ] D1 database created
- [ ] Database ID noted
- [ ] Workers AI enabled (automatic)
- [ ] Pages ready to create

### External APIs
- [ ] Open Food Facts API tested (curl command above)

---

## Quick Reference Card

| Service | Account Needed | API Key Needed | Free Tier |
|---------|---------------|----------------|-----------|
| Cloudflare Pages | Yes | No (uses login) | Unlimited |
| Cloudflare Workers | Yes | No (uses login) | 100K req/day |
| Cloudflare D1 | Yes | No (uses binding) | 5M reads/day |
| Cloudflare AI | Yes | No (uses binding) | Llama free |
| Cloudflare Access | Yes | No (uses login) | 50 users |
| Open Food Facts | No | No | Unlimited |
| GitHub | Yes | No (OAuth) | Free private repos |

**Total cost: £0/month** 🎉

---

## Troubleshooting

### "Wrangler not authenticated"
```bash
wrangler logout
wrangler login
```

### "D1 database not found"
- Check `database_id` in wrangler.toml matches your actual database
- Run `wrangler d1 list` to see your databases

### "Open Food Facts returns empty"
- Some UK products may not be in database
- App has manual entry fallback
- Try different barcode to test

### "Access denying family members"
- Check email is exactly as typed in policy
- Try logging out and back in
- Check session hasn't expired

---

## Security Notes

1. **Never commit wrangler.toml with secrets** (we don't have any for MVP)
2. **D1 database_id is not secret** - safe to commit
3. **Cloudflare Access protects the entire app** - no additional auth needed
4. **Open Food Facts is public** - no API key to protect

---

## Support Contacts

| Service | Support URL |
|---------|-------------|
| Cloudflare | https://community.cloudflare.com |
| Open Food Facts | https://slack.openfoodfacts.org |
| Wrangler Issues | https://github.com/cloudflare/workers-sdk |

---

**Document Version:** 1.0  
**Last Updated:** December 2024
