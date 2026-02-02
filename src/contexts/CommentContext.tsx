"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_image: string | null;
  page_id: string;
  position_x: number;
  position_y: number;
  content: string;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

interface CommentContextType {
  mode: "creator" | "commenter" | "code";
  setMode: (mode: "creator" | "commenter" | "code") => void;
  currentPageId: string;
  setCurrentPageId: (pageId: string) => void;
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  fetchComments: (pageId: string, resolved?: boolean) => Promise<void>;
  addComment: (pageId: string, positionX: number, positionY: number, content: string) => Promise<Comment | null>;
  resolveComment: (commentId: string, resolved: boolean) => Promise<void>;
  updateCommentPosition: (commentId: string, positionX: number, positionY: number) => Promise<void>;
  isLoading: boolean;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"creator" | "commenter" | "code">("creator");
  const [currentPageId, setCurrentPageId] = useState<string>("home");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async (pageId: string, resolved?: boolean) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ pageId });
      if (resolved !== undefined) {
        params.append("resolved", String(resolved));
      }

      const response = await fetch(`/api/comments?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (
    pageId: string,
    positionX: number,
    positionY: number,
    content: string
  ): Promise<Comment | null> => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, positionX, positionY, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const data = await response.json();
      const newComment = data.comment;

      // Add to local state
      setComments((prev) => [newComment, ...prev]);
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  };

  const resolveComment = async (commentId: string, resolved: boolean) => {
    try {
      console.log("Resolving comment:", commentId, "resolved:", resolved);
      
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update comment:", errorData);
        throw new Error("Failed to update comment");
      }

      const data = await response.json();
      const updatedComment = data.comment;
      console.log("Comment updated in DB:", updatedComment);

      // Remove resolved comments from active state, keep unresolved
      if (resolved) {
        // Remove from local state when resolved - will only show in history modal
        console.log("Removing comment from active state");
        setComments((prev) => {
          const filtered = prev.filter((c) => c.id !== commentId);
          console.log("Comments after resolve:", filtered.length);
          return filtered;
        });
      } else {
        // Add back to local state when unresolving
        console.log("Adding comment back to active state:", updatedComment);
        setComments((prev) => {
          const newComments = [...prev, updatedComment];
          console.log("Comments after unresolve:", newComments.length, newComments);
          return newComments;
        });
      }
    } catch (error) {
      console.error("Error resolving comment:", error);
      alert("Failed to resolve comment. Please check console for details.");
    }
  };

  const updateCommentPosition = async (commentId: string, positionX: number, positionY: number) => {
    try {
      console.log("Updating comment position:", commentId, positionX, positionY);
      
      // Optimistically update local state first for smooth UX
      setComments((prev) =>
        prev.map((c) => 
          c.id === commentId 
            ? { ...c, position_x: positionX, position_y: positionY }
            : c
        )
      );
      
      // Then update in database
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position_x: positionX, position_y: positionY }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment position");
      }
      
      console.log("Comment position updated successfully in database");
    } catch (error) {
      console.error("Error updating comment position:", error);
      // On error, refetch to sync with server state
      fetchComments(currentPageId, false);
    }
  };

  // Fetch comments when page changes (only in commenter mode)
  useEffect(() => {
    if (mode === "commenter" && currentPageId) {
      fetchComments(currentPageId, false); // Only fetch unresolved comments
    }
  }, [mode, currentPageId]);

  return (
    <CommentContext.Provider
      value={{
        mode,
        setMode,
        currentPageId,
        setCurrentPageId,
        comments,
        setComments,
        fetchComments,
        addComment,
        resolveComment,
        updateCommentPosition,
        isLoading,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
}
