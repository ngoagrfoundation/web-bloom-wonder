

## Google Forms Update and New Forms Plan

### Overview

This plan will:
1. Update Contact Form and Volunteer Form with your real Google Form embed URLs
2. Remove all banana leaf-related content from the website
3. Add two new Google Form sections: "Partner with Us" and "Report a Challenge"

---

### Step 1: Update Google Form URLs

#### A. Update Contact Form
**File:** `src/components/ContactSection.tsx`

Replace the placeholder URL with your actual Contact Form URL:
```
FROM: YOUR_CONTACT_GOOGLE_FORM_EMBED_URL_HERE
TO: https://docs.google.com/forms/d/e/1FAIpQLScFud-Iu30I2-TAkcmOsgyk0EA8UNViTIJ7OrBquMiUtvp4gg/viewform?embedded=true
```

#### B. Update Volunteer Form
**File:** `src/components/VolunteerFormSection.tsx`

Replace the placeholder URL with your actual Volunteer Form URL:
```
FROM: YOUR_VOLUNTEER_GOOGLE_FORM_EMBED_URL_HERE
TO: https://docs.google.com/forms/d/e/1FAIpQLSeAOB76FS8FHLh-IdC2EcTkYS-SP7b1aUgcN7Lxz9ic9YXowQ/viewform?embedded=true
```

---

### Step 2: Remove All Banana Leaf Content

#### A. Delete Banana Leaf Request Section
**File to DELETE:** `src/components/BananaLeafRequestSection.tsx`

#### B. Update Environmental Safety Page
**File:** `src/pages/focus/EnvironmentalSafety.tsx`

- Remove import of `BananaLeafRequestSection`
- Remove the `<BananaLeafRequestSection />` component from the page
- Update content to remove banana leaf-specific references:
  - Change "Banana Leaf Distribution" initiative to "Sustainable Alternatives Program"
  - Update stats to remove banana leaf count
  - Update description text to focus on general eco-friendly practices

#### C. Update Sustainability Section
**File:** `src/components/SustainabilitySection.tsx`

- Rename "Banana Leaf Initiatives" to "Sustainable Materials" or similar
- Update description to focus on general eco-friendly alternatives

#### D. Update Volunteer Form Section
**File:** `src/components/VolunteerFormSection.tsx`

- Remove "Banana Leaf Distribution" from the initiatives list
- Keep other initiatives: Eco-Packaging Training, Tree Plantation, Lake Cleaning, Zero Waste Workshops

#### E. Update Testimonials Section
**File:** `src/components/TestimonialsSection.tsx`

- Remove the banana leaf testimonial from Lakshmi Prasad
- Keep the eco-packaging training testimonial from Venkata Rao (since you still want eco-packaging training)

#### F. Update Gallery Section
**File:** `src/components/GallerySection.tsx`

- Remove banana leaf related images (banana-leaf-workshop, banana-leaf-lunch)
- Keep biodegradable bag image
- Replace removed images with other sustainability/community images

#### G. Update Gallery Page
**File:** `src/pages/Gallery.tsx`

- Remove banana leaf related images from the gallery
- Keep biodegradable bag and other sustainability images

---

### Step 3: Create New Form Sections

Before I implement these, you'll need to create two more Google Forms:

#### Google Form: Partner with Us
Create with these suggested fields:
- Organization Name (Short answer, Required)
- Contact Person Name (Short answer, Required)
- Email (Short answer, Required)
- Phone Number (Short answer, Required)
- Organization Type (Dropdown - Corporate, NGO, Government, Educational Institution, Other)
- Partnership Interest (Checkboxes - Funding, Volunteering, Resource Sharing, Joint Programs, Other)
- Message/Proposal (Paragraph, Optional)

#### Google Form: Report a Challenge
Create with these suggested fields:
- Your Name (Short answer, Required)
- Phone Number (Short answer, Required)
- Email (Short answer, Optional)
- Location/Village (Short answer, Required)
- Challenge Type (Dropdown - Healthcare Access, Education, Livelihood, Environment, Infrastructure, Other)
- Describe the Challenge (Paragraph, Required)
- How many people are affected? (Short answer, Optional)
- Any additional information (Paragraph, Optional)

#### A. Create Partner Form Section
**New File:** `src/components/PartnerFormSection.tsx`

- Section with id="partner" for smooth scrolling
- Title: "Partner with Us"
- Description about collaboration opportunities
- Google Form iframe embed with placeholder URL
- Styled consistently with other form sections

#### B. Create Report Challenge Form Section
**New File:** `src/components/ReportChallengeSection.tsx`

- Section with id="report-challenge" for smooth scrolling
- Title: "Report a Challenge"
- Description encouraging community members to report issues
- Google Form iframe embed with placeholder URL
- Styled consistently with other form sections

---

### Step 4: Update Get Involved Section Links

**File:** `src/components/GetInvolvedSection.tsx`

Update the button links to point to the new form sections:
- "Partner with Us" button: Change from `#contact` to `#partner`
- "Report a Challenge" button: Change from `#contact` to `#report-challenge`

---

### Step 5: Add New Sections to Homepage

**File:** `src/pages/Index.tsx`

- Import `PartnerFormSection` and `ReportChallengeSection`
- Add sections to the page (after VolunteerFormSection, before ContactSection)

---

### Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/ContactSection.tsx` | Modify | Update Google Form embed URL |
| `src/components/VolunteerFormSection.tsx` | Modify | Update Google Form URL + remove banana leaf initiative |
| `src/components/BananaLeafRequestSection.tsx` | Delete | Remove entire file |
| `src/pages/focus/EnvironmentalSafety.tsx` | Modify | Remove banana leaf section and references |
| `src/components/SustainabilitySection.tsx` | Modify | Update banana leaf initiative name/description |
| `src/components/TestimonialsSection.tsx` | Modify | Remove banana leaf testimonial |
| `src/components/GallerySection.tsx` | Modify | Remove banana leaf images |
| `src/pages/Gallery.tsx` | Modify | Remove banana leaf images |
| `src/components/PartnerFormSection.tsx` | Create | New Partner with Us form section |
| `src/components/ReportChallengeSection.tsx` | Create | New Report a Challenge form section |
| `src/components/GetInvolvedSection.tsx` | Modify | Update button links to new sections |
| `src/pages/Index.tsx` | Modify | Add new form sections |

---

### What You Need to Do

1. **Approve this plan**
2. **Create two new Google Forms:**
   - Partner with Us form
   - Report a Challenge form
3. **Provide the embed URLs** for these forms (or I'll use placeholders that you can replace later)

---

### What You Get After Implementation

1. Contact Form with your real embed URL (working)
2. Volunteer Form with your real embed URL (working)
3. All banana leaf content removed from the website
4. New "Partner with Us" section with Google Form
5. New "Report a Challenge" section with Google Form
6. Updated Get Involved section with working links to all forms

