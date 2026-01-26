

## Custom React Forms with Google Sheets Integration

### Overview

This plan replaces all Google Form iframes with custom-styled React forms that match your website's design. Form submissions will be sent directly to Google Sheets via Google Apps Script endpoints.

---

### How It Works

```text
USER FILLS FORM            FORM SUBMITS DATA          DATA SAVED
     |                           |                         |
     v                           v                         v
+------------------+      +-------------------+     +----------------+
| Custom React     | ---> | Google Apps Script| --> | Google Sheets  |
| Form (styled     |      | Web App (free     |     | (automatic     |
| with Tailwind)   |      | POST endpoint)    |     | data storage)  |
+------------------+      +-------------------+     +----------------+
```

**Benefits:**
- Full control over form appearance and styling
- Matches your website's design perfectly
- Better UX with inline validation and error messages
- Loading states and success feedback
- No Google branding visible
- Uses existing security measures (honeypot, cooldown)

---

### What You Need to Do (One-Time Setup Per Form)

For each Google Sheet, you need to create a Google Apps Script Web App:

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete any existing code and paste the script I'll provide
4. Click **Deploy → New Deployment**
5. Select **Web App** as the type
6. Set "Execute as" to **Me**
7. Set "Who has access" to **Anyone**
8. Click **Deploy** and copy the Web App URL
9. Provide me the URL

I'll provide you with the exact Google Apps Script code for each form.

---

### Forms to Build

#### Form 1: Contact Form
**Fields:**
- Name (text, required)
- Email (email, required)
- Phone (tel, optional)
- Message (textarea, required)

#### Form 2: Volunteer Registration
**Fields:**
- Full Name (text, required)
- Email (email, required)
- Phone (tel, required)
- Location/Village (text, required)
- Initiatives Interested (checkboxes)
- Availability (checkboxes)
- Previous Experience (textarea, optional)

#### Form 3: Partner with Us
**Fields:**
- Organization Name (text, required)
- Contact Person (text, required)
- Email (email, required)
- Phone (tel, required)
- Organization Type (dropdown)
- Partnership Interest (checkboxes)
- Message (textarea, optional)

#### Form 4: Report a Challenge
**Fields:**
- Your Name (text, required)
- Phone (tel, required)
- Email (email, optional)
- Location/Village (text, required)
- Challenge Type (dropdown)
- Description (textarea, required)
- People Affected (number, optional)

---

### Technical Implementation

#### Step 1: Create Custom Form Hook

**New File:** `src/hooks/useGoogleSheetForm.ts`

A reusable hook that handles:
- Form submission to Google Apps Script endpoint
- Loading state management
- Success/error state handling
- Integration with existing `useFormSecurity` hook

#### Step 2: Update Validation Schemas

**File:** `src/lib/validation.ts`

Add new Zod schemas for:
- `volunteerFormSchema` - Volunteer registration validation
- `partnerFormSchema` - Partnership inquiry validation
- `reportChallengeFormSchema` - Challenge report validation

(Contact form schema already exists)

#### Step 3: Create Individual Form Components

**New File:** `src/components/forms/ContactForm.tsx`
- Uses existing `contactFormSchema`
- Styled input fields with labels and error messages
- Submit button with loading state
- Success/error feedback

**New File:** `src/components/forms/VolunteerForm.tsx`
- Multi-step or single form with checkbox groups
- Initiative selection checkboxes
- Availability selection

**New File:** `src/components/forms/PartnerForm.tsx`
- Organization type dropdown
- Partnership interest checkboxes
- Professional styling

**New File:** `src/components/forms/ReportChallengeForm.tsx`
- Challenge type dropdown
- Urgent styling for the report section

#### Step 4: Update Section Components

Replace iframes with custom forms in:

**File:** `src/components/ContactSection.tsx`
- Remove iframe, import ContactForm
- Keep contact info panel and map

**File:** `src/components/VolunteerFormSection.tsx`
- Remove iframe, import VolunteerForm
- Keep initiatives and benefits panels

**File:** `src/components/PartnerFormSection.tsx`
- Remove iframe, import PartnerForm
- Keep partnership benefits panel

**File:** `src/components/ReportChallengeSection.tsx`
- Remove iframe, import ReportChallengeForm
- Keep challenge types and privacy info panels

---

### Form UI Design

Each form will have this consistent structure:

```text
+--------------------------------------------------+
|  FORM CARD                                       |
|  +--------------------------------------------+  |
|  |  HEADER (gradient with icon and title)     |  |
|  +--------------------------------------------+  |
|                                                  |
|  +------------------------------------------+    |
|  | Label *                                  |    |
|  | +--------------------------------------+ |    |
|  | |  Input field                         | |    |
|  | +--------------------------------------+ |    |
|  | Error message (if validation fails)    | |    |
|  +------------------------------------------+    |
|                                                  |
|  +------------------------------------------+    |
|  | Checkbox Group Label                    |    |
|  | ☑ Option 1    ☑ Option 2               |    |
|  | ☐ Option 3    ☐ Option 4               |    |
|  +------------------------------------------+    |
|                                                  |
|  +------------------------------------------+    |
|  |  [Submit Button with loading spinner]   |    |
|  +------------------------------------------+    |
|                                                  |
|  🔒 Security indicator                           |
+--------------------------------------------------+
```

---

### Form Styling Details

**Input Fields:**
- Rounded corners (rounded-md)
- Border with focus ring (border-input, focus:ring-primary)
- Proper padding (px-4 py-3)
- Error state with red border and message

**Checkboxes:**
- Custom styled checkboxes using shadcn/ui
- Grid layout for multiple options
- Proper spacing

**Submit Button:**
- Primary color gradient
- Loading spinner during submission
- Disabled state during cooldown

**Success State:**
- Green checkmark animation
- "Thank you" message
- Form resets after success

**Error State:**
- Red error message
- Retry button
- Form data preserved

---

### Files Summary

| Action | File | Description |
|--------|------|-------------|
| Create | `src/hooks/useGoogleSheetForm.ts` | Hook for Google Sheets API submission |
| Modify | `src/lib/validation.ts` | Add volunteer, partner, report schemas |
| Create | `src/components/forms/ContactForm.tsx` | Custom contact form |
| Create | `src/components/forms/VolunteerForm.tsx` | Custom volunteer form |
| Create | `src/components/forms/PartnerForm.tsx` | Custom partner form |
| Create | `src/components/forms/ReportChallengeForm.tsx` | Custom report form |
| Modify | `src/components/ContactSection.tsx` | Replace iframe with ContactForm |
| Modify | `src/components/VolunteerFormSection.tsx` | Replace iframe with VolunteerForm |
| Modify | `src/components/PartnerFormSection.tsx` | Replace iframe with PartnerForm |
| Modify | `src/components/ReportChallengeSection.tsx` | Replace iframe with ReportChallengeForm |

---

### Google Apps Script Code (I'll Provide)

After implementation, I'll give you the exact script for each form. Example for Contact Form:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone || '',
    data.message
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ready'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

### Security Features (Already Built)

Your forms will use the existing security measures:
- **Honeypot field** - Hidden field to catch bots
- **Timing validation** - Prevents too-fast submissions
- **Cooldown period** - 30-second wait between submissions
- **Zod validation** - Client-side data validation
- **Content security check** - Detects suspicious patterns

---

### Implementation Steps

1. I'll implement the custom forms with placeholder URLs
2. I'll provide Google Apps Script code for each form
3. You deploy the scripts in your Google Sheets
4. You give me the 4 Web App URLs
5. I update the forms with your URLs
6. Test all forms

---

### What You'll Get

1. Four beautifully styled custom forms matching your website
2. Professional input fields with validation and error messages
3. Loading states and success/error feedback
4. All data saves directly to your Google Sheets
5. No Google Form branding visible
6. Consistent styling across all forms
7. Full security protection (honeypot, cooldown, validation)

Here are the links:
1. Contact: https://script.google.com/macros/s/AKfycbwMjOuB2s6bd_bTuxT98-U5ioSbgmmyqv_5_DiH_WALJI4-ZdMVRAyggNNRTq84Ci1EqQ/exec

2. Volunteer : https://script.google.com/macros/s/AKfycbwtNe9Kpt1ESjMC_s-8j1kfr62PBDoYFD3ZWlF-auBaxuYJPPZ-w_PFvwFgFEj2ns2d/exec

3. Partner: https://script.google.com/macros/s/AKfycbzMHieEiY7wAX6btCmNCrPtPhBr63B3xUI6sDlAeUX6Z8I_WdLNULdmGDaWcSzAW9_O/exec

4. Challenge: https://script.google.com/macros/s/AKfycbxGarQhnIT59zLST4iR_IsKBOJQvcOi0xFCwWjnoVxl7aDkevKXBJnm_ctXbOpSF8T4/exec


