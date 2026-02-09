'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface GsapScrollPhoneProps {
  phoneImage?: string;
  contentImage?: string;
  phoneWidth?: number;
  contentHeight?: number;
}

const GsapScrollPhone: React.FC<GsapScrollPhoneProps> = ({
  phoneImage = '/version 3/mobile-frame.png',
  contentImage = '/version 3/app-scroll.png',
  phoneWidth = 390,
  contentHeight = 3000,
}) => {
  // Refs for DOM elements
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure all refs are available
    if (!sectionRef.current || !phoneRef.current || !contentRef.current) return;

    const section = sectionRef.current;
    const phone = phoneRef.current;
    const content = contentRef.current;

    // Create the cinematic scroll animation
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: phone,
        scrub: 2, // Smooth scrubbing (higher = smoother/more lag)
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animate content from top to bottom inside phone
    timeline.fromTo(
      content,
      {
        y: 0,
      },
      {
        y: -contentHeight,
        ease: 'none',
      }
    );

    // Cleanup function
    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [contentHeight]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full bg-gradient-to-b from-white via-gray-50 to-white"
      style={{ height: '400vh' }}
    >
      {/* Pinned Phone Container */}
      <div
        ref={phoneRef}
        className="flex items-center justify-center h-screen"
      >
        {/* Phone Frame */}
        <div
          className="relative"
          style={{ width: `${phoneWidth}px` }}
        >
          {/* Phone Image (Frame) */}
          <img
            src={phoneImage}
            alt="Phone Frame"
            className="relative z-10 w-full h-auto pointer-events-none"
          />

          {/* Screen Container - Content scrolls inside */}
          <div
            className="absolute top-3 left-[14px] right-[14px] bottom-3 bg-white rounded-[45px] overflow-hidden"
            style={{
              /* Hide scrollbar */
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Scrolling Content */}
            <div ref={contentRef} className="w-full">
              <img
                src={contentImage}
                alt="App Content"
                className="w-full h-auto"
                style={{
                  /* Hide scrollbar for webkit browsers */
                  WebkitOverflowScrolling: 'touch',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden CSS to ensure scrollbar is hidden */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default GsapScrollPhone;
