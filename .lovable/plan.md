

## Fixes for 5 Pending Issues + Hero Gradient Change

### Issue Analysis

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| 1. Gallery bulk upload missing, "Categories" label not renamed | Upload dialog only accepts single file; labels say "Category" in some places | Add multi-file input, rename all UI labels |
| 2. Partners & Sponsors not showing on landing page | CORS: Lovable preview calls `agrfoundation.ngo` which blocks the origin. On production it works. The PHP and React code are correct. | Add Lovable preview origins to CORS `$allowed_origins` in config.php |
| 3. Landing Page image controls missing in admin | SiteSettings has hero slides but not About, Programs, Sustainability section images | Add image upload fields for About, Programs, and Sustainability sections to LandingPageControls or SiteSettings |
| 4. Gallery showing "coming soon" placeholder when empty | GallerySection shows an empty state message + "View Full Gallery" link even when no images exist. The section still renders. | Return `null` when no images and not loading (same pattern as Partners/Sponsors) |
| 5. Data sync / static content | About, Programs, Sustainability sections use hardcoded imported images, not database-driven | Make these sections fetch override images from settings, falling back to bundled defaults |
| Hero gradient | Currently `from-primary/90 via-primary/70` (blue) | Change to dark gradient `from-black/80 via-black/60` |
| Events ticker strip | Too thin and same blue as hero, not visible | Increase height, change to darker/contrasting color |
| Preview not updating | API calls fail from Lovable preview because CORS doesn't include `lovableproject.com` or `lovable.app` origins | Add wildcard or specific Lovable origins to config.php |

---

### Implementation Plan

#### 1. Gallery Manager — Bulk Upload + Label Fixes

**File: `src/pages/admin/GalleryManager.tsx`**
- Change file input to accept `multiple` attribute
- When multiple files selected, upload them sequentially with shared folder/tags
- Rename all "Category" labels to "Folder" (already mostly done, verify consistency)
- Add drag-and-drop zone with `onDragOver`/`onDrop` handlers

#### 2. Partners & Sponsors — CORS Fix

**File: `public/api/config.php`**
- Add Lovable preview origins to `$allowed_origins`:
  ```php
  'https://id-preview--9b4911c4-7998-48ee-bb0c-3855e390e28b.lovable.app',
  'https://9b4911c4-7998-48ee-bb0c-3855e390e28b.lovableproject.com',
  ```
- Also add a wildcard check: if origin contains `lovable.app` or `lovableproject.com`, allow it

**Frontend**: The `PartnersSection` and `SponsorsSection` code is already correct — they fetch from API and hide when empty. The issue is purely CORS blocking in preview.

#### 3. Landing Page Image Controls in Admin

**File: `src/pages/admin/LandingPageControls.tsx`**
- Add a new card below section toggles: "Section Images"
- Include image upload fields for:
  - `about_section_image` — About Section photo
  - `programs_education_image`, `programs_healthcare_image`, `programs_livelihood_image`, `programs_dental_image`, `programs_sanskrit_image`, `programs_food_image` — Program cards
  - `sustainability_bg_image` — Make a Difference background
- Uses same `uploadImage` + settings pattern as SiteSettings

**Files: `src/components/AboutSection.tsx`, `src/components/ProgramsSection.tsx`**
- Add `useEffect` to fetch `publicSettings` and override bundled images with admin-uploaded ones if they exist
- Fall back to imported assets when no override is set

#### 4. Gallery Section — Hide When Empty

**File: `src/components/GallerySection.tsx`**
- After loading completes, if `images.length === 0`, return `null` instead of rendering the empty state placeholder
- Same pattern used by Partners, Sponsors, EventsTicker, Testimonials, Reels

#### 5. Hero Gradient + Events Ticker Strip

**File: `src/components/HeroSection.tsx`**
- Change line 106: `bg-gradient-to-r from-primary/90 via-primary/70 to-transparent` → `bg-gradient-to-r from-black/80 via-black/60 to-transparent`

**File: `src/components/EventsTicker.tsx`**
- Change line 42: `bg-primary text-primary-foreground py-2` → `bg-gray-900 text-white py-3`
- Increase padding for better visibility and use a dark contrasting color

#### 6. CORS for Lovable Preview

**File: `public/api/config.php`**
- Add dynamic origin matching for Lovable domains so preview works:
  ```php
  if (in_array($origin, $allowed_origins) || 
      str_contains($origin, 'lovable.app') || 
      str_contains($origin, 'lovableproject.com')) {
      header("Access-Control-Allow-Origin: $origin");
  }
  ```

---

### Files Changed Summary

| File | Change |
|------|--------|
| `src/pages/admin/GalleryManager.tsx` | Bulk upload, drag-drop, label fixes |
| `src/pages/admin/LandingPageControls.tsx` | Add section image upload controls |
| `src/components/GallerySection.tsx` | Return null when empty |
| `src/components/HeroSection.tsx` | Dark gradient overlay |
| `src/components/EventsTicker.tsx` | Darker strip, increased height |
| `src/components/AboutSection.tsx` | Fetch override image from settings |
| `src/components/ProgramsSection.tsx` | Fetch override images from settings |
| `public/api/config.php` | Add Lovable preview CORS origins |

### Why Preview Wasn't Showing Changes

The Lovable preview runs on `lovableproject.com` / `lovable.app` domains, but your `config.php` CORS only allows `agrfoundation.ngo` and `localhost`. All API calls fail with CORS errors (visible in network requests). After deploying the CORS fix to cPanel, the preview will work. Alternatively, the site works correctly when deployed to `agrfoundation.ngo`.

