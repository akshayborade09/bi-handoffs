"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Comment, useComments } from "@/contexts/CommentContext";

interface ResolvedCommentsProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = "all" | "unresolved" | "resolved" | "my-comments";

export function ResolvedComments({ isOpen, onClose }: ResolvedCommentsProps) {
  const { resolveComment } = useComments();
  const { data: session } = useSession();
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("resolved");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const [showResolveSuccess, setShowResolveSuccess] = useState(false);
  const [showReopenSuccess, setShowReopenSuccess] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const pageDropdownRef = useRef<HTMLDivElement>(null);
  const pageSectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (isOpen) {
      fetchAllComments();
    }
  }, [isOpen]);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Close page dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(event.target as Node)) {
        setIsPageDropdownOpen(false);
      }
    };

    if (isPageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPageDropdownOpen]);

  const fetchAllComments = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching all comments...");
      // Fetch all comments (resolved and unresolved) for all pages
      const pages = ["home", "pre-signup-v1", "post-signup-v1"];
      const comments: Comment[] = [];

      await Promise.all(
        pages.map(async (pageId) => {
          // Fetch without resolved filter to get all comments
          const response = await fetch(`/api/comments?pageId=${pageId}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`Got ${data.comments.length} comments for ${pageId}`);
            comments.push(...data.comments);
          } else {
            console.error(`Failed to fetch comments for ${pageId}:`, await response.text());
          }
        })
      );

      // Sort by created_at desc
      comments.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      console.log(`Total comments: ${comments.length}`, comments);
      setAllComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (commentId: string) => {
    try {
      console.log("Resolving comment:", commentId);
      
      // Use the context's resolveComment function to properly update state
      await resolveComment(commentId, true);
      
      // Update local state
      setAllComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              resolved: true,
              resolved_at: new Date().toISOString(),
              resolved_by: session?.user?.name || "Unknown",
            };
          }
          return c;
        })
      );
      
      console.log("Comment resolved successfully");
      
      // Show success message
      setShowResolveSuccess(true);
      setTimeout(() => setShowResolveSuccess(false), 2000);
    } catch (error) {
      console.error("Error resolving comment:", error);
    }
  };

  const handleUnresolve = async (commentId: string) => {
    try {
      console.log("Reopening comment:", commentId);
      
      // Use the context's resolveComment function to properly update state
      await resolveComment(commentId, false);
      
      // Update local state
      setAllComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, resolved: false, resolved_at: null, resolved_by: null } : c))
      );
      
      console.log("Comment reopened successfully");
      
      // Show success message
      setShowReopenSuccess(true);
      setTimeout(() => setShowReopenSuccess(false), 2000);
    } catch (error) {
      console.error("Error unresolving comment:", error);
    }
  };

  const handleUpdateComment = (commentId: string, newContent: string) => {
    setAllComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content: newContent } : c))
    );
  };

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case "all":
        return "Show all";
      case "unresolved":
        return "Unresolved comments";
      case "resolved":
        return "Resolved comments";
      case "my-comments":
        return "My comments";
    }
  };

  const scrollToPage = (pageId: string) => {
    const sectionRef = pageSectionRefs.current[pageId];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsPageDropdownOpen(false);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPageLabel = (pageId: string) => {
    switch (pageId) {
      case "home":
        return "Home";
      case "pre-signup-v1":
        return "Pre Sign Up V1";
      case "post-signup-v1":
        return "Post Sign Up V1";
      default:
        return pageId;
    }
  };

  // Apply filters
  let filteredComments = allComments;

  // Filter by type
  if (selectedFilter === "unresolved") {
    filteredComments = filteredComments.filter((c) => !c.resolved);
  } else if (selectedFilter === "resolved") {
    filteredComments = filteredComments.filter((c) => c.resolved);
  } else if (selectedFilter === "my-comments") {
    const userEmail = session?.user?.email;
    filteredComments = filteredComments.filter((c) => c.user_email === userEmail);
  }

  // Group comments by page
  const groupedByPage = filteredComments.reduce((acc, comment) => {
    if (!acc[comment.page_id]) {
      acc[comment.page_id] = [];
    }
    acc[comment.page_id].push(comment);
    return acc;
  }, {} as Record<string, Comment[]>);

  // Get all pages with comments
  const pagesWithComments = Object.entries(groupedByPage).map(([pageId, comments]) => ({
    pageId,
    label: getPageLabel(pageId),
    count: comments.length,
  }));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative mx-4 h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Comments
              </h2>
              
              {/* Page dropdown */}
              <div ref={pageDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)}
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
                  aria-label="Jump to page"
                >
                  Jump to page
                </button>

                <AnimatePresence>
                  {isPageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <div className="py-1">
                        {pagesWithComments.length > 0 ? (
                          pagesWithComments.map(({ pageId, label, count }) => (
                            <button
                              key={pageId}
                              type="button"
                              onClick={() => scrollToPage(pageId)}
                              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            >
                              <span>{label}</span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {count} {count === 1 ? "comment" : "comments"}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                            No pages with comments
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter dropdown */}
              <div ref={filterRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center justify-center rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  aria-label="Filter"
                >
                  <span className="material-symbols-outlined leading-none text-[24px]">filter_list</span>
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFilter("all");
                            setIsFilterOpen(false);
                          }}
                          className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors ${
                            selectedFilter === "all"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          }`}
                        >
                          Show all
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFilter("unresolved");
                            setIsFilterOpen(false);
                          }}
                          className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors ${
                            selectedFilter === "unresolved"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          }`}
                        >
                          Unresolved comments
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFilter("resolved");
                            setIsFilterOpen(false);
                          }}
                          className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors ${
                            selectedFilter === "resolved"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          }`}
                        >
                          Resolved comments
                        </button>
                        <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFilter("my-comments");
                            setIsFilterOpen(false);
                          }}
                          className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors ${
                            selectedFilter === "my-comments"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          }`}
                        >
                          My comments
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                aria-label="Close"
              >
                <span className="material-symbols-outlined leading-none text-[24px]">close</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(80vh-85px)] overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined leading-none mb-4 text-[48px] text-zinc-400">
                  {selectedFilter === "my-comments" ? "person" : selectedFilter === "resolved" ? "check_circle" : selectedFilter === "unresolved" ? "comment" : "comment"}
                </span>
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  No {selectedFilter === "my-comments" ? "comments from you" : selectedFilter === "resolved" ? "resolved comments" : selectedFilter === "unresolved" ? "unresolved comments" : "comments"}
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedFilter === "my-comments" 
                    ? "Comments you create will appear here"
                    : selectedFilter === "resolved"
                    ? "Resolved comments will appear here"
                    : selectedFilter === "unresolved"
                    ? "Unresolved comments will appear here"
                    : "Comments will appear here"}
                </p>
              </div>
            ) : (
              // Always show grouped by page
              Object.entries(groupedByPage).map(([pageId, comments]) => (
                <div 
                  key={pageId} 
                  ref={(el) => { pageSectionRefs.current[pageId] = el; }}
                  className="mb-8 scroll-mt-6"
                >
                  <h3 className="mb-4 flex items-baseline gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {getPageLabel(pageId)}
                    <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                      {comments.length} {comments.length === 1 ? "comment" : "comments"}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        onResolve={handleResolve}
                        onUnresolve={handleUnresolve}
                        onUpdate={handleUpdateComment}
                        formatTimestamp={formatTimestamp}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Success toasts */}
        <AnimatePresence>
          {showResolveSuccess && (
            <motion.div
              className="pointer-events-none fixed inset-0 z-[310] flex items-end justify-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 shadow-lg dark:border-zinc-200 dark:bg-white">
                <span className="material-symbols-outlined leading-none text-[20px] text-white dark:text-zinc-900">
                  check_circle
                </span>
                <span className="text-sm font-medium text-white dark:text-zinc-900">
                  Comment resolved successfully
                </span>
              </div>
            </motion.div>
          )}
          {showReopenSuccess && (
            <motion.div
              className="pointer-events-none fixed inset-0 z-[310] flex items-end justify-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 shadow-lg dark:border-zinc-200 dark:bg-white">
                <span className="material-symbols-outlined leading-none text-[20px] text-white dark:text-zinc-900">
                  restart_alt
                </span>
                <span className="text-sm font-medium text-white dark:text-zinc-900">
                  Comment reopened and visible on page
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

function CommentCard({
  comment,
  onResolve,
  onUnresolve,
  onUpdate,
  formatTimestamp,
}: {
  comment: Comment;
  onResolve: (id: string) => void;
  onUnresolve: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  formatTimestamp: (timestamp: string) => string;
}) {
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);
  
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent.trim() }),
      });

      if (response.ok) {
        onUpdate(comment.id, editedContent.trim());
        setIsEditing(false);
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-zinc-100 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 gap-3">
          {/* User avatar */}
          <div className="flex-shrink-0">
            {comment.user_image && !imageError ? (
              <img
                src={comment.user_image}
                alt={comment.user_name}
                className="h-10 w-10 rounded-full border border-zinc-200 bg-white object-cover dark:border-zinc-700"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white dark:border-zinc-700">
                {getUserInitials(comment.user_name)}
              </div>
            )}
          </div>

          {/* Comment content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {comment.user_name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatTimestamp(comment.created_at)}
              </span>
            </div>
            
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                  rows={3}
                  autoFocus
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSaving || !editedContent.trim()}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                {comment.resolved && (
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Resolved by {comment.resolved_by} •{" "}
                    {comment.resolved_at && formatTimestamp(comment.resolved_at)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex flex-shrink-0 items-center gap-2">
            {comment.resolved ? (
              <button
                type="button"
                onClick={() => onUnresolve(comment.id)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                Reopen
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onResolve(comment.id)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
              >
                Resolve
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
              aria-label="Edit comment"
            >
              <span className="material-symbols-outlined leading-none text-[18px]">edit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
