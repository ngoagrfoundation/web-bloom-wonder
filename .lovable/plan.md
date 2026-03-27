

## Update About Section, Add 3 New Program Pages, Update 2 Existing Pages

### Overview

6 changes across the site:
1. **Update About Us** section with new content (5 core pillars, new vision)
2. **Create Dental Treatment** program page + add to Programs menu
3. **Create Learning Sanskrit** program page + add to Programs menu
4. **Update Rural Development** page with detailed new content
5. **Create Annadanam (Food Distribution)** program page + add to Programs menu
6. **Update Skill Development** page with detailed new content

### Structural Change: Programs Menu

Currently, the desktop Header has "Programs" as a simple hash link (`/#programs`). It needs to become a **dropdown menu** (like "Our Focus" and "Causes") with items:
- Education
- Healthcare
- Livelihood
- Dental Treatment *(new)*
- Learning Sanskrit *(new)*
- Food Distribution *(new)*

The mobile header already has Programs as a dropdown -- just needs the 3 new items added.

---

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/programs/DentalTreatment.tsx` | Dental Treatment page using `ProgramPageLayout` |
| `src/pages/programs/LearningSanskrit.tsx` | Learning Sanskrit page using `ProgramPageLayout` |
| `src/pages/programs/FoodDistribution.tsx` | Annadanam page using `ProgramPageLayout` |

Each page will use the existing `ProgramPageLayout` component with the content provided. For sections that need richer content (like Sanskrit's "Why Learn" details, Rural Development's sub-sections, etc.), I'll use the `children` prop or the `activities` array to capture the key information.

**Note**: These pages need hero images. I'll generate 3 AI images:
- `src/assets/generated/programs/dental-treatment.jpg` - Free dental camp in India
- `src/assets/generated/programs/learning-sanskrit.jpg` - Sanskrit class/Vedic learning
- `src/assets/generated/programs/food-distribution.jpg` - Annadanam/food serving to needy

### Files to Modify

| File | Change |
|------|--------|
| `src/components/AboutSection.tsx` | Replace content with new story, 5 core pillars, and vision |
| `src/components/Header.tsx` | Change "Programs" from hash link to dropdown with 6 items |
| `src/components/mobile/MobileHeader.tsx` | Add 3 new programs to existing dropdown |
| `src/App.tsx` | Add 3 new routes: `/programs/dental-treatment`, `/programs/learning-sanskrit`, `/programs/food-distribution` |
| `src/pages/focus/RuralDevelopment.tsx` | Replace content with detailed new content (3 sections, philosophy) |
| `src/pages/focus/SkillDevelopment.tsx` | Replace content with detailed new content (3 sections, model) |
| `src/components/ProgramsSection.tsx` | Add the 3 new programs to the homepage grid |
| `src/components/Footer.tsx` | Update Programs links to include new pages |

---

### Content Details

**1. About Section** - Replace "Our Mission" bullet list with "Our Core Pillars" (Social Welfare, Women's Empowerment, Environmental Safety, Skill Development, Rural Development) with descriptions. Add "Our Vision" block replacing the current quote.

**2. Dental Treatment Page** - Activities: Check-ups, Cleaning, Fillings, RCT, Extractions, Oral Hygiene Education. Stats: Monthly on 28th, 10AM-5PM, Hyderabad. Include registration CTA linking to external form. "Prior registration mandatory" note.

**3. Learning Sanskrit Page** - Activities: Mind benefits, Children's benefits, Couples harmony, Vedic access. Course details: 21 days, free, Zoom. 3 batch timings. Bhagavad Gita Parayanam invitation. WhatsApp registration CTA.

**4. Rural Development** - 3 main sections as initiatives: Sustainable Agriculture (garlic, apiculture, drones), Village-to-Market (community markets, millet hubs, waste-to-wealth), Environmental Restoration (pond restoration, plastic-free, spiritual hubs). Stats: 100+ Farmers, 20+ Women, 5000+ Plastic Bags Replaced.

**5. Annadanam Page** - Activities: Need-based selection, flexible distribution, quality & dignity. Donation tiers (₹500, ₹2500, ₹5000+). WhatsApp coordinator link. Celebrate special days messaging.

**6. Skill Development** - 3 sections as initiatives: Heritage Crafts (earthenware, leaf-craft, Panchagavya), Tech-Enabled Future (drone pilot, value-added farming), Women's Livelihood (millet production, health & income). "Skill to Market" model.

---

### Technical Notes

- The `ProgramPageLayout` accepts `title`, `tagline`, `heroImage`, `overview`, `activities[]`, `stats[]`, `relatedFocus[]`, and `children` -- sufficient for all 3 new pages
- For pages needing richer content (registration CTAs, special sections), I'll use the `children` prop to add custom content below the standard layout
- The `FocusPageLayout` used by Rural Development and Skill Development accepts `overview`, `whyItMatters`, `initiatives[]`, `stats[]`, `relatedCauses[]` -- I'll map the detailed sub-sections into the initiatives array

