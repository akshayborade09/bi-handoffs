"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InspectorPanelProps {
  isVisible: boolean;
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
  
  const options: FormatOption[] = ["SVG", "1x PNG", "1.5x PNG", "2x PNG", "3x PNG", "All-x PNG", "JPG", "PDF"];

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
    <div className="flex items-center gap-1">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-7 items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <span className="whitespace-nowrap">{value}</span>
          <span className="material-symbols-outlined text-[14px]">expand_more</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full left-0 mb-1 w-28 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
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
          )}
        </AnimatePresence>
      </div>
      
      <button
        type="button"
        onClick={onDownload}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
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

export function InspectorPanel({ isVisible, onClose }: InspectorPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [dockPosition, setDockPosition] = useState<"left" | "right">("right");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkOption>("React Native");
  const [assetFormats, setAssetFormats] = useState<Record<number, FormatOption>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  // Get all images and SVGs from the page
  const [pageAssets, setPageAssets] = useState<Array<{ src: string; type: string; element: HTMLElement }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    const collectAssets = () => {
      const assets: Array<{ src: string; type: string; element: HTMLElement }> = [];
      
      // Collect all images
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (img.src && !img.src.includes('data:image')) {
          assets.push({ src: img.src, type: 'IMG', element: img });
        }
      });

      // Collect all SVGs
      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => {
        assets.push({ src: '', type: 'SVG', element: svg as unknown as HTMLElement });
      });

      setPageAssets(assets);
      
      // Initialize formats
      const formats: Record<number, FormatOption> = {};
      assets.forEach((_, index) => {
        formats[index] = "SVG";
      });
      setAssetFormats(formats);
    };

    collectAssets();
    
    // Re-collect on page changes
    const observer = new MutationObserver(collectAssets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
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

  if (!isVisible) return null;

  const handleDockChange = (position: "left" | "right") => {
    setDockPosition(position);
    setIsMenuOpen(false);
  };

  const panelWidth = 480; // 20% bigger than 400px
  const headerHeight = 56;

  return (
    <motion.div
      className={`fixed bottom-3 z-[150] flex flex-col rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 ${
        dockPosition === "left" ? "left-3" : "right-3"
      }`}
      style={{ width: panelWidth }}
      initial={{ y: "100%", opacity: 0 }}
      animate={{
        y: isMinimized ? `calc(100% - ${headerHeight}px)` : 0,
        opacity: 1,
      }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* Header */}
      <div
        className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800"
        style={{ height: headerHeight }}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Inspector</h2>
        
        <div className="flex items-center gap-1">
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
                    <span className="material-symbols-outlined text-[20px]">dock_to_left</span>
                    <span>Dock to Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDockChange("right")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <span className="material-symbols-outlined text-[20px]">dock_to_right</span>
                    <span>Dock to Right</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minimize/Maximize Button */}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
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
        <div className="flex-1 overflow-y-auto p-4">
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
              <div className="flex gap-3 overflow-x-auto pb-2">
                {pageAssets.map((asset, index) => (
                  <div key={index} className="flex shrink-0 flex-col gap-2">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                      {asset.type === 'IMG' && asset.src ? (
                        <img 
                          src={asset.src} 
                          alt={`Asset ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-2">
                          <div 
                            className="h-full w-full"
                            dangerouslySetInnerHTML={{ __html: asset.element.outerHTML }}
                          />
                        </div>
                      )}
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
