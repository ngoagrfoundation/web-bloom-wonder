

## Fix Volunteer Form + Add Phone to Contact + Create Adopt a Student Form

### Problem 1: Volunteer Form Data Not Saving

**Root Cause Found:**
The Volunteer form pre-joins arrays to strings before sending:
```javascript
// Current code (line 66-70 in VolunteerForm.tsx)
await submitForm({
  ...data,
  initiatives: data.initiatives.join(", "),    // Sends "eco-packaging, tree-plantation"
  availability: data.availability.join(", "),  // Sends "weekends, monthly-events"
});
```

But the Google Apps Script expects arrays and joins them itself:
```javascript
(data.initiatives || []).join(", ")   // Expects ["eco-packaging", "tree-plantation"]
```

When you call `.join()` on a string, JavaScript returns the string unchanged, but the data type mismatch causes issues in Google Apps Script.

**Solution:** Send labels directly (as the Partner form does), and send arrays instead of pre-joined strings.

---

### Problem 2: Contact Form Missing Phone Field

The Contact form currently has: Name, Email, Message
Your Google Apps Script expects: Name, Email, Phone, Message

Need to add phone field to the form and update the validation schema.

---

### Problem 3: Adopt a Student Form Needed

Create a new form for the "Adopt a Student" option in Get Involved section.

---

### Implementation Plan

#### Step 1: Fix Volunteer Form (`src/components/forms/VolunteerForm.tsx`)

Change the `onSubmit` function to:
1. Send arrays directly (not pre-joined strings)
2. Send labels instead of IDs (for readability in Google Sheets)

```javascript
const onSubmit = async (data: VolunteerFormData) => {
  await submitForm({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    location: data.location,
    initiatives: data.initiatives.map(id => 
      initiatives.find(i => i.id === id)?.label || id
    ),  // Send array of labels
    availability: data.availability.map(id => 
      availabilityOptions.find(a => a.id === id)?.label || id
    ),  // Send array of labels
    experience: data.experience || "",
  });
};
```

---

#### Step 2: Add Phone Field to Contact Form

**File: `src/lib/validation.ts`**
Update the contact form schema to include phone:
```javascript
export const contactFormSchema = z.object({
  name: z....,
  email: z....,
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number")
    .optional()
    .or(z.literal("")),
  message: z....,
});
```

**File: `src/components/forms/ContactForm.tsx`**
- Add phone to default values
- Add phone input field between Email and Message

---

#### Step 3: Create Adopt a Student Form

**New File: `src/components/forms/AdoptStudentForm.tsx`**

Form fields:
- Sponsor Name (required)
- Email (required)
- Phone (required)
- City (required)
- Preferred Grade Level (dropdown: Primary, Middle, High School, Any)
- Duration of Sponsorship (dropdown: 1 Year, 2 Years, 3 Years, Until Graduation)
- Message (optional)

**File: `src/lib/validation.ts`**
Add new schema:
```javascript
export const adoptStudentFormSchema = z.object({
  sponsorName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/),
  city: z.string().trim().min(2).max(100),
  gradeLevel: z.string().min(1, "Please select a grade level"),
  duration: z.string().min(1, "Please select sponsorship duration"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});
```

**File: `src/components/GetInvolvedSection.tsx`**
Update "Adopt a Student" card to open modal with form.

---

### Google Apps Script for Adopt a Student

**Column Headers for Google Sheet:**
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Sponsor Name | Email | Phone | City | Grade Level | Duration | Message |

**Google Apps Script Code:**
```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.sponsorName || "",
      data.email || "",
      data.phone || "",
      data.city || "",
      data.gradeLevel || "",
      data.duration || "",
      data.message || ""
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ready" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

### Files to Modify/Create

| File | Action | Changes |
|------|--------|---------|
| `src/components/forms/VolunteerForm.tsx` | Modify | Fix `onSubmit` to send arrays with labels |
| `src/lib/validation.ts` | Modify | Add phone to contact schema, add adopt student schema |
| `src/components/forms/ContactForm.tsx` | Modify | Add phone input field |
| `src/components/forms/AdoptStudentForm.tsx` | Create | New form component |
| `src/components/GetInvolvedSection.tsx` | Modify | Add Adopt Student modal |

---

### After Implementation

You'll need to:
1. Create a new Google Sheet for "Adopt a Student"
2. Set up the columns: Timestamp, Sponsor Name, Email, Phone, City, Grade Level, Duration, Message
3. Deploy the Google Apps Script as a Web App
4. Provide me the URL so I can add it to the form


Here is the URL of "Adopt a Student":
https://script.google.com/macros/s/AKfycbze9LbMP1Ce3AirPUbDPLp1ZGusY6SgmvZ57hcOOxYSAvKabL2EULALHuK_peKL7k8r/exec
