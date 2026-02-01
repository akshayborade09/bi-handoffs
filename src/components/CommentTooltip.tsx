"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Comment } from "@/contexts/CommentContext";

interface CommentTooltipProps {
  comment?: Comment;
  position: { x: number; y: number };
  onSubmit?: (content: string) => void;
  onResolve?: () => void;
  onUpdate?: (content: string) => void;
  onClose: () => void;
  isNew?: boolean;
}

export function CommentTooltip({
  comment,
  position,
  onSubmit,
  onResolve,
  onUpdate,
  onClose,
  isNew = false,
}: CommentTooltipProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content || "");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input when creating new comment
  useEffect(() => {
    if (isNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNew]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!content.trim() || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
      onClose();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || !onUpdate) return;
    if (editedContent.trim() === comment?.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(editedContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(comment?.content || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      if (isEditing) {
        handleSaveEdit();
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      if (isEditing) {
        handleCancelEdit();
      } else {
        onClose();
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute z-[60] w-72"
      style={{
        left: `${position.x + 56}px`,
        top: `${position.y}px`,
        transform: "translateY(-50%)",
      }}
    >
      <div className="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
        {isNew ? (
          // New comment input
          <div className="p-4">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                className="w-full resize-none rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 pr-12 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                rows={3}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="absolute bottom-3 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Submit comment"
              >
                <span className="material-symbols-outlined leading-none text-[16px]">arrow_upward</span>
              </button>
            </div>
            <div className="mt-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Cmd/Ctrl + Enter to submit
              </span>
            </div>
          </div>
        ) : comment ? (
          // Existing comment view
          <div className="p-4">
            {isEditing ? (
              // Edit mode
              <>
                <textarea
                  ref={inputRef}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full resize-none rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  rows={3}
                  autoFocus
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={!editedContent.trim() || isSubmitting}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            ) : (
              // View mode
              <>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {comment.user_name}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {formatTimestamp(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 break-words whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                      {comment.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                    aria-label="Edit comment"
                  >
                    <span className="material-symbols-outlined leading-none text-[18px]">edit</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onResolve}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-emerald-600 transition-colors bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-800"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="ml-auto text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
