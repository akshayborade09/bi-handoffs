"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface InspectorPanelProps {
  isVisible: boolean;
  isDockExpanded?: boolean;
  onMaximize?: () => void;
  onClose?: () => void;
}

type FormatOption = "SVG" | "1x PNG" | "1.5x PNG" | "2x PNG" | "3x PNG" | "All-x PNG" | "JPG" | "PDF";
type FrameworkOption = "React Native" | "React" | "Vue" | "HTML" | "Swift" | "Android";

interface AssetDropdownProps {
  value: FormatOption;
  onChange: (value: FormatOption) => void;
  onDownload: () => void;
}

function AssetDropdown({ value, onChange, onDownload }: AssetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  const options: FormatOption[] = ["SVG", "1x PNG", "1.5x PNG", "2x PNG", "3x PNG", "All-x PNG", "JPG", "PDF"];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top - 8, // Position above button with small gap
        left: rect.left,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex w-24 items-center gap-1">
      <div className="relative flex-1 min-w-0">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-7 w-full items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-xs text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <span className="truncate flex-1 text-left">{value}</span>
          <span className="material-symbols-outlined shrink-0 text-[14px]">expand_more</span>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="fixed z-[9999] w-28 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                transform: 'translateY(-100%)',
              }}
            >
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                    value === option
                      ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
      </div>
      
      <button
        type="button"
        onClick={onDownload}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        aria-label="Download asset"
      >
        <span className="material-symbols-outlined text-[16px]">download</span>
      </button>
    </div>
  );
}

interface FrameworkDropdownProps {
  value: FrameworkOption;
  onChange: (value: FrameworkOption) => void;
}

function FrameworkDropdown({ value, onChange }: FrameworkDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const options: FrameworkOption[] = ["React Native", "React", "Vue", "HTML", "Swift", "Android"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        <span>{value}</span>
        <span className="material-symbols-outlined text-[16px]">expand_more</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-40 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                  value === option
                    ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InspectorPanel({ isVisible, isDockExpanded = false, onMaximize }: InspectorPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [dockPosition, setDockPosition] = useState<"left" | "right">("right");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkOption>("React Native");
  const [assetFormats, setAssetFormats] = useState<Record<number, FormatOption>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get all images and SVGs from the page
  const [pageAssets, setPageAssets] = useState<Array<{ src: string; type: string; element: HTMLElement }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    const collectAssets = () => {
      const assets: Array<{ src: string; type: string; element: HTMLElement }> = [];
      const seenAssets = new Set<string>();
      
      // Helper to check if element is inside dock, header, or inspector
      const isInExcludedContainer = (element: HTMLElement): boolean => {
        let current: HTMLElement | null = element;
        while (current && current !== document.body) {
          // Exclude if inside LeftDock, Header, or Inspector panel
          // Convert className to string (can be DOMTokenList for SVG elements)
          const classes = typeof current.className === 'string' ? current.className : String(current.className || '');
          if (
            classes.includes('left-dock') ||
            current.tagName === 'NAV' ||
            current.tagName === 'HEADER' ||
            current.getAttribute('role') === 'navigation'
          ) {
            return true;
          }
          current = current.parentElement;
        }
        return false;
      };

      // Collect all images from main content only
      const images = document.querySelectorAll('main img');
      images.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.src && !imgElement.src.includes('data:image') && !isInExcludedContainer(imgElement)) {
          // Remove duplicates by src
          if (!seenAssets.has(imgElement.src)) {
            seenAssets.add(imgElement.src);
            assets.push({ src: imgElement.src, type: 'IMG', element: imgElement });
          }
        }
      });

      // Collect all SVGs from main content only
      const svgs = document.querySelectorAll('main svg');
      svgs.forEach((svg) => {
        const svgElement = svg as unknown as HTMLElement;
        if (!isInExcludedContainer(svgElement)) {
          // Remove duplicates by outerHTML
          const svgString = svgElement.outerHTML;
          if (!seenAssets.has(svgString)) {
            seenAssets.add(svgString);
            assets.push({ src: '', type: 'SVG', element: svgElement });
          }
        }
      });

      setPageAssets(assets);
      
      // Initialize formats
      const formats: Record<number, FormatOption> = {};
      assets.forEach((_, index) => {
        formats[index] = "SVG";
      });
      setAssetFormats(formats);
    };

    // Collect assets on mount
    collectAssets();
    
    // Debounced asset collection to prevent performance issues
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedCollectAssets = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        collectAssets();
      }, 500); // Wait 500ms after last change before collecting
    };

    // Only observe main content area, not entire body
    const mainElement = document.querySelector('main');
    if (mainElement) {
      const observer = new MutationObserver(debouncedCollectAssets);
      observer.observe(mainElement, { 
        childList: true, 
        subtree: true,
        attributes: false, // Don't watch attribute changes
        characterData: false // Don't watch text changes
      });

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    }
  }, [isVisible]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDownload = (index: number) => {
    const asset = pageAssets[index];
    const format = assetFormats[index] || "SVG";
    console.log(`Downloading asset ${index} as ${format}`, asset);
    // TODO: Implement actual download functionality
  };

  // Handler functions for drag - defined before useEffect
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMinimized) return;
    
    // Prevent text selection while dragging
    e.preventDefault();
    
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !isMinimized) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dragDistance = clientX - dragStartX;
    
    // Optional: Add visual feedback during drag (not implemented yet)
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !isMinimized) return;
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const dragDistance = clientX - dragStartX;
    const threshold = 100; // 100px threshold
    
    if (Math.abs(dragDistance) > threshold) {
      // Determine new position based on current position and drag direction
      if (dockPosition === "left") {
        // Currently on left, dragged right = move to right
        if (dragDistance > 0) {
          setDockPosition("right");
        }
      } else {
        // Currently on right, dragged left = move to left
        if (dragDistance < 0) {
          setDockPosition("left");
        }
      }
    }
    
    setIsDragging(false);
  };

  // Minimize when dock expands - MUST be before early return to follow Rules of Hooks
  useEffect(() => {
    if (isDockExpanded) {
      setIsMinimized(true);
    }
  }, [isDockExpanded]);

  // Add global mouse/touch event listeners for drag - MUST be before early return
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, dragStartX, dockPosition, isMinimized]);

  // Prevent text selection globally while dragging - MUST be before early return
  useEffect(() => {
    if (isDragging) {
      // Add global style to prevent text selection
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      return () => {
        // Remove global style
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      };
    }
  }, [isDragging]);

  if (!isVisible) return null;

  const handleDockChange = (position: "left" | "right") => {
    setDockPosition(position);
    setIsMenuOpen(false);
  };

  const panelWidth = 480; // 20% bigger than 400px
  const headerHeight = 56;
  const dockWidth = 320; // DOCK_WIDTH_EXPANDED from LeftDock
  const dockInset = 12; // DOCK_INSET from LeftDock

  // Calculate position - if dock is expanded on left and inspector is on left, push it right
  const shouldPushRight = isDockExpanded && dockPosition === "left";
  const leftPosition = shouldPushRight ? `calc(${dockWidth}px + ${dockInset * 2 + 12}px)` : "0.75rem"; // 0.75rem = 12px = left-3

  return (
    <motion.div
      className={`fixed bottom-3 z-[50] flex flex-col rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 ${
        dockPosition === "right" ? "right-3" : "left-3"
      }`}
      style={{ 
        width: panelWidth,
      }}
      initial={{ y: "100%", opacity: 0 }}
      animate={{
        y: isMinimized ? `calc(100% - ${headerHeight}px)` : 0,
        opacity: 1,
        x: shouldPushRight ? `${dockWidth + dockInset * 2}px` : 0,
      }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 35, stiffness: 250 }}
    >
      {/* Header - Clickable to minimize/maximize, draggable when minimized to change position */}
      <div
        className={`flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 select-none ${
          isMinimized ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        }`}
        style={{ height: headerHeight, userSelect: isDragging ? 'none' : 'auto' }}
        onClick={() => {
          // Only toggle if not dragging
          if (!isDragging) {
            // If maximizing (currently minimized), close the dock
            if (isMinimized && onMaximize) {
              onMaximize();
            }
            setIsMinimized(!isMinimized);
          }
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 select-none">
          Inspector
        </h2>
        
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* 3 Dots Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Inspector menu"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <button
                    type="button"
                    onClick={() => handleDockChange("left")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <span className="material-symbols-outlined text-[20px]">dock_to_right</span>
                    <span>Dock to Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDockChange("right")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <span className="material-symbols-outlined text-[20px]">dock_to_left</span>
                    <span>Dock to Right</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minimize/Maximize Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={isMinimized ? "Maximize inspector" : "Minimize inspector"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMinimized ? "expand_content" : "collapse_content"}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 pt-4">
          {/* Assets Section */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Assets {pageAssets.length > 0 && <span className="text-zinc-500">({pageAssets.length})</span>}
            </h3>
            {pageAssets.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No assets found on this page</p>
              </div>
            ) : (
              <div 
                className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {pageAssets.map((asset, index) => (
                  <div key={index} className="flex shrink-0 flex-col gap-2">
                    <div className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
                      {asset.type === 'IMG' && asset.src ? (
                        <img 
                          src={asset.src} 
                          alt={`Asset ${index + 1}`}
                          className="max-h-full max-w-full object-contain object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div 
                            className="max-h-full max-w-full"
                            dangerouslySetInnerHTML={{ __html: asset.element.outerHTML }}
                          />
                        </div>
                      )}
                      
                      {/* Locate Element Icon - Shows on hover */}
                      <button
                        type="button"
                        onClick={() => {
                          asset.element.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'center' 
                          });
                          // Optional: Add a temporary highlight effect
                          asset.element.style.outline = '2px solid #3b82f6';
                          asset.element.style.outlineOffset = '4px';
                          setTimeout(() => {
                            asset.element.style.outline = '';
                            asset.element.style.outlineOffset = '';
                          }, 2000);
                        }}
                        className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-white opacity-0 shadow-md transition-opacity hover:bg-blue-600 group-hover:opacity-100"
                        aria-label="Locate element on page"
                      >
                        <span className="material-symbols-outlined text-[16px]">my_location</span>
                      </button>
                    </div>
                    <AssetDropdown
                      value={assetFormats[index] || "SVG"}
                      onChange={(value) => setAssetFormats({ ...assetFormats, [index]: value })}
                      onDownload={() => handleDownload(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Code Snippet Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Code Snippet</h3>
              <FrameworkDropdown
                value={selectedFramework}
                onChange={setSelectedFramework}
              />
            </div>
            <div className="h-64 rounded-lg bg-black" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
