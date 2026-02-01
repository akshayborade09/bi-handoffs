"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/contexts/CommentContext";
import { motion, PanInfo, useMotionValue } from "framer-motion";

interface CommentMarkerProps {
  comment: Comment;
  onClick: () => void;
  onPositionUpdate?: (commentId: string, x: number, y: number) => void;
  isNew?: boolean;
}

export function CommentMarker({ comment, onClick, onPositionUpdate, isNew = false }: CommentMarkerProps) {
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const userInitials = comment.user_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Reset transform when position changes from props (after database update)
  useEffect(() => {
    if (!isDragging) {
      x.set(0);
      y.set(0);
    }
  }, [comment.position_x, comment.position_y, isDragging, x, y]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    // Get the main content element to account for scroll
    const mainElement = document.querySelector('main[role="main"]');
    const scrollTop = mainElement?.scrollTop || 0;
    const scrollLeft = mainElement?.scrollLeft || 0;
    const mainRect = mainElement?.getBoundingClientRect();
    
    // Calculate new position relative to the document (accounting for scroll)
    const newX = info.point.x - (mainRect?.left || 0) + scrollLeft;
    const newY = info.point.y - (mainRect?.top || 0) + scrollTop;
    
    console.log("Drag ended. New position:", newX, newY);
    
    // Reset transforms immediately
    x.set(0);
    y.set(0);
    setIsDragging(false);
    
    // Update position in database (this will trigger a re-render with new left/top)
    if (onPositionUpdate && !isNew) {
      onPositionUpdate(comment.id, newX, newY);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        // Only trigger onClick if not dragging
        if (!isDragging) {
          onClick();
        }
      }}
      drag={!isNew}
      dragMomentum={false}
      dragElastic={0}
      dragSnapToOrigin={false}
      dragConstraints={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="absolute z-50 touch-none"
      style={{
        left: `${comment.position_x}px`,
        top: `${comment.position_y}px`,
        cursor: isDragging ? "grabbing" : "move",
        x,
        y,
      }}
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      whileHover={{ scale: 1.1 }}
      whileDrag={{ scale: 1.15 }}
      transition={{ 
        scale: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.2 },
      }}
      aria-label={`Comment by ${comment.user_name} - Drag to reposition`}
    >
      <div className="relative">
        {comment.user_image && !imageError ? (
          <img
            src={comment.user_image}
            alt={comment.user_name}
            onError={() => setImageError(true)}
            className={`h-9 w-9 rounded-full border-2 bg-white object-cover shadow-lg transition-all ${
              isDragging ? "border-blue-600 shadow-2xl" : "border-blue-500"
            }`}
            draggable={false}
          />
        ) : (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold text-blue-600 shadow-lg transition-all ${
              isDragging ? "border-blue-600 shadow-2xl" : "border-blue-500"
            }`}
          >
            {userInitials}
          </div>
        )}
        {isDragging && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
            Drag to move
          </div>
        )}
      </div>
    </motion.button>
  );
}
