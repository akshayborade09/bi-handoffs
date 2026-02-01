-- ================================================
-- COMMENTS DATABASE VERIFICATION QUERIES
-- ================================================
-- Run these queries in Supabase SQL Editor to verify
-- all comment operations are working correctly
-- ================================================

-- 1. CHECK TABLE EXISTS AND STRUCTURE
-- ================================================
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;


-- 2. VIEW ALL COMMENTS (MOST RECENT FIRST)
-- ================================================
SELECT 
    id,
    user_name,
    user_email,
    page_id,
    position_x,
    position_y,
    SUBSTRING(content, 1, 50) as content_preview,
    resolved,
    resolved_by,
    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created,
    TO_CHAR(resolved_at, 'YYYY-MM-DD HH24:MI:SS') as resolved,
    TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
FROM comments
ORDER BY created_at DESC
LIMIT 20;


-- 3. COUNT COMMENTS BY PAGE AND STATUS
-- ================================================
SELECT 
    page_id,
    COUNT(*) as total_comments,
    COUNT(CASE WHEN resolved = false THEN 1 END) as active_comments,
    COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_comments,
    COUNT(DISTINCT user_id) as unique_commenters
FROM comments
GROUP BY page_id
ORDER BY total_comments DESC;


-- 4. CHECK RECENT POSITION UPDATES (DRAG HISTORY)
-- ================================================
-- Shows comments where position was updated after creation
SELECT 
    id,
    user_name,
    page_id,
    position_x,
    position_y,
    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created,
    TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated,
    EXTRACT(EPOCH FROM (updated_at - created_at)) as seconds_since_created
FROM comments
WHERE updated_at > created_at + INTERVAL '1 second'
ORDER BY updated_at DESC
LIMIT 10;


-- 5. CHECK RESOLVE/UNRESOLVE HISTORY
-- ================================================
SELECT 
    user_name,
    page_id,
    SUBSTRING(content, 1, 40) as content,
    CASE 
        WHEN resolved THEN '✅ Resolved'
        ELSE '🔵 Active'
    END as status,
    resolved_by,
    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created,
    TO_CHAR(resolved_at, 'YYYY-MM-DD HH24:MI:SS') as resolved_time,
    CASE 
        WHEN resolved_at IS NOT NULL THEN
            EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
    END as hours_to_resolve
FROM comments
ORDER BY 
    CASE WHEN resolved THEN 1 ELSE 0 END,
    COALESCE(resolved_at, created_at) DESC
LIMIT 20;


-- 6. DATA INTEGRITY CHECK
-- ================================================
-- Verifies no invalid or corrupted data
SELECT 
    'Total Comments' as check_type,
    COUNT(*) as count,
    '✅ OK' as status
FROM comments

UNION ALL

SELECT 
    'Missing user_id' as check_type,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ISSUE' END as status
FROM comments
WHERE user_id IS NULL OR user_id = ''

UNION ALL

SELECT 
    'Missing page_id' as check_type,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ISSUE' END as status
FROM comments
WHERE page_id IS NULL OR page_id = ''

UNION ALL

SELECT 
    'Invalid positions' as check_type,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ISSUE' END as status
FROM comments
WHERE position_x IS NULL OR position_y IS NULL

UNION ALL

SELECT 
    'Empty content' as check_type,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ISSUE' END as status
FROM comments
WHERE content IS NULL OR TRIM(content) = ''

UNION ALL

SELECT 
    'Resolved missing timestamp' as check_type,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '⚠️ WARNING' END as status
FROM comments
WHERE resolved = true AND resolved_at IS NULL

UNION ALL

SELECT 
    'Unresolved with timestamp' as check_type,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '⚠️ WARNING' END as status
FROM comments
WHERE resolved = false AND resolved_at IS NOT NULL;


-- 7. USER ACTIVITY SUMMARY
-- ================================================
SELECT 
    user_name,
    user_email,
    COUNT(*) as total_comments,
    COUNT(CASE WHEN resolved = false THEN 1 END) as active,
    COUNT(CASE WHEN resolved = true THEN 1 END) as resolved,
    MIN(created_at)::date as first_comment_date,
    MAX(created_at)::date as last_comment_date,
    COUNT(DISTINCT page_id) as pages_commented_on
FROM comments
GROUP BY user_id, user_name, user_email
ORDER BY total_comments DESC;


-- 8. TIMELINE OF ALL COMMENT ACTIVITY
-- ================================================
-- Shows creation, updates, and resolutions in chronological order
WITH timeline AS (
    SELECT 
        id,
        user_name,
        page_id,
        SUBSTRING(content, 1, 30) as content,
        'Created' as event_type,
        created_at as event_time
    FROM comments
    
    UNION ALL
    
    SELECT 
        id,
        user_name,
        page_id,
        SUBSTRING(content, 1, 30) as content,
        'Position Updated' as event_type,
        updated_at as event_time
    FROM comments
    WHERE updated_at > created_at + INTERVAL '1 second'
    
    UNION ALL
    
    SELECT 
        id,
        user_name,
        page_id,
        SUBSTRING(content, 1, 30) as content,
        'Resolved' as event_type,
        resolved_at as event_time
    FROM comments
    WHERE resolved_at IS NOT NULL
)
SELECT 
    event_type,
    user_name,
    page_id,
    content,
    TO_CHAR(event_time, 'YYYY-MM-DD HH24:MI:SS') as when
FROM timeline
ORDER BY event_time DESC
LIMIT 30;


-- 9. DATABASE HEALTH SUMMARY
-- ================================================
WITH stats AS (
    SELECT 
        COUNT(*) as total_comments,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT page_id) as pages_with_comments,
        COUNT(CASE WHEN resolved = false THEN 1 END) as active_comments,
        COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_comments,
        MIN(created_at) as first_comment,
        MAX(created_at) as latest_comment,
        AVG(EXTRACT(EPOCH FROM (COALESCE(resolved_at, NOW()) - created_at))) / 3600 as avg_hours_to_resolve,
        COUNT(CASE WHEN updated_at > created_at + INTERVAL '1 second' THEN 1 END) as repositioned_comments
    FROM comments
)
SELECT 
    total_comments as "Total Comments",
    unique_users as "Unique Users",
    pages_with_comments as "Pages with Comments",
    active_comments as "Active Comments",
    resolved_comments as "Resolved Comments",
    ROUND((resolved_comments::numeric / NULLIF(total_comments, 0) * 100), 1) || '%' as "Resolution Rate",
    repositioned_comments as "Comments Repositioned",
    first_comment::date as "First Comment Date",
    latest_comment::date as "Latest Comment Date",
    ROUND(avg_hours_to_resolve::numeric, 1) || ' hrs' as "Avg Time to Resolve"
FROM stats;


-- 10. FIND SPECIFIC COMMENT BY ID
-- ================================================
-- Replace 'YOUR_COMMENT_ID_HERE' with actual UUID
-- Uncomment to use:
/*
SELECT 
    id,
    user_name,
    user_email,
    user_image,
    page_id,
    position_x,
    position_y,
    content,
    resolved,
    resolved_at,
    resolved_by,
    created_at,
    updated_at,
    CASE 
        WHEN updated_at > created_at + INTERVAL '1 second' THEN 'Position was updated'
        ELSE 'Original position'
    END as position_status,
    CASE 
        WHEN resolved THEN 'Resolved'
        ELSE 'Active'
    END as status
FROM comments
WHERE id = 'YOUR_COMMENT_ID_HERE'::uuid;
*/


-- 11. CHECK INDEX PERFORMANCE
-- ================================================
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'comments'
ORDER BY indexname;


-- 12. DELETE TEST COMMENTS (USE WITH CAUTION!)
-- ================================================
-- Uncomment only if you need to clean up test data
/*
-- Delete comments from a specific test user
DELETE FROM comments 
WHERE user_email = 'test@example.com';

-- Delete all comments from a specific page
DELETE FROM comments 
WHERE page_id = 'test-page';

-- Delete ALL comments (DANGEROUS!)
-- DELETE FROM comments;
*/
