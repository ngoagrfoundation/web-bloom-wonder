

## Fix Google Sheets Form Submission - CORS & Field Name Issues

### Root Cause Analysis

After reviewing the code and network logs, I found **two issues**:

**Issue 1: CORS Error**
The network requests show "Error: Failed to fetch" which is a CORS error. The current fetch configuration removed `mode: "no-cors"` but Google Apps Script doesn't properly support CORS for cross-origin POST requests. 

The fix is to add `mode: "no-cors"` back, which will make the request work but won't allow us to read the response (that's fine - we assume success if no error is thrown).

**Issue 2: Field Name Mismatch - Partner Form**
The Partner form sends `organizationName` but the Google Apps Script expects `organization`:

```javascript
// Google Apps Script expects:
data.organization || ""

// React form sends:
organizationName
```

---

### Solution

#### File 1: `src/hooks/useGoogleSheetForm.ts`

Add `mode: "no-cors"` back to the fetch configuration:

```typescript
await fetch(scriptUrl, {
  method: "POST",
  mode: "no-cors",  // Required for cross-origin Google Apps Script
  redirect: "follow",
  headers: {
    "Content-Type": "text/plain;charset=utf-8",
  },
  body: JSON.stringify(data),
});
```

**Note:** With `mode: "no-cors"`, the response is "opaque" and we can't check the status. The current code already handles this by assuming success if no exception is thrown.

#### File 2: `src/components/forms/PartnerForm.tsx`

Update the `onSubmit` function to send `organization` instead of `organizationName`:

```typescript
const onSubmit = async (data: PartnerFormData) => {
  const orgTypeLabel = organizationTypes.find(t => t.id === data.organizationType)?.label || data.organizationType;
  await submitForm({
    organization: data.organizationName,  // Changed from organizationName
    contactPerson: data.contactPerson,
    email: data.email,
    phone: data.phone,
    organizationType: orgTypeLabel,
    partnershipInterest: data.partnershipInterest.map(id => 
      partnershipInterests.find(p => p.id === id)?.label || id
    ),  // Send as array, script will handle
    message: data.message || "",
  });
};
```

---

### Technical Details

**Why `mode: "no-cors"` is needed:**
- Google Apps Script web apps redirect POST requests to a different URL
- The browser blocks the redirect response due to CORS policy
- With `mode: "no-cors"`, the request goes through but the response is opaque
- Since we can't read the response anyway, this is acceptable

**Field mappings to verify (from your Google Apps Scripts):**

| Form | React Sends | Script Expects | Status |
|------|-------------|----------------|--------|
| **Contact** | name, email, message | name, email, phone, message | Missing phone field |
| **Volunteer** | fullName, email, phone, location, initiatives, availability, experience | fullName, email, phone, location, initiatives, availability, experience | OK |
| **Partner** | organizationName → organization, contactPerson, email, phone, organizationType, partnershipInterest, message | organization, contactPerson, email, phone, organizationType, partnershipInterest, message | Fix needed |
| **Challenge** | name, phone, email, location, challengeType, description, peopleAffected | name, phone, email, location, challengeType, description, peopleAffected | OK |

**Contact Form Note:** Your Google Apps Script expects a `phone` field but the Contact form only has name, email, and message. The script handles this with `data.phone || ""` so it's fine.

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useGoogleSheetForm.ts` | Add `mode: "no-cors"` to fetch options |
| `src/components/forms/PartnerForm.tsx` | Change `organizationName` to `organization` in submitForm |

---

### Expected Result After Fix

1. Form submissions will successfully reach Google Apps Script
2. Data will be appended to your Google Sheets
3. Users will see success messages after submission
4. Cooldown and security features will continue working

---

### Testing Recommendation

After the fix, test each form:

1. **Contact Form**: Fill name, email, message → Check Google Sheet
2. **Volunteer Form**: Fill all fields → Check Google Sheet  
3. **Partner Form**: Fill all fields → Check Google Sheet
4. **Report Challenge Form**: Fill all fields → Check Google Sheet

