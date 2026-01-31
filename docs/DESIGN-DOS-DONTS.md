# BI Handoffs — Design Do's and Don'ts

Design guidelines for the BI Handoffs app. Use this when handing off to another designer or when implementing new UI.

---

## Design system overview

| Area | Value |
|------|--------|
| **Font** | DM Sans (global) |
| **Styling** | Tailwind CSS only |
| **Themes** | Light and dark (class-based on `<html>`) |
| **Platforms** | Web + mobile web (responsive) |
| **Icons** | Lucide React |
| **Motion** | Framer Motion (sparingly) |

---

## Do's

### Styling

- **Use only Tailwind CSS** for layout, spacing, colors, typography, and responsive design.
- **Always support light and dark mode** — every UI surface must have both `light` and `dark:` variants (e.g. `bg-white dark:bg-zinc-950`, `text-zinc-900 dark:text-zinc-100`).
- **Prefer Tailwind utilities** over Tamagui style props or inline styles when both are possible.
- **Use the project color palette** — zinc for neutrals (e.g. `zinc-50`, `zinc-900`), `background` / `foreground` CSS variables where defined in `globals.css`.

### Responsive (web + mobile web)

- **Design for both desktop and mobile web.** Use Tailwind breakpoints: `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px.
- **Use fluid layouts** — e.g. `w-full` with `max-w-*` where needed; responsive padding like `px-4 sm:px-6 md:px-8 lg:px-16`.
- **Touch targets on mobile:** interactive elements (buttons, links, toggles) must be at least **44×44px** — use `min-h-11 min-w-11` or `min-h-12`.
- **Add `touch-manipulation`** on tappable elements to reduce tap delay on mobile.
- **Full-height on mobile:** use `min-h-dvh` for viewport height (accounts for browser chrome); pair with `md:min-h-screen` on desktop if needed.
- **Avoid horizontal overflow** — use `overflow-x-hidden` on root when appropriate; test on narrow viewports (320px–400px).

### Safe areas and notches

- **Respect safe areas** — body uses `env(safe-area-inset-*)` for notched devices; avoid placing critical UI in inset regions.

### Interaction and motion

- **Use Framer Motion** only where it adds clarity (e.g. expand/collapse, subtle entrance).
- **Avoid scale-on-tap** for cards and list items — no `active:scale-*` on card/row triggers (per product decision).
- **Use `transition-colors`** for hover/focus where appropriate.

### Accessibility

- **Provide `aria-label`** on icon-only buttons (e.g. theme toggle).
- **Use semantic HTML** and `aria-expanded` / `aria-controls` for expandable sections.
- **Ensure sufficient contrast** in both light and dark themes.

### Consistency

- **Match existing patterns** — cards: `rounded-lg`, `border border-zinc-200 dark:border-zinc-800`; spacing: `gap-3 sm:gap-4`, `px-4 py-3 sm:px-5 sm:py-3.5`.
- **Typography scale** — titles `text-sm font-medium sm:text-base` or `text-2xl sm:text-3xl`; body `text-sm sm:text-base`; captions `text-xs sm:text-sm`.

---

## Don'ts

### Styling

- **Don't use inline styles** for layout, spacing, or colors (e.g. `style={{ padding: 16 }}`).
- **Don't add raw CSS** (e.g. CSS modules or global rules) for things Tailwind can do (layout, spacing, colors, typography).
- **Don't use Tamagui style props** for visual styling when Tailwind classes achieve the same result.
- **Don't introduce new color systems** — stick to zinc and project CSS variables (`--background`, `--foreground`).

### Themes and contrast

- **Don't ship UI that only works in light or only in dark** — every screen and component must look correct in both.
- **Don't rely on `prefers-color-scheme` alone** — theme is controlled by the app (next-themes) and the `dark` class on `<html>`.

### Responsive and touch

- **Don't use fixed pixel widths** for key layout (e.g. full-width cards) — use `w-full` and `max-w-*` instead.
- **Don't make touch targets smaller than 44×44px** on mobile.
- **Don't assume desktop-only** — test at 320px and 375px width.

### Motion and interaction

- **Don't add scale-on-tap** (`active:scale-*`) to cards or list row buttons.
- **Don't overuse motion** — avoid unnecessary animations that don’t aid understanding.

### Layout and overflow

- **Don't cause horizontal scroll** on small viewports — avoid fixed widths that exceed the viewport and test on narrow screens.
- **Don't ignore safe-area insets** for full-bleed or fixed UI on notched devices.

---

## Quick reference

### Example: card with light/dark and responsive

```tsx
<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
  <div className="px-4 py-3 sm:px-5 sm:py-4">
    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:text-base">Title</h3>
    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Description</p>
  </div>
</div>
```

### Example: tappable button (no scale on tap)

```tsx
<button
  type="button"
  className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg p-2.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
  aria-label="Action name"
>
  <Icon className="h-5 w-5" />
</button>
```

### Breakpoints

| Prefix | Min width |
|--------|-----------|
| (default) | 0px |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

### Common colors (light / dark)

| Use | Light | Dark |
|-----|--------|------|
| Background (page) | `bg-zinc-50` | `dark:bg-zinc-950` |
| Background (surface) | `bg-white` | `dark:bg-zinc-900` |
| Text (primary) | `text-zinc-900` | `dark:text-zinc-100` |
| Text (secondary) | `text-zinc-600` | `dark:text-zinc-400` |
| Border | `border-zinc-200` | `dark:border-zinc-800` |
| Hover (surface) | `hover:bg-zinc-50` | `dark:hover:bg-zinc-800/80` |

---

## File references

- **Global styles / theme:** `src/app/globals.css`
- **Layout / viewport / font:** `src/app/layout.tsx`
- **Component examples:** `src/components/ModuleListItem.tsx`, `src/components/ThemeToggle.tsx`
- **Project rules (Tailwind + themes):** `.cursor/rules/tailwind-and-themes.mdc`

If something isn’t covered here, align with existing components and the rules above (Tailwind-only, light + dark, responsive, no scale-on-tap for cards).
