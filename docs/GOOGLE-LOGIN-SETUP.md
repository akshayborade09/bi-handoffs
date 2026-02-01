# Google Login Setup Guide

## Implementation Complete

All code for Google OAuth login with NextAuth.js and Supabase has been implemented. Follow the steps below to configure and test.

---

## Next Steps (Required)

### 1. Complete Supabase Setup

**Create Project:**
1. Go to https://supabase.com and sign up/login
2. Create new project (note your database password)
3. Wait for provisioning

**Create Users Table:**
Go to SQL Editor and run:
```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  image text,
  google_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Get API Keys:**
- Go to Project Settings > API
- Copy these values for `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Setup Google OAuth

1. Go to https://console.cloud.google.com
2. Create/select a project
3. Enable Google+ API (APIs & Services > Library)
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Application type: **Web application**
6. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Add production URL later: `https://yourdomain.com/api/auth/callback/google`)
7. Copy `Client ID` and `Client Secret`

### 3. Configure Environment Variables

Edit `.env.local` with your actual values:

```env
# From Google Cloud Console
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret

# From Supabase Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Restart Dev Server

```bash
npm run dev
```

---

## How It Works

### Flow

1. **User visits app** → `Providers.tsx` checks session via `useSession()`
2. **No session** → `LoginModal` appears (full-screen overlay, glassmorphic)
3. **User clicks "Sign in with Google"** → OAuth flow starts
4. **Google auth** → User grants permission
5. **NextAuth callback** → User saved/updated in Supabase `users` table
6. **Session created** → Modal closes, user sees home page
7. **Logout** → Click avatar in Post Sign Up page → `signOut()` → Modal reappears

### Architecture

```
Providers.tsx (SessionProvider)
  └─ AuthGate
       ├─ status === "loading" → Spinner
       ├─ status === "unauthenticated" → LoginModal
       └─ status === "authenticated" → App content
```

### Files Created/Modified

**New files:**
- `src/lib/auth.ts` - NextAuth config with Google provider + Supabase callbacks
- `src/lib/supabase.ts` - Supabase admin & client
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `src/components/LoginModal.tsx` - Login UI with Google button
- `.env.local` - Environment variables (not committed)
- `.env.local.example` - Template for setup

**Modified files:**
- `src/app/Providers.tsx` - Added `SessionProvider` + `AuthGate`
- `src/components/pages/PostSignUpV1.tsx` - Uses `session.user.name`, avatar initials, logout on click

---

## Features

- **Entire app protected** - must sign in to access any page
- **Modal login** - no separate /login route, overlay appears when unauthenticated
- **Glassmorphic UI** - login modal matches dock styling (backdrop-blur, semi-transparent)
- **Session persistence** - JWT stored in httpOnly cookie
- **User data** - stored in Supabase, synced on each login
- **Dynamic user display** - Post Sign Up page shows actual user name
- **Logout** - click avatar to sign out

---

## Testing

1. Make sure `.env.local` has valid credentials
2. Start dev server: `npm run dev`
3. Visit `http://localhost:3000`
4. Login modal should appear (glassmorphic overlay)
5. Click "Sign in with Google"
6. Complete OAuth flow in popup
7. After success: redirected to home, modal closes
8. Check Supabase `users` table - new row created
9. Navigate to Module 1 > Post sign up > Version 1
10. See "Welcome, [Your Name]" with your initials in avatar
11. Click avatar to logout → modal reappears

---

## Troubleshooting

**"Configuration not found" error:**
- Check `.env.local` has all required variables
- Restart dev server after adding env vars

**"Redirect URI mismatch":**
- In Google Cloud Console, make sure redirect URI exactly matches:
  `http://localhost:3000/api/auth/callback/google`

**"Cannot connect to Supabase":**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project is active

**User not saved to database:**
- Check `users` table exists in Supabase
- Verify service role key has write permissions
- Check server logs for errors

---

## Production Deployment

1. Add production URL to Google OAuth redirect URIs
2. Set `NEXTAUTH_URL` to your production domain
3. Update Supabase URL if using a different project
4. Never commit `.env.local` (already in `.gitignore`)
