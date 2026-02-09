# GsapScrollPhone Component

A cinematic, production-ready React component that creates a scroll-driven mobile mockup animation using GSAP and ScrollTrigger.

## Features

✨ **Cinematic Experience**: Premium, smooth scroll animation that pins the phone while content scrolls inside

🎯 **Pinned Phone**: Mobile frame stays centered and fixed during scroll

📱 **Scrolling Content**: Only the screen content inside the phone scrolls vertically

🎨 **Smooth Animation**: Uses GSAP ScrollTrigger with scrub for buttery-smooth playback

🧹 **Clean Code**: Production-ready with proper cleanup and TypeScript support

📐 **Responsive**: Centered layout that adapts to screen sizes

🚫 **Hidden Scrollbar**: Clean UI without visible scrollbars

## Installation

Make sure you have GSAP installed:

```bash
npm install gsap
```

## Basic Usage

```tsx
import GsapScrollPhone from '@/components/GsapScrollPhone';

function MyPage() {
  return (
    <GsapScrollPhone
      phoneImage="/path/to/phone-frame.png"
      contentImage="/path/to/app-content.png"
      phoneWidth={390}
      contentHeight={3500}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `phoneImage` | string | '/version 3/mobile-frame.png' | Path to the phone frame image |
| `contentImage` | string | '/version 3/app-scroll.png' | Path to the scrolling content image |
| `phoneWidth` | number | 390 | Width of the phone in pixels |
| `contentHeight` | number | 3000 | Height of content to scroll through |

## How It Works

### Structure

```
Section (400vh height) ← Scroll container
  └── Pinned Container (h-screen) ← Stays in viewport
        └── Phone Frame ← Visual frame
              └── Screen Container (overflow: hidden) ← Clip mask
                    └── Content (animated y position) ← Scrolls up
```

### Animation Timeline

1. **Initial State**: Content starts at `y: 0` (top visible)
2. **Scroll Progress**: As user scrolls, content moves up (`y: -contentHeight`)
3. **Pin Behavior**: Phone container stays fixed in center of viewport
4. **Scroll Distance**: Takes 400vh (4x viewport height) to complete
5. **Scrub Value**: `scrub: 2` creates smooth, slightly lagged animation

### Key GSAP Concepts

```typescript
ScrollTrigger.create({
  trigger: section,        // Element that triggers the animation
  start: 'top top',        // When top of section hits top of viewport
  end: 'bottom bottom',    // When bottom of section hits bottom of viewport
  pin: phone,              // Element to pin (keep fixed)
  scrub: 2,                // Smooth scrubbing (2 = smoother)
  anticipatePin: 1,        // Prevents jump when pinning starts
});
```

## Customization

### Change Scroll Distance

Modify the section height in the component:

```tsx
style={{ height: '500vh' }} // 5x viewport height
```

### Adjust Smoothness

Change the `scrub` value:
- `scrub: 1` - More responsive (default)
- `scrub: 2` - Smoother (recommended)
- `scrub: 3` - Very smooth but more lag

### Modify Phone Positioning

The phone is centered using Flexbox. Adjust in the pinned container:

```tsx
className="flex items-center justify-center h-screen"
```

### Custom Content

Instead of an image, you can use any HTML:

```tsx
<div ref={contentRef} className="w-full">
  <div className="p-8">
    <h1>Section 1</h1>
    {/* Your custom content */}
  </div>
  <div className="p-8">
    <h1>Section 2</h1>
    {/* More content */}
  </div>
</div>
```

## Advanced Example

### With Hero Section and Multiple Phases

```tsx
import GsapScrollPhone from '@/components/GsapScrollPhone';

export default function AdvancedPage() {
  return (
    <div>
      {/* Hero with fade-out animation */}
      <section className="h-screen">
        <h1>Scroll to see the magic</h1>
      </section>

      {/* Cinematic Phone Section */}
      <GsapScrollPhone
        phoneImage="/phone.png"
        contentImage="/app-content.png"
        phoneWidth={390}
        contentHeight={4000}
      />

      {/* Next Section */}
      <section className="h-screen bg-gray-100">
        <h2>Continue your journey</h2>
      </section>
    </div>
  );
}
```

## Performance Tips

1. **Optimize Images**: Use properly sized images (avoid huge files)
2. **Use WebP**: Modern image format for better performance
3. **Lazy Load**: Load content images only when needed
4. **Will-Change**: GSAP automatically handles this, but you can add:

```css
.scrolling-content {
  will-change: transform;
}
```

## Troubleshooting

### Animation feels jerky
- Increase `scrub` value (try 2 or 3)
- Check if images are too large
- Ensure no heavy JavaScript running during scroll

### Phone doesn't stay centered
- Verify the pinned container has `h-screen`
- Check that `pin: phone` references the correct element

### Content doesn't scroll fully
- Increase `contentHeight` prop
- Adjust section `height` (e.g., '500vh')
- Verify image aspect ratio

### ScrollTrigger not working
- Ensure GSAP is installed: `npm install gsap`
- Check that `gsap.registerPlugin(ScrollTrigger)` is called
- Verify component is client-side: `'use client'` directive

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## License

MIT

## Credits

Built with:
- [GSAP](https://greensock.com/gsap/) - Professional animation library
- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Next.js](https://nextjs.org/) - React framework
