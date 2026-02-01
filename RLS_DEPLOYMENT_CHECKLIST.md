# RLS Deployment Checklist ✅

Use this checklist to ensure RLS is properly deployed and working.

## Pre-Deployment

### Database Setup
- [ ] Copy SQL from `supabase/migrations/001_initial_schema.sql`
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Paste and execute the migration
- [ ] Verify no errors in execution log
- [ ] Check that both `users` and `comments` tables exist

### Verify RLS Policies
Run this in Supabase SQL Editor:

```sql
-- Should show 1 policy for users, 4 policies for comments
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'comments')
ORDER BY tablename, policyname;
```

Expected output:
```
users     | Allow read access to all users                    | Yes | {public} | SELECT
comments  | Allow authenticated users to read comments        | Yes | {public} | SELECT
comments  | Allow authenticated users to create comments      | Yes | {public} | INSERT
comments  | Allow authenticated users to update comments      | Yes | {public} | UPDATE
comments  | Allow users to delete own comments                | Yes | {public} | DELETE
```

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] `GOOGLE_CLIENT_ID` is set
- [ ] `GOOGLE_CLIENT_SECRET` is set
- [ ] `NEXTAUTH_SECRET` is set
- [ ] `NEXTAUTH_URL` is set

### Code Changes Verified
- [ ] `src/lib/supabase.ts` updated with types
- [ ] `src/app/api/comments/route.ts` has auth check on GET
- [ ] `src/app/api/comments/[id]/route.ts` has DELETE endpoint
- [ ] `src/hooks/useSupabase.ts` exists
- [ ] `src/types/database.ts` exists
- [ ] No linter errors (`npm run lint`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)

## Testing

### Authentication Flow
- [ ] Visit http://localhost:3000
- [ ] Click "Sign in with Google"
- [ ] Successfully redirected to Google
- [ ] Successfully redirected back to app
- [ ] User profile shows in left dock
- [ ] User data saved to `users` table in Supabase

### Comment Creation
- [ ] Click on page to create comment
- [ ] Enter comment text
- [ ] Click submit or press Cmd/Ctrl+Enter
- [ ] Comment appears on screen
- [ ] Comment visible in Supabase `comments` table
- [ ] Refresh page - comment persists
- [ ] Comment shows correct user name and avatar

### Comment Updates
- [ ] Click on existing comment marker
- [ ] Click edit icon
- [ ] Modify text and save
- [ ] Changes persist
- [ ] Click resolve button
- [ ] Comment disappears from view
- [ ] Check resolved comments modal - appears there

### Comment Positioning
- [ ] Create comment at different positions
- [ ] Positions stored correctly (check Supabase table)
- [ ] Drag comment to new position (if implemented)
- [ ] Position updates in database

### Page Isolation
- [ ] Create comment on home page
- [ ] Navigate to module page
- [ ] Home page comments don't show on module page
- [ ] Module page comments isolated from home

### Multi-User (if possible)
- [ ] Sign in with different Google account
- [ ] See comments from first user
- [ ] Create comment as second user
- [ ] Both users' comments visible
- [ ] Try to delete first user's comment as second user
- [ ] Should fail (owner-only delete)

### Error Handling
- [ ] Sign out
- [ ] Try to access `/api/comments` (should get 401)
- [ ] Sign back in
- [ ] API access restored

## API Testing

### Using curl or Postman

```bash
# Get session cookie first by signing in through browser

# Test GET comments
curl http://localhost:3000/api/comments?pageId=home \
  -H "Cookie: your-session-cookie"

# Test POST comment
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"pageId":"home","positionX":100,"positionY":200,"content":"Test"}'

# Test PATCH comment
curl -X PATCH http://localhost:3000/api/comments/COMMENT_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"resolved":true}'

# Test DELETE comment
curl -X DELETE http://localhost:3000/api/comments/COMMENT_ID \
  -H "Cookie: your-session-cookie"
```

## Browser Console Checks

Open browser console and check:
- [ ] No 401 Unauthorized errors
- [ ] No 403 Forbidden errors
- [ ] No 500 Internal Server errors
- [ ] No RLS policy violation errors
- [ ] Session data logged correctly

## Performance

- [ ] Page loads within 3 seconds
- [ ] Comments load within 1 second
- [ ] Comment creation is instant (<500ms)
- [ ] Comment updates are instant (<500ms)
- [ ] No memory leaks (check DevTools Memory tab)

## Supabase Dashboard

### Check Table Data
- [ ] Users table has entries
- [ ] Comments table has entries
- [ ] Timestamps are correct
- [ ] Position coordinates are reasonable
- [ ] Resolved flags work correctly

### Check RLS Status
- [ ] `users` table shows RLS enabled
- [ ] `comments` table shows RLS enabled
- [ ] Policies are active (green checkmark)

### Check Logs
- [ ] No RLS policy violation errors
- [ ] No permission denied errors
- [ ] API calls appear in logs

## Production Deployment

### Before Going Live
- [ ] Change `NEXTAUTH_URL` to production URL
- [ ] Update Google OAuth redirect URIs
- [ ] Test on staging environment first
- [ ] Backup database
- [ ] Document rollback plan

### After Deployment
- [ ] Test authentication in production
- [ ] Test comment creation in production
- [ ] Monitor Supabase logs for errors
- [ ] Check error tracking (Sentry, etc.)
- [ ] Monitor API response times

## Rollback Plan

If something goes wrong:

```sql
-- Disable RLS temporarily (EMERGENCY ONLY)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Re-enable when fixed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

## Documentation Review

- [ ] Read `RLS_UPDATE_SUMMARY.md`
- [ ] Read `docs/RLS_SETUP.md`
- [ ] Review `docs/RLS_QUICK_REFERENCE.md`
- [ ] Understand security model
- [ ] Know how to troubleshoot

## Sign-Off

- [ ] Backend developer reviewed changes
- [ ] Frontend developer tested UI
- [ ] Security review completed
- [ ] Documentation is complete
- [ ] Team trained on RLS concepts
- [ ] Monitoring set up
- [ ] Ready for production

---

**Date**: _______________  
**Reviewer**: _______________  
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete | ⬜ Blocked

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Check linting
npm run lint

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Start production server
npm start
```

## Support Resources

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [NextAuth.js Docs](https://next-auth.js.org/)
- Internal: `docs/RLS_SETUP.md`
- Quick Ref: `docs/RLS_QUICK_REFERENCE.md`
