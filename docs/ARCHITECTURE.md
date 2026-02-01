# Application Architecture with RLS

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   React      │    │  NextAuth    │    │  Supabase    │      │
│  │  Components  │◄──►│   Client     │    │   Client     │      │
│  │              │    │  (Session)   │    │  (Anon Key)  │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                    │                    │              │
└─────────┼────────────────────┼────────────────────┼──────────────┘
          │                    │                    │
          │                    │                    │ (Optional)
          │                    │                    │ Direct queries
          │                    │                    │ + Real-time
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes (Server)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Authentication Middleware (NextAuth)                   │     │
│  │  • Verify JWT token                                     │     │
│  │  • Extract user session                                 │     │
│  └────────────────────┬───────────────────────────────────┘     │
│                       │                                           │
│                       ▼                                           │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Authorization Layer                                    │     │
│  │  • Check if user is authenticated                       │     │
│  │  • Verify permissions                                   │     │
│  │  • Validate input                                       │     │
│  └────────────────────┬───────────────────────────────────┘     │
│                       │                                           │
│                       ▼                                           │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Supabase Admin Client (Service Role)                  │     │
│  │  • Bypasses RLS                                         │     │
│  │  • Full database access                                 │     │
│  │  • Used after auth/authz checks                         │     │
│  └────────────────────┬───────────────────────────────────┘     │
│                       │                                           │
└───────────────────────┼───────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Database (PostgreSQL)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Row Level Security (RLS) Policies                      │     │
│  │  • Defense in depth                                     │     │
│  │  • Safety net for bugs                                  │     │
│  │  • Enforced for anon key                                │     │
│  │  • Bypassed for service role                            │     │
│  └────────────────────┬───────────────────────────────────┘     │
│                       │                                           │
│                       ▼                                           │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Tables                                                 │     │
│  │  ├── users (profiles, auth data)                        │     │
│  │  └── comments (feedback, positions, status)             │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User clicks "Sign in with Google"
   ↓
2. NextAuth redirects to Google OAuth
   ↓
3. User authorizes the application
   ↓
4. Google redirects back with auth code
   ↓
5. NextAuth exchanges code for user info
   ↓
6. NextAuth callback:
   • Checks if user exists in Supabase
   • Creates or updates user record (using service role)
   ↓
7. NextAuth creates JWT session
   ↓
8. User redirected to homepage
   ↓
9. Client stores session cookie
```

## Comment Creation Flow

```
1. User clicks on page (creator mode)
   ↓
2. CommentOverlay captures click coordinates
   ↓
3. CommentTooltip renders input field
   ↓
4. User types comment and submits
   ↓
5. Frontend calls: POST /api/comments
   ↓
6. API Route:
   ├── Extract session (NextAuth)
   ├── Check authentication
   ├── Validate input
   ├── Insert to database (service role)
   └── Return new comment
   ↓
7. Frontend updates state (CommentContext)
   ↓
8. CommentMarker renders on page
```

## Comment Resolution Flow

```
1. User clicks comment marker (commenter mode)
   ↓
2. CommentTooltip shows comment details
   ↓
3. User clicks "Resolve" button
   ↓
4. Frontend calls: PATCH /api/comments/:id
   ↓
5. API Route:
   ├── Extract session
   ├── Check authentication
   ├── Verify comment exists
   ├── Update in database
   └── Return updated comment
   ↓
6. Frontend removes from active state
   ↓
7. Comment moves to "Resolved" history
```

## Data Flow Patterns

### Pattern 1: API Routes (Current/Recommended)

```
React Component
    ↓ fetch('/api/...')
Next.js API Route
    ↓ auth() - check session
Supabase Admin Client
    ↓ service role (bypasses RLS)
PostgreSQL Database
    ↓ RLS policies (safety net)
Data
```

**Pros:**
- ✅ Full control over authorization
- ✅ Server-side validation
- ✅ Hide database structure from client
- ✅ Easy to audit and log

**Cons:**
- ❌ Extra API route needed for each operation
- ❌ No built-in real-time subscriptions

### Pattern 2: Direct Supabase Client (Optional/Advanced)

```
React Component
    ↓ useSupabase()
Supabase Client (anon key)
    ↓ respects RLS
PostgreSQL Database
    ↓ RLS policies (active enforcement)
Data
```

**Pros:**
- ✅ Fewer API routes needed
- ✅ Real-time subscriptions
- ✅ Optimistic updates easier
- ✅ RLS handles authorization

**Cons:**
- ❌ Database structure exposed to client
- ❌ Complex RLS policies needed
- ❌ Harder to implement custom business logic

## Security Layers

### Layer 1: Application (API Routes)
- **What:** NextAuth session verification
- **When:** Every API request
- **How:** `const session = await auth()`
- **Fails:** Return 401 Unauthorized

### Layer 2: Database (RLS)
- **What:** PostgreSQL row-level policies
- **When:** Every database query (with anon key)
- **How:** `CREATE POLICY ... FOR SELECT USING (...)`
- **Fails:** Query returns empty or error

### Defense in Depth

```
Request → Auth Check → Validation → Service Role Query → RLS Safety Net → Data
           (Layer 1)    (Layer 1)    (Bypass RLS)        (Layer 2)
```

Even if Layer 1 has a bug, Layer 2 catches unauthorized access.

## File Organization

```
bi-handoffs/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── comments/
│   │       │   ├── route.ts         # GET, POST
│   │       │   └── [id]/route.ts    # PATCH, DELETE
│   │       └── auth/
│   │           └── [...nextauth]/route.ts
│   ├── lib/
│   │   ├── auth.ts                  # NextAuth config
│   │   └── supabase.ts              # Supabase clients
│   ├── hooks/
│   │   └── useSupabase.ts           # Client-side hook
│   ├── types/
│   │   └── database.ts              # TypeScript types
│   ├── contexts/
│   │   └── CommentContext.tsx       # State management
│   └── components/
│       ├── CommentOverlay.tsx       # Click handling
│       ├── CommentMarker.tsx        # Visual markers
│       └── CommentTooltip.tsx       # Input/display
├── docs/
│   ├── ARCHITECTURE.md              # This file
│   ├── RLS_SETUP.md                 # Complete guide
│   └── RLS_QUICK_REFERENCE.md       # Quick reference
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Database schema
└── RLS_UPDATE_SUMMARY.md            # What changed
```

## Environment Variables

```
# Client-side (public)
NEXT_PUBLIC_SUPABASE_URL          → Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     → Anon key (respects RLS)

# Server-side (secret)
SUPABASE_SERVICE_ROLE_KEY         → Service role (bypasses RLS)
GOOGLE_CLIENT_ID                  → OAuth client ID
GOOGLE_CLIENT_SECRET              → OAuth client secret
NEXTAUTH_SECRET                   → JWT signing secret
NEXTAUTH_URL                      → App URL
```

## Type Flow

```typescript
// Database schema definition
interface Database {
  public: {
    Tables: {
      comments: {
        Row: Comment;        // SELECT
        Insert: CommentInsert; // INSERT
        Update: CommentUpdate; // UPDATE
      };
    };
  };
}

// Typed Supabase client
const supabase = createClient<Database>(url, key);

// Type-safe queries
const { data } = await supabase
  .from('comments')  // ✅ TypeScript knows this table exists
  .select('*')       // ✅ Returns Comment[]
  .single();         // ✅ Returns Comment

// Type-safe inserts
const newComment: CommentInsert = { ... };
await supabase.from('comments').insert(newComment);
```

## Performance Considerations

### Database Indexes

```sql
-- Page + resolved queries (most common)
CREATE INDEX idx_comments_page_resolved ON comments(page_id, resolved);

-- Time-based queries
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- User-based queries
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

### Caching Strategy

- **Session:** Cached in JWT (verified each request)
- **Comments:** Fetched per page (no global cache)
- **Real-time:** Optional subscriptions for live updates

### Load Times

- **Initial page load:** < 3s
- **Comment fetch:** < 1s
- **Comment create:** < 500ms
- **Comment update:** < 500ms

## Monitoring & Observability

### What to Monitor

1. **Authentication:**
   - Sign-in success rate
   - Failed auth attempts
   - Session duration

2. **API Performance:**
   - Response times by endpoint
   - Error rates (4xx, 5xx)
   - Request volume

3. **Database:**
   - Query performance
   - RLS policy checks
   - Connection pool usage

4. **User Actions:**
   - Comments created per day
   - Comments resolved per day
   - Active users per day

### Supabase Dashboard

- **Logs:** Real-time query logs
- **API:** Request metrics
- **Auth:** User sessions
- **Database:** Table statistics

## Scaling Considerations

### Current Capacity

- Users: Unlimited (Google OAuth)
- Comments: Millions (PostgreSQL)
- Concurrent users: Hundreds (Supabase free tier)

### When to Scale

- **Upgrade Supabase plan:**
  - > 100 concurrent users
  - > 1GB database
  - Need dedicated resources

- **Add caching:**
  - Redis for session data
  - Edge caching for static assets

- **Optimize queries:**
  - Add more indexes
  - Use database functions
  - Implement pagination

## Future Enhancements

### Phase 1: Real-time
- Add Supabase real-time subscriptions
- Live comment updates without refresh
- Online presence indicators

### Phase 2: Collaboration
- Comment threading (replies)
- @mentions and notifications
- Comment reactions (emoji)

### Phase 3: Advanced Features
- Comment attachments (images)
- Version history
- Export comments to CSV/PDF
- Analytics dashboard

## References

- [Supabase Architecture](https://supabase.com/docs/guides/platform/architecture)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [NextAuth.js Architecture](https://next-auth.js.org/getting-started/introduction)
