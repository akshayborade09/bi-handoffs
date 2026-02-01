# Database Verification - Comments Feature

## ✅ Database Schema

All comment data is stored in the `comments` table in Supabase with the following structure:

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

-- Indexes for performance
create index comments_page_id_idx on comments(page_id);
create index comments_resolved_idx on comments(resolved);
```

---

## ✅ All Operations Are Database-Backed

### 1. **Create Comment** ✅
- **API:** `POST /api/comments`
- **Database:** Inserts new row with all user data, position, and content
- **File:** `src/app/api/comments/route.ts` (lines 45-91)
- **Fields saved:**
  - `user_id`, `user_name`, `user_email`, `user_image`
  - `page_id`
  - `position_x`, `position_y` (initial click position)
  - `content` (comment text)
  - `resolved` (defaults to `false`)
  - `created_at` (auto-generated timestamp)

### 2. **Fetch Comments** ✅
- **API:** `GET /api/comments?pageId=home&resolved=false`
- **Database:** Queries comments table filtered by page and resolved status
- **File:** `src/app/api/comments/route.ts` (lines 6-41)
- **Filters:**
  - By `page_id` (required)
  - By `resolved` status (optional: true/false)
  - Orders by `created_at` descending

### 3. **Update Comment Position (Drag & Drop)** ✅
- **API:** `PATCH /api/comments/:id`
- **Database:** Updates `position_x`, `position_y`, `updated_at`
- **File:** `src/app/api/comments/[id]/route.ts` (lines 49-55)
- **When:** User drags comment marker to new location
- **Fields updated:**
  - `position_x` (rounded to integer)
  - `position_y` (rounded to integer)
  - `updated_at` (current timestamp)

### 4. **Edit Comment Content** ✅
- **API:** `PATCH /api/comments/:id`
- **Database:** Updates `content`, `updated_at`
- **File:** `src/app/api/comments/[id]/route.ts` (lines 45-47)
- **When:** User clicks edit icon and saves changes
- **Fields updated:**
  - `content` (trimmed text)
  - `updated_at` (current timestamp)

### 5. **Resolve Comment** ✅
- **API:** `PATCH /api/comments/:id`
- **Database:** Updates `resolved`, `resolved_at`, `resolved_by`, `updated_at`
- **File:** `src/app/api/comments/[id]/route.ts` (lines 34-42)
- **When:** User clicks "Resolve" button
- **Fields updated:**
  - `resolved` = `true`
  - `resolved_at` (current timestamp)
  - `resolved_by` (user email or name)
  - `updated_at` (current timestamp)

### 6. **Reopen Comment (Unresolve)** ✅
- **API:** `PATCH /api/comments/:id`
- **Database:** Updates `resolved`, clears `resolved_at` and `resolved_by`, updates `updated_at`
- **File:** `src/app/api/comments/[id]/route.ts` (lines 34-42)
- **When:** User clicks "Reopen" button in modal
- **Fields updated:**
  - `resolved` = `false`
  - `resolved_at` = `null`
  - `resolved_by` = `null`
  - `updated_at` (current timestamp)

---

## ✅ Data Integrity Features

### Authentication Required
- All write operations require authenticated session
- User identity (`user_id`, `user_name`, `user_email`) stored with each comment
- Prevents anonymous or unauthorized comments

### Automatic Timestamps
- `created_at` - Set once when comment is created
- `updated_at` - Updated on every modification
- `resolved_at` - Set when resolved, cleared when reopened

### Data Validation
- All required fields validated before insert/update
- Content is trimmed to remove whitespace
- Position coordinates rounded to integers
- Empty comments not allowed

### Indexes for Performance
- `comments_page_id_idx` - Fast filtering by page
- `comments_resolved_idx` - Fast filtering by status

---

## 🔍 Verification SQL Queries

Run these in Supabase SQL Editor to verify everything is working:

### 1. Check All Comments
```sql
SELECT 
  id,
  user_name,
  page_id,
  position_x,
  position_y,
  SUBSTRING(content, 1, 50) as content_preview,
  resolved,
  created_at,
  resolved_at,
  resolved_by
FROM comments
ORDER BY created_at DESC;
```

### 2. Check Unresolved Comments by Page
```sql
SELECT 
  page_id,
  COUNT(*) as unresolved_count,
  STRING_AGG(DISTINCT user_name, ', ') as commenters
FROM comments
WHERE resolved = false
GROUP BY page_id;
```

### 3. Check Resolved Comments by Page
```sql
SELECT 
  page_id,
  COUNT(*) as resolved_count,
  STRING_AGG(DISTINCT resolved_by, ', ') as resolved_by_users
FROM comments
WHERE resolved = true
GROUP BY page_id;
```

### 4. Check Comment Activity Timeline
```sql
SELECT 
  user_name,
  page_id,
  SUBSTRING(content, 1, 30) as content,
  CASE 
    WHEN resolved THEN 'Resolved'
    ELSE 'Active'
  END as status,
  created_at,
  resolved_at
FROM comments
ORDER BY 
  COALESCE(resolved_at, created_at) DESC
LIMIT 20;
```

### 5. Verify Position Updates (Drag History)
```sql
SELECT 
  id,
  user_name,
  position_x,
  position_y,
  created_at,
  updated_at,
  CASE 
    WHEN created_at != updated_at THEN 'Position Updated'
    ELSE 'Original Position'
  END as position_status
FROM comments
WHERE updated_at > created_at
ORDER BY updated_at DESC;
```

### 6. Check Data Integrity
```sql
-- Verify no comments with invalid data
SELECT 
  COUNT(*) as total_comments,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as missing_user_id,
  COUNT(CASE WHEN page_id IS NULL THEN 1 END) as missing_page_id,
  COUNT(CASE WHEN position_x IS NULL THEN 1 END) as missing_position_x,
  COUNT(CASE WHEN position_y IS NULL THEN 1 END) as missing_position_y,
  COUNT(CASE WHEN content IS NULL OR content = '' THEN 1 END) as empty_content,
  COUNT(CASE WHEN resolved = true AND resolved_at IS NULL THEN 1 END) as resolved_missing_timestamp,
  COUNT(CASE WHEN resolved = false AND resolved_at IS NOT NULL THEN 1 END) as unresolved_with_timestamp
FROM comments;
```

---

## 🧪 Testing Checklist

Use this checklist to verify all database operations:

### Create Comment
- [ ] Add a comment on the page
- [ ] Run SQL: `SELECT * FROM comments ORDER BY created_at DESC LIMIT 1;`
- [ ] Verify all fields populated correctly
- [ ] Check `user_id`, `user_name`, `user_email`, `user_image`
- [ ] Check `position_x`, `position_y` match where you clicked
- [ ] Check `content` matches what you typed
- [ ] Check `resolved = false`
- [ ] Check `created_at` is recent

### Drag Comment (Update Position)
- [ ] Drag a comment to new location
- [ ] Run SQL: `SELECT id, position_x, position_y, created_at, updated_at FROM comments WHERE id = 'YOUR_COMMENT_ID';`
- [ ] Verify `position_x`, `position_y` changed
- [ ] Verify `updated_at` is more recent than `created_at`

### Edit Comment
- [ ] Click edit icon on a comment
- [ ] Change the text and save
- [ ] Run SQL: `SELECT id, content, updated_at FROM comments WHERE id = 'YOUR_COMMENT_ID';`
- [ ] Verify `content` updated
- [ ] Verify `updated_at` changed

### Resolve Comment
- [ ] Click "Resolve" on a comment
- [ ] Run SQL: `SELECT id, resolved, resolved_at, resolved_by FROM comments WHERE id = 'YOUR_COMMENT_ID';`
- [ ] Verify `resolved = true`
- [ ] Verify `resolved_at` is set
- [ ] Verify `resolved_by` is your email/name

### Reopen Comment
- [ ] Click "Reopen" on a resolved comment
- [ ] Run SQL: `SELECT id, resolved, resolved_at, resolved_by FROM comments WHERE id = 'YOUR_COMMENT_ID';`
- [ ] Verify `resolved = false`
- [ ] Verify `resolved_at = NULL`
- [ ] Verify `resolved_by = NULL`

### Fetch Comments (API)
- [ ] Switch to commenter mode
- [ ] Open browser console
- [ ] Check network tab for `/api/comments?pageId=...`
- [ ] Verify response contains correct comments
- [ ] Change page and verify comments reload

---

## 🚨 Common Issues & Solutions

### Issue: Comments not saving
**Check:**
1. Browser console for errors
2. Terminal for API errors
3. Supabase credentials in `.env.local`
4. Run: `SELECT COUNT(*) FROM comments;` in Supabase

**Solution:**
- Verify table exists
- Check credentials are correct
- Restart dev server

### Issue: Position not updating after drag
**Check:**
1. Browser console for `"Drag ended. New position: X, Y"`
2. Run: `SELECT id, position_x, position_y, updated_at FROM comments ORDER BY updated_at DESC LIMIT 1;`

**Solution:**
- Fixed in `CommentMarker.tsx` with proper position calculation
- Should now save correct viewport + scroll position

### Issue: Resolved comments still visible
**Check:**
1. Browser console for `"Removing comment from active state"`
2. Run: `SELECT id, resolved FROM comments WHERE id = 'YOUR_COMMENT_ID';`

**Solution:**
- Verify `resolved = true` in database
- Check context state update in `CommentContext.tsx`
- Refresh page to reload from database

### Issue: Edited content not saving
**Check:**
1. Browser console for API call logs
2. Run: `SELECT id, content, updated_at FROM comments WHERE id = 'YOUR_COMMENT_ID';`

**Solution:**
- Verify API route handles `content` field
- Check `CommentTooltip.tsx` and `ResolvedComments.tsx` call API correctly

---

## 📊 Database Health Check

Run this comprehensive query to check overall database health:

```sql
WITH stats AS (
  SELECT 
    COUNT(*) as total_comments,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT page_id) as pages_with_comments,
    COUNT(CASE WHEN resolved = false THEN 1 END) as active_comments,
    COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_comments,
    MIN(created_at) as first_comment,
    MAX(created_at) as latest_comment,
    AVG(EXTRACT(EPOCH FROM (COALESCE(resolved_at, NOW()) - created_at))) / 3600 as avg_hours_to_resolve
  FROM comments
)
SELECT 
  total_comments,
  unique_users,
  pages_with_comments,
  active_comments,
  resolved_comments,
  ROUND((resolved_comments::numeric / NULLIF(total_comments, 0) * 100), 2) as resolution_rate_percent,
  first_comment::date as first_comment_date,
  latest_comment::date as latest_comment_date,
  ROUND(avg_hours_to_resolve::numeric, 2) as avg_hours_to_resolve
FROM stats;
```

---

## ✅ Conclusion

**All comment operations are properly backed by the database:**

1. ✅ Comments are created with full user context
2. ✅ Positions are updated when dragged
3. ✅ Content can be edited and saved
4. ✅ Comments can be resolved with timestamps
5. ✅ Resolved comments can be reopened
6. ✅ All changes persist across sessions
7. ✅ Data integrity is maintained
8. ✅ Performance is optimized with indexes

**No data is lost** - everything is stored in Supabase PostgreSQL database.
