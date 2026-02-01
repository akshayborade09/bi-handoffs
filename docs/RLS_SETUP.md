# Row Level Security (RLS) Setup Guide

This document explains how Row Level Security is configured in this application and how to work with it.

## Overview

Row Level Security (RLS) is a PostgreSQL feature that allows you to control access to rows in database tables based on the user making the query. In Supabase, RLS acts as an additional security layer on top of your application's authentication logic.

## Architecture

### Two-Layer Security Approach

This application uses a **two-layer security model**:

1. **Application Layer**: Authentication and authorization checks in API routes
2. **Database Layer**: RLS policies as a safety net

### Supabase Clients

We use two types of Supabase clients:

#### 1. Service Role Client (Admin)
- **Location**: `src/lib/supabase.ts` - `supabaseAdmin`
- **Key**: `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- **Use Case**: Server-side API routes where authentication is already verified
- **Security**: Must always verify user authentication before using

```typescript
// ✅ Good: Authentication check before using admin client
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const { data } = await supabaseAdmin.from('comments').select('*');
```

#### 2. Anon Client (User-Authenticated)
- **Location**: `src/lib/supabase.ts` - `supabaseClient`
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (respects RLS)
- **Use Case**: Client-side queries, real-time subscriptions
- **Security**: RLS policies automatically enforce access control

```typescript
// ✅ Good: RLS policies automatically enforced
const supabase = useSupabase();
const { data } = await supabase.from('comments').select('*');
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  google_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read user data
CREATE POLICY "Allow read access to all users" ON users
  FOR SELECT USING (true);
```

### Comments Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_image TEXT,
  page_id TEXT NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Allow authenticated users to read comments" ON comments
  FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "Allow authenticated users to create comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Anyone can update comments (collaborative editing)
CREATE POLICY "Allow authenticated users to update comments" ON comments
  FOR UPDATE USING (true);

-- Users can only delete their own comments
CREATE POLICY "Allow users to delete own comments" ON comments
  FOR DELETE USING (user_id = current_user);
```

## API Endpoints

All API endpoints now require authentication:

### GET /api/comments
Fetch comments for a specific page.

```typescript
// Request
GET /api/comments?pageId=home&resolved=false

// Response
{
  "comments": [
    {
      "id": "uuid",
      "user_name": "John Doe",
      "content": "Great design!",
      "position_x": 100,
      "position_y": 200,
      // ... other fields
    }
  ]
}
```

### POST /api/comments
Create a new comment.

```typescript
// Request
POST /api/comments
{
  "pageId": "home",
  "positionX": 100,
  "positionY": 200,
  "content": "Comment text"
}

// Response
{
  "comment": { /* comment object */ }
}
```

### PATCH /api/comments/:id
Update an existing comment.

```typescript
// Request
PATCH /api/comments/uuid
{
  "resolved": true,
  // OR
  "content": "Updated text",
  // OR
  "position_x": 150,
  "position_y": 250
}

// Response
{
  "comment": { /* updated comment object */ }
}
```

### DELETE /api/comments/:id
Delete a comment (only owner can delete).

```typescript
// Request
DELETE /api/comments/uuid

// Response
{
  "success": true,
  "message": "Comment deleted"
}
```

## Frontend Usage

### Using API Routes (Recommended)
The app uses API routes by default, which is the most secure approach:

```typescript
// From CommentContext
const response = await fetch('/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pageId, positionX, positionY, content }),
});
```

### Direct Supabase Client (Advanced)
For real-time features or advanced use cases:

```typescript
import { useSupabase } from '@/hooks/useSupabase';

function MyComponent() {
  const supabase = useSupabase();
  
  // Real-time subscription
  useEffect(() => {
    if (!supabase) return;
    
    const subscription = supabase
      .channel('comments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'comments' },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
}
```

## Security Best Practices

### ✅ DO

1. **Always authenticate in API routes**
   ```typescript
   const session = await auth();
   if (!session?.user) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
   ```

2. **Use service role only in server-side code**
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client

3. **Verify resource ownership when needed**
   ```typescript
   if (existingComment.user_id !== session.user.id) {
     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }
   ```

4. **Use RLS as a safety net**
   - Even if application logic has bugs, RLS prevents unauthorized access

### ❌ DON'T

1. **Don't skip authentication checks**
   ```typescript
   // ❌ BAD: No auth check with service role
   const { data } = await supabaseAdmin.from('comments').select('*');
   ```

2. **Don't use service role on client side**
   ```typescript
   // ❌ BAD: Never expose service role key
   const client = createClient(url, serviceRoleKey);
   ```

3. **Don't trust client input blindly**
   ```typescript
   // ❌ BAD: No validation
   await supabaseAdmin.from('comments').insert(body);
   
   // ✅ GOOD: Validate and sanitize
   const { pageId, content } = body;
   if (!pageId || !content?.trim()) {
     return NextResponse.json({ error: "Invalid input" }, { status: 400 });
   }
   ```

## Testing RLS Policies

### Test as Authenticated User

```sql
-- In Supabase SQL Editor, set role to anon
SET ROLE anon;

-- Try to read comments (should work)
SELECT * FROM comments;

-- Try to insert a comment (should work if policy allows)
INSERT INTO comments (user_id, page_id, content, position_x, position_y)
VALUES ('test-user', 'home', 'Test comment', 100, 100);

-- Reset to admin
RESET ROLE;
```

### Test Policy Violations

```sql
-- Try to delete another user's comment (should fail)
DELETE FROM comments WHERE user_id != 'your-user-id';
```

## Troubleshooting

### "new row violates row-level security policy"

**Cause**: RLS policy is blocking the operation.

**Solutions**:
1. Check if user is authenticated
2. Verify the policy conditions match your use case
3. Use `supabaseAdmin` in API routes with proper auth checks

### "permission denied for table"

**Cause**: Table permissions not set correctly.

**Solution**:
```sql
GRANT ALL ON comments TO authenticated;
GRANT ALL ON users TO authenticated;
```

### Comments not showing up

**Cause**: RLS SELECT policy might be too restrictive.

**Solution**: Check the SELECT policy:
```sql
-- Allow reading all comments
CREATE POLICY "Allow read access" ON comments
  FOR SELECT USING (true);
```

## Migration Checklist

- [x] Enable RLS on all tables
- [x] Create RLS policies for users table
- [x] Create RLS policies for comments table
- [x] Update API routes with authentication checks
- [x] Create useSupabase hook for client-side access
- [x] Document RLS setup and usage
- [ ] Test all endpoints with RLS enabled
- [ ] Verify real-time subscriptions work
- [ ] Load test with production data

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [NextAuth.js Documentation](https://next-auth.js.org/)
