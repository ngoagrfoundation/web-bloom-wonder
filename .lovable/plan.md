

## 6 Fixes: Reels Design, YouTube Section, Gallery Dropdown, Stray Images, Ticker Color, Partners/Sponsors

### Root Cause Analysis

| Issue | Root Cause |
|-------|-----------|
| 1. Reels section too tall | Uses `aspect-[9/16]` (portrait) cards with `py-24` padding |
| 2. YouTube videos need separate section + admin control | Currently mixed into ReelsSection; no admin toggle for which YT videos to feature |
| 3. Header "Gallery" is a single link | No dropdown with Reels/Photos/Videos sub-links |
| 4. Stray images on landing page not in Gallery | Some sections (About, Programs, etc.) use bundled static images — these are section images, not gallery images. This is by design. |
| 5. Ticker strip color | Currently `bg-gray-900` — not contrasting enough below dark hero |
| 6. Partners & Sponsors not showing | PHP files `public-partners.php` and `public-sponsors.php` use `require_once __DIR__ . '/../config.php'` but config.php is in the same `api/` directory, so the path should be `__DIR__ . '/config.php'`. This causes a fatal PHP error. |

---

### Implementation

#### 1. Reels Section — Reduce Height + Enhance Design

**File: `src/components/ReelsSection.tsx`**
- Reduce section padding: `py-24` to `py-16`
- Change card aspect ratio from `aspect-[9/16]` (portrait) to `aspect-video` (16:9 landscape)
- Reduce card width from `w-[220px] md:w-[260px]` to `w-[280px] md:w-[320px]`
- Add subtle gradient overlay on thumbnails for better text readability
- Overall height reduction of ~40%

#### 2. YouTube Videos — Separate Section Above Footer + Admin Control

**File: `src/components/YouTubeSection.tsx`** (NEW)
- New dedicated section showing YouTube channel videos in a grid
- Fetches from `fetchYouTubeVideos()` (existing function)
- Admin can mark specific YouTube videos to feature via Reels Manager (add a `is_featured_yt` flag concept — or simpler: admin sets which YT videos to show by adding them as reels with YouTube URLs)
- Placed in Index.tsx between Sponsors and Contact sections

**File: `src/pages/Index.tsx`**
- Add `YouTubeSection` component before `ContactSection`
- Add `isEnabled("youtube")` toggle

#### 3. Header "Gallery" → Dropdown with Reels, Photos, Videos

**File: `src/components/Header.tsx`**
- Change `Gallery` from a plain link to a dropdown menu with 3 items:
  - "Reels" → `/gallery?tab=reels` (or a scroll-to anchor)
  - "Photos" → `/gallery?tab=photos`
  - "Videos" → `/gallery?tab=videos`

**File: `src/components/mobile/MobileHeader.tsx`**
- Same dropdown change for mobile nav

**File: `src/pages/Gallery.tsx`**
- Add a "Reels" tab alongside "Photos" and "Videos"
- Read `?tab=` query param to set initial active tab

#### 4. Stray Images Clarification

The images you see on the landing page (About section photo, Program card images, Sustainability background) are **section images**, not gallery images. They are managed via **Admin → Landing Page Controls** where you can upload replacements. This is working as designed — they are not supposed to appear in the Gallery.

#### 5. Events Ticker — Yellow/Contrasting Color

**File: `src/components/EventsTicker.tsx`**
- Change `bg-gray-900` to `bg-amber-500 text-black` (yellow strip)
- Update text colors for contrast: labels in `text-black/70`, dots in `text-black/30`

#### 6. Partners & Sponsors — Fix PHP Include Path

**File: `public/api/public-partners.php`**
- Change `require_once __DIR__ . '/../config.php'` to `require_once __DIR__ . '/config.php'`
- The file is in `public/api/` and `config.php` is also in `public/api/`, so `/../` goes one level too high

**File: `public/api/public-sponsors.php`**
- Same fix: `require_once __DIR__ . '/config.php'`

This is the critical bug — the PHP fatal error means the API returns nothing, so the React components hide the sections.

---

### Files Summary

| File | Change |
|------|--------|
| `src/components/ReelsSection.tsx` | Reduce height, landscape cards, enhanced design |
| `src/components/YouTubeSection.tsx` | NEW — dedicated YouTube section above footer |
| `src/pages/Index.tsx` | Add YouTubeSection |
| `src/components/Header.tsx` | Gallery → dropdown (Reels, Photos, Videos) |
| `src/components/mobile/MobileHeader.tsx` | Same Gallery dropdown |
| `src/pages/Gallery.tsx` | Add "Reels" tab, read `?tab=` param |
| `src/components/EventsTicker.tsx` | Yellow/amber background |
| `public/api/public-partners.php` | Fix config.php include path |
| `public/api/public-sponsors.php` | Fix config.php include path |

### After Deployment
- Upload the fixed `public-partners.php` and `public-sponsors.php` to cPanel — Partners and Sponsors will immediately appear on the landing page

