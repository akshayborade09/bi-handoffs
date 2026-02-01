# RLS Quick Reference Card

## 🔑 Authentication in API Routes

```typescript
// ✅ Always check auth first
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Then use supabaseAdmin safely
const { data } = await supabaseAdmin.from('comments').select('*');
```

## 🗄️ Supabase Clients

### Server-Side (API Routes)

```typescript
import { supabaseAdmin } from '@/lib/supabase';

// Service role - bypasses RLS
// ⚠️ MUST verify auth before using
const { data } = await supabaseAdmin
  .from('comments')
  .select('*');
```

### Client-Side (React Components)

```typescript
import { useSupabase } from '@/hooks/useSupabase';

function MyComponent() {
  const supabase = useSupabase(); // Respects RLS
  
  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*');
  };
}
```

## 📡 API Endpoints

```typescript
// Fetch comments
GET /api/comments?pageId=home&resolved=false

// Create comment
POST /api/comments
{ pageId, positionX, positionY, content }

// Update comment
PATCH /api/comments/:id
{ content?, resolved?, position_x?, position_y? }

// Delete comment (owner only)
DELETE /api/comments/:id
```

## 🎨 TypeScript Types

```typescript
import type { Comment, CommentInsert, CommentUpdate } from '@/types/database';

// Type-safe insert
const newComment: CommentInsert = {
  user_id: session.user.id,
  user_name: session.user.name,
  page_id: 'home',
  content: 'Hello',
  position_x: 100,
  position_y: 200,
};

// Type-safe update
const updates: CommentUpdate = {
  resolved: true,
  resolved_at: new Date().toISOString(),
};
```

## 🔐 RLS Policies Summary

| Table | Action | Policy |
|-------|--------|--------|
| users | SELECT | Everyone can read |
| users | INSERT/UPDATE/DELETE | Service role only |
| comments | SELECT | Everyone can read |
| comments | INSERT | Authenticated users |
| comments | UPDATE | Authenticated users (collaborative) |
| comments | DELETE | Comment owner only |

## 🚦 Security Checklist

Before deploying:

- [ ] All API routes check authentication
- [ ] Service role key is server-side only (never exposed to client)
- [ ] RLS policies are enabled on all tables
- [ ] Input validation in place
- [ ] Error messages don't leak sensitive info

## 🐛 Common Issues

### Unauthorized Error
```typescript
// ❌ Forgot to check auth
const { data } = await supabaseAdmin.from('comments').select('*');

// ✅ Check auth first
const session = await auth();
if (!session) return unauthorized();
const { data } = await supabaseAdmin.from('comments').select('*');
```

### RLS Blocking Query
```typescript
// If using anon client and RLS is blocking:
// 1. Check if user is authenticated
// 2. Verify RLS policies allow the operation
// 3. Or use supabaseAdmin with auth check
```

### Type Errors
```typescript
// ❌ No type safety
const data = await supabaseAdmin.from('comments').select('*');

// ✅ Full type safety
import type { Database } from '@/types/database';
const supabaseAdmin = createClient<Database>(url, key);
```

## 📚 Learn More

- [Full Documentation](./RLS_SETUP.md)
- [Migration Summary](../RLS_UPDATE_SUMMARY.md)
- [Database Types](../src/types/database.ts)

---

💡 **Pro Tip**: Use API routes for most operations. Only use direct Supabase client when you need real-time subscriptions or want RLS to actively enforce permissions.
