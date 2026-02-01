"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useComments, Comment } from "@/contexts/CommentContext";
import { CommentMarker } from "./CommentMarker";
import { CommentTooltip } from "./CommentTooltip";
import { DOCK_WIDTH_EXPANDED, DOCK_INSET } from "./LeftDock";

interface CommentOverlayProps {
  isActive: boolean;
  pageId: string;
  isDockExpanded: boolean;
  onCloseDock: () => void;
}

export function CommentOverlay({ isActive, pageId, isDockExpanded, onCloseDock }: CommentOverlayProps) {
  const { data: session } = useSession();
  const { comments, addComment, resolveComment, updateCommentPosition } = useComments();
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newCommentPosition, setNewCommentPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [showResolveSuccess, setShowResolveSuccess] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't create comment if clicking on a marker or tooltip
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("[data-tooltip]")) {
      return;
    }

    // If dock is open, close it first without creating a comment
    if (isDockExpanded) {
      onCloseDock();
      return;
    }

    // Get the main content element (scrollable container)
    const mainElement = document.querySelector('main[role="main"]');
    const scrollTop = mainElement?.scrollTop || 0;
    const scrollLeft = mainElement?.scrollLeft || 0;

    // Get the bounding rect of the main element to calculate relative position
    const mainRect = mainElement?.getBoundingClientRect();
    
    // Calculate position relative to the main content area (not the viewport)
    const x = e.clientX - (mainRect?.left || 0) + scrollLeft;
    const y = e.clientY - (mainRect?.top || 0) + scrollTop;

    // Close any active tooltips
    setActiveCommentId(null);

    // Set position for new comment
    setNewCommentPosition({ x, y });
  };

  const handleSubmitNewComment = async (content: string) => {
    if (!newCommentPosition) return;

    const newComment = await addComment(
      pageId,
      newCommentPosition.x,
      newCommentPosition.y,
      content
    );

    if (newComment) {
      setNewCommentPosition(null);
    }
  };

  const handleMarkerClick = (commentId: string) => {
    setActiveCommentId(commentId === activeCommentId ? null : commentId);
    setNewCommentPosition(null);
  };

  const handleResolve = async (commentId: string) => {
    await resolveComment(commentId, true);
    setActiveCommentId(null);
    
    // Show success message
    setShowResolveSuccess(true);
    setTimeout(() => setShowResolveSuccess(false), 2000);
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        // The context will be updated automatically when the modal refetches
        // For now, we can keep the tooltip open to show the updated content
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCloseTooltip = () => {
    setActiveCommentId(null);
    setNewCommentPosition(null);
  };

  // Filter comments for current page (resolved comments are already removed from state)
  const pageComments = comments.filter((c) => c.page_id === pageId);

  if (!isActive) {
    return null;
  }

  const dockOffset = DOCK_INSET + DOCK_WIDTH_EXPANDED;

  return (
    <>
      {/* Click capture layer - covers entire content area */}
      <div
        className="absolute inset-0 z-40 min-h-full"
        style={{ 
          pointerEvents: isActive ? "auto" : "none"
        }}
        onClick={handleOverlayClick}
        aria-label="Comment overlay - click anywhere to add a comment"
      />

      {/* Comment markers - absolute positioning for scrolling with content */}
      <div className="pointer-events-none absolute left-0 top-0 z-50 min-h-full w-full">
        <div className="relative h-full w-full">
          {pageComments.map((comment) => (
            <div key={comment.id} className="pointer-events-auto">
              <CommentMarker
                comment={comment}
                onClick={() => handleMarkerClick(comment.id)}
                onPositionUpdate={updateCommentPosition}
              />
              <AnimatePresence>
                {activeCommentId === comment.id && (
                  <CommentTooltip
                    comment={comment}
                    position={{ x: comment.position_x, y: comment.position_y }}
                    onResolve={() => handleResolve(comment.id)}
                    onUpdate={(content) => handleUpdateComment(comment.id, content)}
                    onClose={handleCloseTooltip}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* New comment being created */}
          {newCommentPosition && (
            <div className="pointer-events-auto" data-tooltip>
              <CommentMarker
                comment={{
                  id: "new",
                  user_name: session?.user?.name || "You",
                  user_image: session?.user?.image || null,
                  position_x: newCommentPosition.x,
                  position_y: newCommentPosition.y,
                } as Comment}
                onClick={() => {}}
                isNew
              />
              <AnimatePresence>
                <CommentTooltip
                  position={newCommentPosition}
                  onSubmit={handleSubmitNewComment}
                  onClose={handleCloseTooltip}
                  isNew
                />
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {showResolveSuccess && (
          <motion.div 
            className="pointer-events-none fixed inset-0 z-[250] flex items-end justify-center p-6"
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
      </AnimatePresence>
    </>
  );
}
