

## Google Forms Integration Plan

### Overview

This plan will integrate Google Forms into your website to collect data that automatically saves to Google Sheets. You'll need to create the Google Forms first, then I'll embed them into the website.

---

### Step 1: Create Your Google Forms (You Need to Do This First)

Before I can embed the forms, you need to create them in Google Forms:

#### Form 1: Contact Form
Create a Google Form with these fields:
- Name (Short answer, Required)
- Email (Short answer, Required)
- Phone Number (Short answer, Optional)
- Message (Paragraph, Required)

#### Form 2: Volunteer Registration Form
Create a Google Form with these fields:
- Full Name (Short answer, Required)
- Email (Short answer, Required)
- Phone Number (Short answer, Required)
- Age (Short answer, Optional)
- Location/Village (Short answer, Required)
- Which initiatives interest you? (Checkboxes - Banana Leaf Distribution, Eco-Packaging Training, Tree Plantation, Lake Cleaning, Zero Waste Workshops)
- Previous volunteer experience (Paragraph, Optional)
- Availability (Checkboxes - Weekdays, Weekends, Flexible)

#### Form 3: Request Banana Leaves Form
Create a Google Form with these fields:
- Your Name (Short answer, Required)
- Phone Number (Short answer, Required)
- Email (Short answer, Optional)
- Event Type (Dropdown - Wedding, Birthday, Festival, Religious Function, Other)
- Number of Banana Leaves Required (Short answer, Required)
- Event Date (Date picker, Required)
- Delivery Address (Paragraph, Required)
- Additional Notes (Paragraph, Optional)

**How to get the embed link:**
1. Create your form in Google Forms
2. Click the "Send" button
3. Click the embed icon (looks like < >)
4. Copy the iframe code or the URL inside it

---

### Step 2: What I Will Build

#### A. Update Contact Section
**File:** `src/components/ContactSection.tsx`

- Remove the existing custom React form
- Add a Google Form iframe embed with proper styling
- Keep the contact information (address, phone, email) and social links
- Keep the Google Maps embed
- Add responsive sizing for the form iframe

#### B. Create New Volunteer Registration Section
**File:** `src/components/VolunteerFormSection.tsx` (new file)

- Create a new section component for volunteer registration
- Include a Google Form iframe embed
- Add descriptive text about volunteering opportunities
- Style consistently with the rest of the website

#### C. Create Banana Leaf Request Section
**File:** `src/components/BananaLeafRequestSection.tsx` (new file)

- Create a dedicated section for banana leaf requests
- Include a Google Form iframe embed
- Add information about the banana leaf distribution program
- Include FAQ about delivery, availability, and quantities

#### D. Update Environmental Safety Page
**File:** `src/pages/focus/EnvironmentalSafety.tsx`

- Add the Banana Leaf Request form section to this page
- This is the most logical place since it relates to eco-friendly initiatives

#### E. Update Get Involved Section
**File:** `src/components/GetInvolvedSection.tsx`

- Update the "Volunteer" button to link to the new volunteer form section
- Add smooth scrolling to the volunteer form

#### F. Update Homepage
**File:** `src/pages/Index.tsx`

- Add the VolunteerFormSection before or after the Contact section
- Ensure proper section ordering

---

### Step 3: Technical Implementation Details

#### Google Form Iframe Structure
```text
+------------------------------------------+
|  Section Container (styled background)   |
|  +------------------------------------+  |
|  |  Section Title & Description       |  |
|  +------------------------------------+  |
|  |                                    |  |
|  |  Google Form Embed (iframe)        |  |
|  |  - Responsive width                |  |
|  |  - Min height: 600-800px           |  |
|  |  - Rounded corners                 |  |
|  |  - Shadow styling                  |  |
|  |                                    |  |
|  +------------------------------------+  |
+------------------------------------------+
```

#### Iframe Configuration
- Width: 100% (responsive)
- Height: Dynamic based on form length (600-900px)
- Border: None
- Loading: Lazy for performance
- Sandbox: allow-scripts, allow-same-origin, allow-forms

---

### Step 4: Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/ContactSection.tsx` | Modify | Replace custom form with Google Form iframe |
| `src/components/VolunteerFormSection.tsx` | Create | New section for volunteer registration Google Form |
| `src/components/BananaLeafRequestSection.tsx` | Create | New section for banana leaf request Google Form |
| `src/pages/focus/EnvironmentalSafety.tsx` | Modify | Add banana leaf request form section |
| `src/components/GetInvolvedSection.tsx` | Modify | Update volunteer button link |
| `src/pages/Index.tsx` | Modify | Add volunteer form section |
| `src/components/FocusPageLayout.tsx` | Modify | Add optional children prop support for custom sections |

---

### Step 5: Placeholder URLs

I will use placeholder URLs like `YOUR_GOOGLE_FORM_EMBED_URL_HERE` in the code. After implementation, you will need to replace these with your actual Google Form embed URLs.

---

### What You Get After Implementation

1. **Contact Section** - Google Form embedded, all responses go to your Google Sheets
2. **Volunteer Registration** - New section on homepage with Google Form
3. **Banana Leaf Request** - Form on Environmental Safety page for community requests
4. **All data automatically saved** - Every submission goes directly to Google Sheets linked to each form

---

### Next Steps After Approval

1. Approve this plan
2. I will implement the changes with placeholder URLs
3. You create your 3 Google Forms
4. You provide me the embed URLs (or replace them yourself in the code)
5. Test the forms on your website

