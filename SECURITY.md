# Security Configuration — Contractor Verified CRM

## 🔐 Security Checklist

### ✅ Implemented

1. **Row Level Security (RLS)** — All tables have RLS enabled
   - Service role: Full access (backend only)
   - Public: Read-only access to active, verified contractors
   - No anonymous write access

2. **Input Validation** — CHECK constraints on all enum fields
   - Status fields, verification levels, urgency, etc.

3. **UUID Primary Keys** — No sequential IDs exposed (prevents enumeration)

4. **Audit Trail** — `verification_log` table tracks all document actions

5. **Cascading Deletes** — Proper foreign key constraints

---

## 🚨 Action Required Before Going Live

### 1. Environment Variables (CRITICAL)
```bash
# .env.local — NEVER commit this file
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # Public, safe for client
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # NEVER expose to client
```

**Rules:**
- `NEXT_PUBLIC_*` variables are exposed to the browser — only anon key
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — use only in API routes

### 2. API Route Protection
All `/api/*` routes should:
```typescript
// At top of each API route
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Server-only
)
```

### 3. Admin Authentication (TO DO)
Currently no auth. Before public launch, implement:
- [ ] Supabase Auth for admin login
- [ ] RLS policies tied to auth.uid()
- [ ] Protected admin routes

**Quick fix for now:** Add basic auth to admin routes:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  // Check against ADMIN_PASSWORD env var
}
```

### 4. CORS Configuration
In `next.config.ts`:
```typescript
headers: async () => [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://contractorverified.com' },
      { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, DELETE' },
    ],
  },
],
```

### 5. Rate Limiting
Add rate limiting to prevent abuse:
```typescript
// Use Vercel's built-in or upstash/ratelimit
import { Ratelimit } from '@upstash/ratelimit'
```

---

## 🔒 Supabase Dashboard Settings

After creating your Supabase project:

1. **Settings → API**
   - Copy anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy service role key → `SUPABASE_SERVICE_ROLE_KEY`
   - Copy project URL → `NEXT_PUBLIC_SUPABASE_URL`

2. **Settings → Auth**
   - Disable email confirmations (for admin-only use)
   - Set site URL to your production domain

3. **Settings → Database**
   - Enable SSL enforcement
   - Set connection pooling mode to "Transaction"

4. **Settings → Storage** (if using file uploads)
   - Create `documents` bucket
   - Set bucket to private
   - Add RLS policy: only service role can upload

---

## 🛡️ Cloudflare Configuration

1. **SSL/TLS**
   - Full (strict) mode
   - Always Use HTTPS: ON
   - Automatic HTTPS Rewrites: ON

2. **Security**
   - Security Level: High
   - Bot Fight Mode: ON
   - Browser Integrity Check: ON

3. **Firewall Rules**
   - Block countries you don't serve
   - Challenge suspicious traffic

4. **Page Rules**
   - Cache static assets
   - Bypass cache for /api/*

---

## 📋 Pre-Launch Checklist

- [ ] Remove any hardcoded credentials from code
- [ ] Set all environment variables in Vercel
- [ ] Enable RLS on all Supabase tables (done in migration)
- [ ] Test all API routes return 401 without auth
- [ ] Enable Cloudflare SSL
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Enable Supabase database backups
- [ ] Document admin credentials securely (not in repo)

---

## 🚫 Known Security Gaps (Accept or Fix)

1. **No admin auth yet** — Anyone with URL can access admin pages
   - **Fix:** Add Supabase Auth before public launch
   - **Workaround:** Use Vercel password protection ($150/mo)

2. **API routes not rate limited** — Could be abused
   - **Fix:** Add Upstash rate limiting

3. **No input sanitization** — Trusting frontend validation
   - **Fix:** Add Zod validation to all API routes

4. **File uploads go to local filesystem** — Won't persist on Vercel
   - **Fix:** Migrate to Supabase Storage

---

## 🆘 If Compromised

1. Rotate Supabase service role key immediately
2. Check `verification_log` for unauthorized actions
3. Revoke all user sessions in Supabase Auth
4. Review Vercel deployment logs
5. Enable Cloudflare Under Attack mode
