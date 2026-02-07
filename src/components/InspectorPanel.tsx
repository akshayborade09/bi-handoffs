"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface InspectorPanelProps {
  isVisible: boolean;
  isDockExpanded?: boolean;
  onMaximize?: () => void;
  onClose?: () => void;
  isDevMode?: boolean;
  onDevModeChange?: (isDevMode: boolean) => void;
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
    <div className="flex w-24 items-center gap-1" data-asset-dropdown="true">
      <div className="relative flex-1 min-w-0">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          data-asset-dropdown-button="true"
          className="flex h-7 w-full items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-xs text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <span className="truncate flex-1 text-left">{value}</span>
          <span className="material-symbols-outlined shrink-0 text-[14px]">expand_more</span>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              data-asset-dropdown-menu="true"
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
                  data-asset-dropdown-option="true"
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
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
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

interface MeasurementOverlayProps {
  element: HTMLElement | null;
  isSelected?: boolean;
  selectedElement?: HTMLElement | null;
  hoveredElement?: HTMLElement | null;
  scrollTrigger?: number; // Used to trigger re-render on scroll
}

function MeasurementOverlay({ element, isSelected = false, selectedElement = null, hoveredElement = null, scrollTrigger = 0 }: MeasurementOverlayProps) {
  if (!element) return null;
  
  const rect = element.getBoundingClientRect();
  
  const overlayStyle = {
    position: 'fixed' as const,
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    pointerEvents: 'none' as const,
    zIndex: 15,
  };
  
  const borderColor = isSelected ? '#3b82f6' : '#f59e0b';
  // No background for both hover and selected - border only
  const bgColor = 'transparent';
  
  // Show measurements between selected and hovered elements only
  const shouldShowMeasurements = selectedElement && hoveredElement && selectedElement !== hoveredElement;
  
  interface MeasurementLine {
    top: number;
    left: number;
    width: number | string;
    height: number | string;
    distance: number;
    labelTop: number;
    labelLeft: number;
  }
  
  const measurementLines: MeasurementLine[] = [];
  
  if (shouldShowMeasurements && !isSelected && hoveredElement) {
    // We're rendering the hovered element, show measurement to selected element
    const selectedRect = selectedElement!.getBoundingClientRect();
    
    // Check if elements overlap or are nested
    const horizontalOverlap = !(selectedRect.right < rect.left || selectedRect.left > rect.right);
    const verticalOverlap = !(selectedRect.bottom < rect.top || selectedRect.top > rect.bottom);
    
    // If elements overlap (nested), show all edge distances
    if (horizontalOverlap && verticalOverlap) {
      const topDist = Math.abs(rect.top - selectedRect.top);
      const bottomDist = Math.abs(rect.bottom - selectedRect.bottom);
      const leftDist = Math.abs(rect.left - selectedRect.left);
      const rightDist = Math.abs(rect.right - selectedRect.right);
      
      // Show all edges that have meaningful distance (> 1px)
      if (topDist > 1) {
        measurementLines.push({
          top: Math.min(rect.top, selectedRect.top),
          left: rect.left + rect.width / 2,
          width: '1px',
          height: topDist,
          distance: topDist,
          labelTop: Math.min(rect.top, selectedRect.top) + topDist / 2,
          labelLeft: rect.left + rect.width / 2,
        });
      }
      
      if (bottomDist > 1) {
        measurementLines.push({
          top: Math.min(rect.bottom, selectedRect.bottom),
          left: rect.left + rect.width / 2,
          width: '1px',
          height: bottomDist,
          distance: bottomDist,
          labelTop: Math.min(rect.bottom, selectedRect.bottom) + bottomDist / 2,
          labelLeft: rect.left + rect.width / 2,
        });
      }
      
      if (leftDist > 1) {
        measurementLines.push({
          top: rect.top + rect.height / 2,
          left: Math.min(rect.left, selectedRect.left),
          width: leftDist,
          height: '1px',
          distance: leftDist,
          labelTop: rect.top + rect.height / 2,
          labelLeft: Math.min(rect.left, selectedRect.left) + leftDist / 2,
        });
      }
      
      if (rightDist > 1) {
        measurementLines.push({
          top: rect.top + rect.height / 2,
          left: Math.min(rect.right, selectedRect.right),
          width: rightDist,
          height: '1px',
          distance: rightDist,
          labelTop: rect.top + rect.height / 2,
          labelLeft: Math.min(rect.right, selectedRect.right) + rightDist / 2,
        });
      }
    } else {
      // Elements don't overlap - show external distance
      if (selectedRect.bottom < rect.top) {
        // Selected is above hovered
        const distance = rect.top - selectedRect.bottom;
        measurementLines.push({
          top: selectedRect.bottom,
          left: selectedRect.left + selectedRect.width / 2,
          width: '1px',
          height: distance,
          distance,
          labelTop: selectedRect.bottom + distance / 2,
          labelLeft: selectedRect.left + selectedRect.width / 2,
        });
      } else if (selectedRect.top > rect.bottom) {
        // Selected is below hovered
        const distance = selectedRect.top - rect.bottom;
        measurementLines.push({
          top: rect.bottom,
          left: rect.left + rect.width / 2,
          width: '1px',
          height: distance,
          distance,
          labelTop: rect.bottom + distance / 2,
          labelLeft: rect.left + rect.width / 2,
        });
      }
      
      if (selectedRect.right < rect.left) {
        // Selected is to the left
        const distance = rect.left - selectedRect.right;
        measurementLines.push({
          top: selectedRect.top + selectedRect.height / 2,
          left: selectedRect.right,
          width: distance,
          height: '1px',
          distance,
          labelTop: selectedRect.top + selectedRect.height / 2,
          labelLeft: selectedRect.right + distance / 2,
        });
      } else if (selectedRect.left > rect.right) {
        // Selected is to the right
        const distance = selectedRect.left - rect.right;
        measurementLines.push({
          top: rect.top + rect.height / 2,
          left: rect.right,
          width: distance,
          height: '1px',
          distance,
          labelTop: rect.top + rect.height / 2,
          labelLeft: rect.right + distance / 2,
        });
      }
    }
  }
  
  // Helper function to check if element is excluded
  function isInExcludedContainer(el: HTMLElement): boolean {
    // Check if element is inside inspector panel, dock, or floating dock toggle
    let current: HTMLElement | null = el;
    while (current && current !== document.body) {
      // Check for data attributes that mark inspector, dock, and floating toggle
      if (current.getAttribute('data-inspector-panel') === 'true') {
        return true;
      }
      if (current.getAttribute('data-left-dock') === 'true') {
        return true;
      }
      if (current.getAttribute('data-floating-dock-toggle') === 'true') {
        return true;
      }
      if (current.getAttribute('data-framework-dropdown') === 'true' || 
          current.getAttribute('data-framework-dropdown-menu') === 'true' ||
          current.getAttribute('data-framework-dropdown-option') === 'true') {
        return true;
      }
      if (current.getAttribute('data-asset-dropdown') === 'true' || 
          current.getAttribute('data-asset-dropdown-menu') === 'true' ||
          current.getAttribute('data-asset-dropdown-option') === 'true') {
        return true;
      }
      
      current = current.parentElement;
    }
    return false;
  }
  
  return createPortal(
    <>
      {/* Element highlight box */}
      <div
        style={{
          ...overlayStyle,
          border: `2px solid ${borderColor}`,
          backgroundColor: bgColor,
        }}
      />
      
      {/* Dimensions label */}
      <div
        style={{
          position: 'fixed',
          top: rect.top - 24,
          left: rect.left,
          padding: '2px 6px',
          backgroundColor: borderColor,
          color: 'white',
          fontSize: '11px',
          fontWeight: '600',
          borderRadius: '4px',
          pointerEvents: 'none',
          zIndex: 16,
          fontFamily: 'monospace',
        }}
      >
        {Math.round(rect.width)} × {Math.round(rect.height)}
      </div>

      {/* Measurements between selected and hovered elements - all sides */}
      {measurementLines.length > 0 && measurementLines.map((line, index) => (
        <React.Fragment key={`measurement-${index}`}>
          {/* Guideline */}
          <div
            style={{
              position: 'fixed',
              top: line.top,
              left: line.left,
              width: line.width,
              height: line.height,
              backgroundColor: '#10b981',
              pointerEvents: 'none',
              zIndex: 14,
            }}
          />
          {/* Distance label */}
          <div
            style={{
              position: 'fixed',
              top: line.labelTop,
              left: line.labelLeft,
              transform: 'translate(-50%, -50%)',
              padding: '2px 6px',
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '3px',
              pointerEvents: 'none',
              zIndex: 16,
              fontFamily: 'monospace',
            }}
          >
            {Math.round(line.distance)}
          </div>
        </React.Fragment>
      ))}
    </>,
    document.body
  );
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
    <div className="relative" ref={dropdownRef} data-framework-dropdown="true">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        data-framework-dropdown-button="true"
        className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        <span>{value}</span>
        <span className="material-symbols-outlined text-[16px]">expand_more</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-framework-dropdown-menu="true"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-40 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 z-[9999]"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                data-framework-dropdown-option="true"
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

export function InspectorPanel({ 
  isVisible, 
  isDockExpanded = false, 
  onMaximize,
  isDevMode = false,
  onDevModeChange
}: InspectorPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [dockPosition, setDockPosition] = useState<"left" | "right">("right");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkOption>("React");
  const [assetFormats, setAssetFormats] = useState<Record<number, FormatOption>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"assets" | "code">("assets");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0); // Used to trigger overlay re-render on scroll
  const menuRef = useRef<HTMLDivElement>(null);

  // Toast helper function
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

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

  const handleDownload = async (index: number) => {
    const asset = pageAssets[index];
    const format = assetFormats[index] || "SVG";
    
    try {
      if (asset.type === 'SVG') {
        await downloadSVGAsset(asset.element, format, index);
      } else if (asset.type === 'IMG' && asset.src) {
        await downloadImageAsset(asset.src, format, index);
      }
      showToastNotification(`Asset ${index + 1} downloaded as ${format}`);
    } catch (error) {
      showToastNotification('Failed to download asset');
    }
  };

  const downloadSVGAsset = async (svgElement: HTMLElement, format: FormatOption, index: number) => {
    const svgString = svgElement.outerHTML;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    
    if (format === 'SVG') {
      // Direct SVG download
      downloadBlob(blob, `asset-${index + 1}.svg`);
    } else {
      // Convert SVG to raster format
      await convertSVGToRaster(svgString, format, index);
    }
  };

  const downloadImageAsset = async (src: string, format: FormatOption, index: number) => {
    if (format === 'SVG') {
      // Can't convert raster to SVG, download original
      downloadFromURL(src, `asset-${index + 1}.${getFileExtension(src)}`);
    } else if (format === 'All-x PNG') {
      // Download multiple scales as ZIP
      const scales = [1, 1.5, 2, 3];
      const zip = new JSZip();
      
      for (const scale of scales) {
        const blob = await convertImageToBlob(src, 'PNG', scale);
        const suffix = scale !== 1 ? `@${scale}x` : '';
        zip.file(`asset-${index + 1}${suffix}.png`, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `asset-${index + 1}-all-scales.zip`);
    } else {
      // Single format download
      const scale = getScaleFromFormat(format);
      await convertImageToFormat(src, getFormatType(format), scale, index);
    }
  };

  const convertSVGToRaster = async (svgString: string, format: FormatOption, index: number) => {
    if (format === 'All-x PNG') {
      // Download multiple scales as ZIP
      const scales = [1, 1.5, 2, 3];
      const zip = new JSZip();
      
      for (const scale of scales) {
        const blob = await convertSVGToBlob(svgString, 'PNG', scale);
        const suffix = scale !== 1 ? `@${scale}x` : '';
        zip.file(`asset-${index + 1}${suffix}.png`, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `asset-${index + 1}-all-scales.zip`);
    } else {
      // Single format download
      const scale = getScaleFromFormat(format);
      const blob = await convertSVGToBlob(svgString, getFormatType(format), scale);
      const extension = format.includes('JPG') ? 'jpg' : 'png';
      const suffix = scale !== 1 ? `@${scale}x` : '';
      downloadBlob(blob, `asset-${index + 1}${suffix}.${extension}`);
    }
  };

  const convertSVGToBlob = async (svgString: string, formatType: string, scale: number): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise<Blob>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const mimeType = formatType === 'JPG' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob((blob) => {
          if (blob) {
            URL.revokeObjectURL(url);
            resolve(blob);
          } else {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to create blob'));
          }
        }, mimeType, 0.95);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      img.src = url;
    });
  };

  const convertImageToFormat = async (src: string, formatType: string, scale: number, index: number) => {
    const blob = await convertImageToBlob(src, formatType, scale);
    const extension = formatType === 'JPG' ? 'jpg' : 'png';
    const suffix = scale !== 1 ? `@${scale}x` : '';
    downloadBlob(blob, `asset-${index + 1}${suffix}.${extension}`);
  };

  const convertImageToBlob = async (src: string, formatType: string, scale: number): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise<Blob>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const mimeType = formatType === 'JPG' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, mimeType, 0.95);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFromURL = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getScaleFromFormat = (format: FormatOption): number => {
    if (format.includes('1.5x')) return 1.5;
    if (format.includes('2x')) return 2;
    if (format.includes('3x')) return 3;
    return 1;
  };

  const getFormatType = (format: FormatOption): string => {
    if (format.includes('JPG')) return 'JPG';
    if (format.includes('PNG')) return 'PNG';
    if (format.includes('PDF')) return 'PDF';
    return 'PNG';
  };

  const getFileExtension = (url: string): string => {
    const match = url.match(/\.([^./?]+)(\?|$)/);
    return match ? match[1] : 'png';
  };

  // Dev Mode - Element Selection and Code Generation
  const isInExcludedContainer = (element: HTMLElement): boolean => {
    // Check if element is inside inspector panel, dock, or floating dock toggle
    let current: HTMLElement | null = element;
    while (current && current !== document.body) {
      // Check for data attributes that mark inspector, dock, and floating toggle
      if (current.getAttribute('data-inspector-panel') === 'true') {
        return true;
      }
      if (current.getAttribute('data-left-dock') === 'true') {
        return true;
      }
      if (current.getAttribute('data-floating-dock-toggle') === 'true') {
        return true;
      }
      if (current.getAttribute('data-framework-dropdown') === 'true' || 
          current.getAttribute('data-framework-dropdown-menu') === 'true' ||
          current.getAttribute('data-framework-dropdown-option') === 'true') {
        return true;
      }
      if (current.getAttribute('data-asset-dropdown') === 'true' || 
          current.getAttribute('data-asset-dropdown-menu') === 'true' ||
          current.getAttribute('data-asset-dropdown-option') === 'true') {
        return true;
      }
      
      current = current.parentElement;
    }
    return false;
  };

  const handleElementClick = (e: MouseEvent) => {
    // NOTE: Exclusion check is now done BEFORE this function is called
    // This function only runs for page elements, not inspector/dock
    
    // Use elementFromPoint for more accurate detection
    let element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    
    if (!element) {
      return;
    }
    
    // If it's a text node, use the parent element
    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement as HTMLElement;
    }
    
    if (!element) {
      return;
    }
    
    // Smart element selection: find the most specific element at this exact position
    element = getSmartElement(element, e.clientX, e.clientY);
    
    // Prevent default and stop propagation for page elements
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedElement(element);
    generateCodeForElement(element);
  };

  // Helper function to select the most specific/relevant element at a position
  const getSmartElement = (element: HTMLElement, x: number, y: number): HTMLElement => {
    // Define what we consider "specific" elements worth selecting
    // Note: IMG is excluded because we want to select the container, not the image itself
    const specificTags = ['SVG', 'VIDEO', 'CANVAS', 'IFRAME', 'BUTTON', 'A', 'INPUT', 'TEXTAREA', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'LABEL'];
    
    // If this is already a specific element, return it
    if (specificTags.includes(element.tagName)) {
      return element;
    }
    
    // If this is an IMG element, return its parent container instead
    if (element.tagName === 'IMG' && element.parentElement) {
      return element.parentElement;
    }
    
    // Get all children and check which ones are at this position
    const children = Array.from(element.children) as HTMLElement[];
    
    for (const child of children) {
      const rect = child.getBoundingClientRect();
      
      // Check if the click position is within this child
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        // Recurse into this child to find an even more specific element
        return getSmartElement(child, x, y);
      }
    }
    
    // No child contains the click position, return current element
    return element;
  };

  const handleElementHover = (e: MouseEvent) => {
    if (!isDevMode) return;
    
    // Use elementFromPoint for more accurate detection
    let element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    
    if (!element) {
      setHoveredElement(null);
      return;
    }
    
    // Handle text nodes - keep the parent
    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement as HTMLElement;
    }
    
    if (!element) {
      setHoveredElement(null);
      return;
    }
    
    // Smart element selection: find the most specific element at this exact position
    element = getSmartElement(element, e.clientX, e.clientY);
    
    // If element has only text content (no child elements), wrap it in a span for measurements
    if (element.children.length === 0 && element.textContent?.trim() && !element.querySelector('.dev-mode-text-wrapper')) {
      const textContent = element.innerHTML;
      element.innerHTML = `<span class="dev-mode-text-wrapper" style="display: inline; pointer-events: auto;">${textContent}</span>`;
      // Get the newly created span as the element to hover
      const wrapper = element.querySelector('.dev-mode-text-wrapper') as HTMLElement;
      if (wrapper) {
        element = wrapper;
      }
    }
    
    // Set the hovered element
    setHoveredElement(element);
  };

  const generateCodeForElement = (element: HTMLElement) => {
    const framework = selectedFramework;
    
    if (framework === "React" || framework === "React Native") {
      const code = generateReactCode(element);
      setGeneratedCode(code);
    } else if (framework === "Vue") {
      const code = generateVueCode(element);
      setGeneratedCode(code);
    } else if (framework === "HTML") {
      const code = generateHTMLCode(element);
      setGeneratedCode(code);
    } else {
      setGeneratedCode(`// Code generation for ${framework} coming soon...`);
    }
  };

  const generateReactCode = (element: HTMLElement): string => {
    const tagName = element.tagName.toLowerCase();
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Determine the appropriate JSX element
    let jsxElement = 'div';
    let additionalProps: Record<string, string> = {};
    
    // Map semantic HTML elements
    if (tagName === 'button') {
      jsxElement = 'button';
    } else if (tagName === 'a') {
      jsxElement = 'a';
      const href = element.getAttribute('href');
      if (href) additionalProps.href = href;
    } else if (tagName === 'img') {
      jsxElement = 'img';
      const src = element.getAttribute('src');
      const alt = element.getAttribute('alt');
      if (src) additionalProps.src = src;
      if (alt) additionalProps.alt = alt;
    } else if (tagName === 'input') {
      jsxElement = 'input';
      const type = element.getAttribute('type');
      const placeholder = element.getAttribute('placeholder');
      if (type) additionalProps.type = type;
      if (placeholder) additionalProps.placeholder = placeholder;
    } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      jsxElement = tagName;
    } else if (tagName === 'p') {
      jsxElement = 'p';
    } else if (tagName === 'span') {
      jsxElement = 'span';
    } else if (tagName === 'svg') {
      jsxElement = 'svg';
      // For SVG, return the actual SVG content
      return `import React from 'react';\n\nexport default function SvgIcon() {\n  return (\n${indentCode(element.outerHTML, 4)}\n  );\n}`;
    }
    
    // Get relevant CSS properties and convert to Tailwind-like inline styles
    const styles: Record<string, string> = {};
    
    // Layout
    const display = computedStyle.display;
    if (display === 'flex') {
      styles.display = 'flex';
      
      // Flexbox properties
      const flexDir = computedStyle.flexDirection;
      if (flexDir === 'column') styles.flexDirection = 'column';
      
      const justifyContent = computedStyle.justifyContent;
      if (justifyContent && justifyContent !== 'normal' && justifyContent !== 'flex-start') {
        styles.justifyContent = justifyContent;
      }
      
      const alignItems = computedStyle.alignItems;
      if (alignItems && alignItems !== 'normal' && alignItems !== 'stretch') {
        styles.alignItems = alignItems;
      }
      
      const gap = computedStyle.gap;
      if (gap && gap !== 'normal' && gap !== '0px') {
        styles.gap = gap;
      }
    } else if (display === 'grid') {
      styles.display = 'grid';
    }
    
    // Position
    const position = computedStyle.position;
    if (position !== 'static') {
      styles.position = position;
    }
    
    // Dimensions (only if explicitly set)
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (width > 0) styles.width = `${width}px`;
    if (height > 0) styles.height = `${height}px`;
    
    // Spacing
    const padding = computedStyle.padding;
    if (padding && padding !== '0px') {
      styles.padding = padding;
    }
    
    const margin = computedStyle.margin;
    if (margin && margin !== '0px') {
      styles.margin = margin;
    }
    
    // Colors and backgrounds
    const bgColor = computedStyle.backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      styles.backgroundColor = bgColor;
    }
    
    const color = computedStyle.color;
    if (color && color !== 'rgb(0, 0, 0)') {
      styles.color = color;
    }
    
    // Borders
    const borderRadius = computedStyle.borderRadius;
    if (borderRadius && borderRadius !== '0px') {
      styles.borderRadius = borderRadius;
    }
    
    const border = computedStyle.border;
    if (border && !border.includes('0px')) {
      styles.border = border;
    }
    
    // Typography
    const fontSize = computedStyle.fontSize;
    if (fontSize && fontSize !== '16px') {
      styles.fontSize = fontSize;
    }
    
    const fontWeight = computedStyle.fontWeight;
    if (fontWeight && fontWeight !== '400') {
      styles.fontWeight = fontWeight;
    }
    
    const lineHeight = computedStyle.lineHeight;
    if (lineHeight && lineHeight !== 'normal') {
      styles.lineHeight = lineHeight;
    }
    
    const textAlign = computedStyle.textAlign;
    if (textAlign && textAlign !== 'start' && textAlign !== 'left') {
      styles.textAlign = textAlign;
    }
    
    // Get text content
    const textContent = element.textContent?.trim() || '';
    const hasChildren = element.children.length > 0;
    const hasText = textContent && !hasChildren;
    
    // Get classes (filter out dev mode classes)
    const classes = element.className ? 
      element.className.toString().split(' ').filter(c => c && !c.includes('dev-mode')) : [];
    
    // Build the React component
    let code = `import React from 'react';\n\n`;
    code += `export default function Component() {\n`;
    
    // Add event handlers for interactive elements
    if (jsxElement === 'button' || jsxElement === 'a') {
      code += `  const handleClick = () => {\n`;
      code += `    // Add your click handler logic here\n`;
      code += `  };\n\n`;
    }
    
    code += `  return (\n`;
    code += `    <${jsxElement}\n`;
    
    // Add className
    if (classes.length > 0) {
      code += `      className="${classes.join(' ')}"\n`;
    }
    
    // Add additional props
    Object.entries(additionalProps).forEach(([key, value]) => {
      code += `      ${key}="${value}"\n`;
    });
    
    // Add onClick for interactive elements
    if (jsxElement === 'button' || (jsxElement === 'a' && !additionalProps.href)) {
      code += `      onClick={handleClick}\n`;
    }
    
    // Add styles if any
    if (Object.keys(styles).length > 0) {
      code += `      style={{\n`;
      Object.entries(styles).forEach(([key, value], index, array) => {
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const comma = index < array.length - 1 ? ',' : '';
        code += `        ${camelKey}: '${value}'${comma}\n`;
      });
      code += `      }}\n`;
    }
    
    // Close the opening tag
    if (jsxElement === 'img' || jsxElement === 'input') {
      code += `    />\n`;
    } else {
      code += `    >\n`;
      
      // Add children content
      if (hasText) {
        code += `      ${textContent}\n`;
      } else if (hasChildren) {
        code += `      {/* Add child components here */}\n`;
      }
      
      code += `    </${jsxElement}>\n`;
    }
    
    code += `  );\n`;
    code += `}`;
    
    return code;
  };
  
  // Helper function to indent code
  const indentCode = (code: string, spaces: number): string => {
    const indent = ' '.repeat(spaces);
    return code.split('\n').map(line => indent + line).join('\n');
  };

  const generateVueCode = (element: HTMLElement): string => {
    const tagName = element.tagName.toLowerCase();
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Determine the appropriate element
    let vueElement = 'div';
    let additionalAttrs: Record<string, string> = {};
    
    if (tagName === 'button') {
      vueElement = 'button';
    } else if (tagName === 'a') {
      vueElement = 'a';
      const href = element.getAttribute('href');
      if (href) additionalAttrs.href = href;
    } else if (tagName === 'img') {
      vueElement = 'img';
      const src = element.getAttribute('src');
      const alt = element.getAttribute('alt');
      if (src) additionalAttrs.src = src;
      if (alt) additionalAttrs.alt = alt;
    } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      vueElement = tagName;
    } else if (tagName === 'p') {
      vueElement = 'p';
    } else if (tagName === 'span') {
      vueElement = 'span';
    }
    
    // Get styles
    const styles: string[] = [];
    const display = computedStyle.display;
    if (display === 'flex') {
      styles.push('display: flex');
      if (computedStyle.flexDirection === 'column') styles.push('flex-direction: column');
      if (computedStyle.justifyContent && computedStyle.justifyContent !== 'normal') {
        styles.push(`justify-content: ${computedStyle.justifyContent}`);
      }
      if (computedStyle.alignItems && computedStyle.alignItems !== 'normal') {
        styles.push(`align-items: ${computedStyle.alignItems}`);
      }
      if (computedStyle.gap && computedStyle.gap !== 'normal') {
        styles.push(`gap: ${computedStyle.gap}`);
      }
    }
    
    // Dimensions
    styles.push(`width: ${Math.round(rect.width)}px`);
    styles.push(`height: ${Math.round(rect.height)}px`);
    
    // Spacing
    if (computedStyle.padding && computedStyle.padding !== '0px') {
      styles.push(`padding: ${computedStyle.padding}`);
    }
    
    // Colors
    const bgColor = computedStyle.backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      styles.push(`background-color: ${bgColor}`);
    }
    
    const color = computedStyle.color;
    if (color && color !== 'rgb(0, 0, 0)') {
      styles.push(`color: ${color}`);
    }
    
    // Borders
    if (computedStyle.borderRadius && computedStyle.borderRadius !== '0px') {
      styles.push(`border-radius: ${computedStyle.borderRadius}`);
    }
    
    // Typography
    if (computedStyle.fontSize && computedStyle.fontSize !== '16px') {
      styles.push(`font-size: ${computedStyle.fontSize}`);
    }
    if (computedStyle.fontWeight && computedStyle.fontWeight !== '400') {
      styles.push(`font-weight: ${computedStyle.fontWeight}`);
    }
    
    // Get text content
    const textContent = element.textContent?.trim() || '';
    const hasText = textContent && element.children.length === 0;
    
    // Get classes
    const classes = element.className ? 
      element.className.toString().split(' ').filter(c => c && !c.includes('dev-mode')) : [];
    
    // Build Vue component
    let code = `<template>\n`;
    code += `  <${vueElement}`;
    
    if (classes.length > 0) {
      code += `\n    class="${classes.join(' ')}"`;
    }
    
    Object.entries(additionalAttrs).forEach(([key, value]) => {
      code += `\n    ${key}="${value}"`;
    });
    
    if (vueElement === 'button' || (vueElement === 'a' && !additionalAttrs.href)) {
      code += `\n    @click="handleClick"`;
    }
    
    if (styles.length > 0) {
      code += `\n    :style="{\n`;
      styles.forEach((style, index) => {
        const [prop, val] = style.split(': ');
        const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const comma = index < styles.length - 1 ? ',' : '';
        code += `      ${camelProp}: '${val}'${comma}\n`;
      });
      code += `    }"`;
    }
    
    if (vueElement === 'img') {
      code += `\n  />\n`;
    } else {
      code += `\n  >\n`;
      
      if (hasText) {
        code += `    ${textContent}\n`;
      }
      
      code += `  </${vueElement}>\n`;
    }
    
    code += `</template>\n\n`;
    code += `<script>\n`;
    code += `export default {\n`;
    code += `  name: 'Component',\n`;
    
    if (vueElement === 'button' || vueElement === 'a') {
      code += `  methods: {\n`;
      code += `    handleClick() {\n`;
      code += `      // Add your click handler logic here\n`;
      code += `    }\n`;
      code += `  }\n`;
    }
    
    code += `}\n`;
    code += `</script>`;
    
    return code;
  };

  const generateHTMLCode = (element: HTMLElement): string => {
    const tagName = element.tagName.toLowerCase();
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Remove dev-mode specific attributes and classes
    clonedElement.querySelectorAll('.dev-mode-text-wrapper').forEach(wrapper => {
      if (wrapper.textContent) {
        wrapper.replaceWith(wrapper.textContent);
      }
    });
    
    // Get the clean HTML
    let html = clonedElement.outerHTML;
    
    // Format the HTML for better readability
    html = formatHTML(html);
    
    return html;
  };
  
  // Helper function to format HTML
  const formatHTML = (html: string): string => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    
    html.split(/(<[^>]+>)/g).forEach(part => {
      if (!part.trim()) return;
      
      if (part.startsWith('</')) {
        indent--;
        formatted += tab.repeat(Math.max(0, indent)) + part + '\n';
      } else if (part.startsWith('<')) {
        formatted += tab.repeat(indent) + part + '\n';
        if (!part.endsWith('/>') && !part.includes('</')) {
          indent++;
        }
      } else {
        formatted += tab.repeat(indent) + part.trim() + '\n';
      }
    });
    
    return formatted.trim();
  };

  // Enable/disable dev mode
  useEffect(() => {
    if (!isVisible || !isDevMode) {
      setSelectedElement(null);
      setHoveredElement(null);
      setGeneratedCode("");
      
      // Remove all dev mode text wrappers when disabling
      document.querySelectorAll('.dev-mode-text-wrapper').forEach(wrapper => {
        const parent = wrapper.parentElement;
        if (parent) {
          parent.innerHTML = wrapper.textContent || '';
        }
      });
      
      return;
    }
    
    // Single unified click handler
    const handleDevModeClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Only prevent defaults for page buttons/links, not if they're in a dropdown or have specific data attributes
      const isDropdownRelated = target.closest('[data-framework-dropdown]') || 
                                 target.closest('[data-asset-dropdown]') ||
                                 target.hasAttribute('data-framework-dropdown') ||
                                 target.hasAttribute('data-asset-dropdown');
      
      if (!isDropdownRelated && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a'))) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Handle the dev mode click
      handleElementClick(e);
    };
    
    // Attach listeners ONLY to main content area, not entire document
    const mainElement = document.querySelector('main[role="main"]');
    if (mainElement) {
      mainElement.addEventListener('click', handleDevModeClick as EventListener);
      mainElement.addEventListener('mousemove', handleElementHover as EventListener, { passive: true } as AddEventListenerOptions);
    }
    
    return () => {
      const mainElement = document.querySelector('main[role="main"]');
      if (mainElement) {
        mainElement.removeEventListener('click', handleDevModeClick as EventListener);
        mainElement.removeEventListener('mousemove', handleElementHover as EventListener);
      }
      
      // Cleanup text wrappers
      document.querySelectorAll('.dev-mode-text-wrapper').forEach(wrapper => {
        const parent = wrapper.parentElement;
        if (parent && wrapper.textContent) {
          parent.innerHTML = wrapper.textContent;
        }
      });
    };
  }, [isVisible, isDevMode]); // Removed selectedFramework from dependencies!

  // Listen for scroll events to update overlay positions
  useEffect(() => {
    if (!isDevMode) return;

    const handleScroll = () => {
      // Increment scroll trigger to force overlay re-render with new positions
      setScrollTrigger(prev => prev + 1);
    };

    // Listen to scroll on both window and main element (for nested scrolling)
    window.addEventListener('scroll', handleScroll, { passive: true });
    const mainElement = document.querySelector('main[role="main"]');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true } as AddEventListenerOptions);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      const mainElement = document.querySelector('main[role="main"]');
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isDevMode]);

  // Generate code when framework changes
  useEffect(() => {
    if (selectedElement) {
      generateCodeForElement(selectedElement);
    }
  }, [selectedFramework]);

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
      data-inspector-panel="true"
      className={`fixed bottom-3 z-[50] flex flex-col rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 ${
        dockPosition === "right" ? "right-3" : "left-3"
      }`}
      style={{ 
        width: panelWidth,
        height: '50vh', // Fixed height: half of viewport
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
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 select-none">
            Inspector
          </h2>
          {isDevMode && (
            <span className="flex items-center gap-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
              <span className="material-symbols-outlined text-[14px]">code</span>
              Dev Mode
            </span>
          )}
        </div>
        
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
                  className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 z-[10000]"
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
        {/* Tabs */}
        <div className="flex shrink-0 border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("assets")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "assets"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Assets {pageAssets.length > 0 && <span className="ml-1 text-xs">({pageAssets.length})</span>}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "code"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Code
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 pt-4">
          {activeTab === "assets" ? (
            /* Assets Tab - Vertical Layout */
            <div>
              {pageAssets.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No assets found on this page</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {pageAssets.map((asset, index) => (
                    <div key={index}>
                      <div className="group flex items-center gap-3 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        {/* Icon/Preview on the left */}
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-50 p-2 dark:bg-zinc-800">
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
                        </div>

                        {/* Asset Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Asset {index + 1}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {asset.type}
                          </p>
                        </div>

                        {/* Download Controls on the right */}
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Get element position
                              const rect = asset.element.getBoundingClientRect();
                              const absoluteTop = rect.top + window.scrollY;
                              const absoluteLeft = rect.left + window.scrollX;
                              
                              // Calculate centered position
                              const centerY = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
                              const centerX = absoluteLeft - (window.innerWidth / 2) + (rect.width / 2);
                              
                              // Scroll to element
                              window.scrollTo({
                                top: centerY,
                                left: centerX,
                                behavior: 'smooth'
                              });
                              
                              // Add temporary highlight effect
                              asset.element.style.outline = '2px solid #3b82f6';
                              asset.element.style.outlineOffset = '4px';
                              setTimeout(() => {
                                asset.element.style.outline = '';
                                asset.element.style.outlineOffset = '';
                              }, 2000);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                            aria-label="Locate element on page"
                          >
                            <span className="material-symbols-outlined text-[16px]">my_location</span>
                          </button>
                          <AssetDropdown
                            value={assetFormats[index] || "SVG"}
                            onChange={(value) => setAssetFormats({ ...assetFormats, [index]: value })}
                            onDownload={() => handleDownload(index)}
                          />
                        </div>
                      </div>
                      {/* Separator - not shown after last item */}
                      {index < pageAssets.length - 1 && (
                        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Code Tab */
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Code Snippet</h3>
                <FrameworkDropdown
                  value={selectedFramework}
                  onChange={setSelectedFramework}
                />
              </div>
              {generatedCode ? (
                <div className="relative overflow-auto rounded-lg">
                  <SyntaxHighlighter
                    language={selectedFramework === "HTML" ? "html" : selectedFramework === "Vue" ? "vue" : "jsx"}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                    }}
                    showLineNumbers
                  >
                    {generatedCode}
                  </SyntaxHighlighter>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    showToastNotification('Code copied to clipboard');
                  }}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-zinc-700 text-zinc-200 transition-colors hover:bg-zinc-600"
                  aria-label="Copy code"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                  <div className="text-center">
                    <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {isDevMode ? 'Click an element to inspect' : 'Enable Dev Mode'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {isDevMode 
                        ? 'Select any element on the page to see its code'
                        : 'Turn on Dev Mode from the menu to inspect elements'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Measurement Overlays */}
      {isDevMode && (
        <>
          {/* Show selected element (blue border) */}
          {selectedElement && (
            <MeasurementOverlay 
              element={selectedElement} 
              isSelected={true} 
              selectedElement={selectedElement}
              hoveredElement={hoveredElement}
              scrollTrigger={scrollTrigger}
            />
          )}
          {/* Show hovered element (orange border with measurements to selected) */}
          {hoveredElement && (
            <MeasurementOverlay 
              element={hoveredElement} 
              isSelected={false} 
              selectedElement={selectedElement}
              hoveredElement={hoveredElement}
              scrollTrigger={scrollTrigger}
            />
          )}
        </>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className="pointer-events-none fixed inset-0 z-[250] flex items-end justify-center p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 rounded-lg border border-blue-500 bg-blue-600 px-4 py-3 shadow-lg dark:border-blue-400 dark:bg-blue-500">
              <span className="material-symbols-outlined text-[20px] leading-none text-white">
                check_circle
              </span>
              <span className="text-sm font-medium text-white">
                {toastMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
