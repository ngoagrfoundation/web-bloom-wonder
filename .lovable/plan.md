

## Fix Mobile Hamburger Menu Not Showing

### Problem Identified

The mobile navigation menu is not visible when clicking the hamburger button because of a CSS conflict:

1. The `<header>` element has `overflow-x-hidden` class (line 73)
2. The navigation menu `<nav>` is a child of the header and uses `position: absolute` with `top-14` to appear below the header
3. The `overflow-x-hidden` on the parent is clipping the dropdown menu that extends beyond the header's boundaries

### Solution

Remove `overflow-x-hidden` from the header element. The global overflow protection in `index.css` (applied to `html, body`) is sufficient to prevent horizontal scrolling issues.

---

### File to Modify

**`src/components/mobile/MobileHeader.tsx`**

**Current code (line 73):**
```jsx
<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border overflow-x-hidden">
```

**Updated code:**
```jsx
<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
```

Simply remove `overflow-x-hidden` from the header className.

---

### Why This Works

- The `overflow-x-hidden` was added to prevent horizontal scrolling issues on small screens
- However, this same property clips any child elements that extend beyond the header's box
- Since the dropdown menu is positioned absolutely to appear below the header (at `top-14`), it gets clipped
- The global `html, body { overflow-x-hidden }` in `index.css` already handles page-level horizontal overflow, so removing it from the header is safe

---

### Summary

| File | Change |
|------|--------|
| `src/components/mobile/MobileHeader.tsx` | Remove `overflow-x-hidden` from header className |

### After Implementation

The hamburger menu will open and display the full navigation menu when clicked on mobile devices.

