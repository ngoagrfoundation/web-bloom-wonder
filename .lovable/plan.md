

## Fix Contact Form, Page Banners, Footer Links & Mobile Header

### Overview
This plan addresses 4 issues across both desktop and mobile versions:
1. Contact form phone placeholder showing misleading number
2. Events, News, and Donate pages have empty banner hero sections
3. Footer links not navigating properly
4. Mobile header hamburger menu not visible on few mobile screens

---

### Issue 1: Contact Form Phone Placeholder

**Problem:** The phone field shows `9876543210` as placeholder, which looks like a real number and may confuse users.

**Solution:** Change placeholder to a clearly fake format: `99999 99999`

**File:** `src/components/forms/ContactForm.tsx`

**Change on line 130:**
```jsx
// Before:
placeholder="9876543210"

// After:
placeholder="99999 99999"
```

---

### Issue 2: Empty Banner Sections on Events, News, Donate Pages

**Problem:** The hero sections on these pages use only a gradient (`maroon-gradient`) but no background image, making the text hard to read and the banner appear empty.

**Solution:** Add background images to each page's hero section. Use existing Unsplash images from the event/news data or high-quality fallback images.

**File: `src/pages/Events.tsx`**

Update hero section (lines 103-114) to include a background image:
```jsx
<section className="py-16 relative overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200')" }}
  />
  <div className="absolute inset-0 bg-primary/85" />
  <div className="container mx-auto px-4 relative z-10">
    {/* Content remains the same */}
  </div>
</section>
```

**File: `src/pages/News.tsx`**

Update hero section (lines 184-195) similarly:
```jsx
<section className="py-16 relative overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200')" }}
  />
  <div className="absolute inset-0 bg-primary/85" />
  <div className="container mx-auto px-4 relative z-10">
    {/* Content remains the same */}
  </div>
</section>
```

**File: `src/pages/Donate.tsx`**

Update hero section (lines 24-36) similarly:
```jsx
<section className="py-16 relative overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200')" }}
  />
  <div className="absolute inset-0 bg-primary/85" />
  <div className="container mx-auto px-4 relative z-10">
    {/* Content remains the same */}
  </div>
</section>
```

---

### Issue 3: Footer Links Not Working

**Problem:** The footer uses `<Link>` components from React Router, but links with hash anchors (like `/#about`, `/#programs`) need special handling to scroll to sections.

**Root Cause:** When clicking a footer link like `/#about` from another page, the `<Link>` component navigates to `/` but doesn't scroll to the `#about` section.

**Solution:** Add the same smooth scroll handling logic used in MobileHeader to the Footer component.

**File:** `src/components/Footer.tsx`

Add navigation hook and click handler:
```jsx
import { useNavigate, useLocation, Link } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.includes('#')) {
      e.preventDefault();
      const hash = href.split('#')[1];
      
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };
  
  // Use onClick handler for links with hash anchors
  // Regular links continue to use <Link to={...}>
};
```

---

### Issue 4: Mobile Header Not Visible on Small Screens

**Problem:** On very small mobile devices, users need to zoom out to see the hamburger menu. The header layout may be clipping or the elements don't fit properly.

**Root Cause Analysis:**
- The header has `h-14` (56px) height
- The logo has `h-10` (40px) height
- Container uses `px-4` padding on each side
- On very narrow screens (< 320px), the layout may not have enough space

**Solution:** 
1. Add `min-h-14` to ensure consistent height
2. Use `max-w-full` on the logo to prevent overflow
3. Add `flex-shrink-0` to the menu button to prevent it from shrinking
4. Add `overflow-x-hidden` to the header to prevent horizontal scroll
5. Add responsive logo sizing for very small screens

**File:** `src/components/mobile/MobileHeader.tsx`

```jsx
<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border overflow-x-hidden">
  <div className="flex items-center justify-between h-14 min-h-14 px-3 sm:px-4 w-full max-w-full">
    {/* Logo - responsive sizing */}
    <Link to="/" className="flex items-center flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
      <img 
        src={agrLogo} 
        alt="AGR Foundation" 
        className="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-none"
      />
    </Link>

    {/* Menu Button - prevent shrinking */}
    <button
      className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors flex-shrink-0"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-label="Toggle menu"
    >
      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>
</header>
```

Also add CSS safety in `src/index.css`:
```css
/* Prevent horizontal overflow on mobile */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}
```

---

### Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/components/forms/ContactForm.tsx` | Change phone placeholder to `99999 99999` |
| `src/pages/Events.tsx` | Add background image to hero section |
| `src/pages/News.tsx` | Add background image to hero section |
| `src/pages/Donate.tsx` | Add background image to hero section |
| `src/components/Footer.tsx` | Add smooth scroll handling for hash links |
| `src/components/mobile/MobileHeader.tsx` | Fix responsive sizing for small screens |
| `src/index.css` | Add overflow protection for mobile |

---

### After Implementation

- Contact form will show a clearly fake placeholder number
- Events, News, and Donate pages will have attractive banner images behind the hero text
- Footer links will properly navigate and scroll to sections on the home page
- Mobile header will fit and be fully visible on all screen sizes (320px and up)

