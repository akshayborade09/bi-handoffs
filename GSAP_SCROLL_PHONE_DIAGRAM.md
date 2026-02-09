# GsapScrollPhone - Visual Guide

## Component Structure

```
┌─────────────────────────────────────────────────┐
│  Section Container (400vh height)               │
│  ┌───────────────────────────────────────────┐  │
│  │  Pinned Container (h-screen, centered)    │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Phone Frame (390px width)          │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │ Screen (overflow: hidden)     │  │  │  │
│  │  │  │ ┌───────────────────────────┐ │  │  │  │
│  │  │  │ │ Content (y: 0 → -3500px) │ │  │  │  │
│  │  │  │ │                           │ │  │  │  │
│  │  │  │ │ [Section 1]               │ │  │  │  │
│  │  │  │ │ [Section 2]               │ │  │  │  │
│  │  │  │ │ [Section 3]               │ │  │  │  │
│  │  │  │ │ [Section 4]               │ │  │  │  │
│  │  │  │ │ ...                       │ │  │  │  │
│  │  │  │ └───────────────────────────┘ │  │  │  │
│  │  │  └───────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Scroll Timeline

### Phase 1: Initial State (Scroll: 0%)
```
┌──────────────────┐
│   Viewport       │
│  ┌────────────┐  │
│  │   Phone    │  │  ← Phone in center
│  │ ┌────────┐ │  │
│  │ │Content │ │  │  ← Content at y: 0
│  │ │  Top   │ │  │
│  │ └────────┘ │  │
│  └────────────┘  │
└──────────────────┘
```

### Phase 2: Mid-Scroll (Scroll: 50%)
```
┌──────────────────┐
│   Viewport       │
│  ┌────────────┐  │
│  │   Phone    │  │  ← Phone PINNED (stays fixed)
│  │ ┌────────┐ │  │
│  │ │Content │ │  │  ← Content at y: -1750px
│  │ │ Middle │ │  │
│  │ └────────┘ │  │
│  └────────────┘  │
└──────────────────┘
```

### Phase 3: Complete (Scroll: 100%)
```
┌──────────────────┐
│   Viewport       │
│  ┌────────────┐  │
│  │   Phone    │  │  ← Phone still centered
│  │ ┌────────┐ │  │
│  │ │Content │ │  │  ← Content at y: -3500px
│  │ │ Bottom │ │  │
│  │ └────────┘ │  │
│  └────────────┘  │
└──────────────────┘
```

## Animation Mechanics

### Scroll Distance
```
Total Section Height: 400vh (4 × viewport height)

User scrolls 1vh → Content moves proportionally
User scrolls 400vh → Content moves -3500px (full travel)
```

### Pin Behavior
```
Start: top top    (when section top hits viewport top)
  ↓
  Pin phone container (stays in center)
  ↓
  Content scrolls inside
  ↓
End: bottom bottom (when section bottom hits viewport bottom)
  ↓
  Unpin (resume normal scroll)
```

### Scrub Effect
```
scrub: 2

User Scroll:  ━━━━━━━━━━━━►
Animation:    ━━━━━━━━━━━━► (smooth lag)
              
No scrub:     Instant jump
scrub: 1:     Direct follow
scrub: 2:     Smooth lag (RECOMMENDED)
scrub: 3:     More lag
```

## Code Flow

```typescript
1. Component mounts
   ↓
2. useEffect runs
   ↓
3. Create ScrollTrigger
   - Set trigger: section element
   - Set pin: phone element
   - Set scrub: 2 (smoothness)
   ↓
4. Create GSAP timeline
   - fromTo: y: 0 → y: -contentHeight
   - ease: none (linear)
   ↓
5. User scrolls
   - Phone stays fixed (pinned)
   - Content moves up inside
   ↓
6. Animation completes
   - Phone unpins
   - Normal scroll resumes
   ↓
7. Component unmounts
   - Cleanup: Kill timeline & triggers
```

## Props Impact

### phoneWidth
```
phoneWidth={390}  → Standard iPhone size
phoneWidth={320}  → Smaller phone
phoneWidth={428}  → Larger phone (iPhone Pro Max)
```

### contentHeight
```
contentHeight={3000}  → Short scroll
contentHeight={5000}  → Long scroll
contentHeight={10000} → Very long scroll
```

**Formula**: Total scroll distance = Section height (400vh)

### scrub
```
scrub={0}  → No smoothing (instant)
scrub={1}  → Direct follow
scrub={2}  → Smooth (RECOMMENDED)
scrub={3}  → Very smooth (more lag)
```

## Real-World Example

### Apple-Style Product Showcase
```tsx
<GsapScrollPhone
  phoneImage="/iphone-frame.png"
  contentImage="/app-features.png"
  phoneWidth={390}
  contentHeight={4500}
/>
```

### App Demo with Multiple Screens
```tsx
<GsapScrollPhone
  phoneImage="/android-frame.png"
  contentImage="/onboarding-flow.png"
  phoneWidth={360}
  contentHeight={6000}
/>
```

### Portfolio Case Study
```tsx
<GsapScrollPhone
  phoneImage="/mobile-mockup.png"
  contentImage="/design-showcase.png"
  phoneWidth={375}
  contentHeight={8000}
/>
```

## Performance Metrics

### Ideal Setup
- Image size: < 2MB each
- Image format: WebP or PNG
- Scroll distance: 400-600vh
- Content height: 3000-6000px
- Scrub value: 2

### Performance Checklist
✅ Optimized images (compressed)
✅ Proper dimensions (not oversized)
✅ Smooth scrub value (2 recommended)
✅ Cleanup on unmount
✅ requestAnimationFrame handled by GSAP

## Common Patterns

### Pattern 1: Hero → Phone → CTA
```tsx
<Hero />
<GsapScrollPhone {...props} />
<CallToAction />
```

### Pattern 2: Multiple Phones
```tsx
<GsapScrollPhone phoneImage="/phone1.png" contentImage="/app1.png" />
<TextSection />
<GsapScrollPhone phoneImage="/phone2.png" contentImage="/app2.png" />
```

### Pattern 3: With Parallax Cards
```tsx
<section>
  <ParallaxCard position="left" />
  <GsapScrollPhone {...props} />
  <ParallaxCard position="right" />
</section>
```

## Debugging Tips

### Check Animation State
```javascript
// In browser console
ScrollTrigger.getAll() // See all triggers
ScrollTrigger.refresh() // Recalculate positions
```

### Verify Pin
```javascript
// Phone should have inline styles when pinned
// Check: position: fixed, top: 0, left: 0
```

### Test Scrub Values
```javascript
// Try different values in real-time
timeline.scrollTrigger.scrub = 3
```

## Best Practices

1. ✅ Always use `'use client'` directive
2. ✅ Clean up ScrollTrigger on unmount
3. ✅ Use refs for DOM targeting
4. ✅ Set proper content height
5. ✅ Test on multiple devices
6. ✅ Optimize images before deployment
7. ✅ Use scrub: 2 for smoothness
8. ✅ Add loading states for images
9. ✅ Consider accessibility (reduced motion)
10. ✅ Test scroll performance

## Accessibility Considerations

```tsx
// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable or simplify animation
  timeline.scrollTrigger.scrub = false;
}
```
