# Comments Feature Setup Checklist

## 1. Create Supabase Comments Table

**IMPORTANT:** You MUST run this SQL in your Supabase SQL Editor before the comments feature will work.

1. Go to your Supabase project: https://supabase.com
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste this SQL:

```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  user_name text not null,
  user_email text not null,
  user_image text,
  page_id text not null,
  position_x integer not null,
  position_y integer not null,
  content text not null,
  resolved boolean default false,
  resolved_at timestamptz,
  resolved_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for efficient querying
create index comments_page_id_idx on comments(page_id);
create index comments_resolved_idx on comments(resolved);
```

5. Click "Run" or press Ctrl/Cmd + Enter
6. You should see "Success. No rows returned"

## 2. Verify Table Creation

Run this query to verify the table was created:

```sql
select * from comments;
```

You should see an empty table with the correct columns.

## 3. Test the Feature

1. **Restart your dev server** (important after DB changes):
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Switch to Commenter Mode:**
   - Click the chat icon in the Mode toggle at the bottom of the dock

3. **Add a Test Comment:**
   - Click anywhere on the page (not on the dock)
   - A blue marker should appear
   - Type a comment and press Cmd/Ctrl+Enter or click Send

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - You should see logs like:
     - "Comment updated in DB: {...}"
     - "Comments after resolve: X"

5. **Resolve the Comment:**
   - Click the comment marker
   - Click "Resolve" button
   - Comment should disappear from page
   - Success toast should show

6. **View Resolved Comments:**
   - Click the history icon next to "Mode" in the dock
   - Modal should open showing your resolved comment

## Troubleshooting

### Issue: Comments don't disappear after resolving

**Check:**
1. Open browser console (F12 → Console)
2. Look for error messages
3. You should see logs like:
   ```
   Resolving comment: xxx-xxx-xxx resolved: true
   Comment updated in DB: {...}
   Removing comment from active state
   Comments after resolve: 0
   ```

**If you see errors:**
- "Failed to fetch" → Check if dev server is running
- "Unauthorized" → Sign out and sign in again
- "Table doesn't exist" → Run the SQL above in Supabase

### Issue: Don't see resolved comments in modal

**Check:**
1. Open the resolved comments modal
2. Open browser console
3. Look for logs like:
   ```
   Fetching resolved comments...
   Fetching resolved for page: home
   Got X resolved comments for home
   Total resolved comments: X
   ```

**If you see 0 comments:**
- The table might be empty (resolve a comment first)
- Check Supabase dashboard → Table Editor → comments table
- Verify there are rows with `resolved = true`

### Issue: API returns 500 errors

**Check Supabase credentials in `.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Restart dev server after changing env vars.

## Quick Test Query

Run this in Supabase SQL Editor to see your comments:

```sql
-- See all comments
select 
  id,
  user_name,
  page_id,
  content,
  resolved,
  created_at,
  resolved_at
from comments
order by created_at desc;
```

## Need Help?

1. Check browser console for error messages
2. Check terminal for API errors
3. Verify Supabase table exists
4. Verify .env.local has correct credentials
5. Restart dev server after any changes
