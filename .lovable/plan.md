
## Update Browser Logo, Contact Details & Location Map

### Overview
This plan covers three updates:
1. Add the AGR Foundation logo as the browser favicon
2. Update the Contact Us section with new office address, phone number, and email
3. Update the Google Maps embed with the correct AGR Foundation location

---

### Task 1: Update Browser Favicon

**Current state:** No favicon is defined in `index.html`

**Action:**
- Copy the uploaded SVG logo (`user-uploads://Agr-logo.svg`) to `public/favicon.svg`
- Add a `<link rel="icon">` tag to `index.html`

**File: `index.html`**
Add after line 7 (after description meta tag):
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

---

### Task 2: Update Contact Us Section

**File: `src/components/ContactSection.tsx`**

**Changes:**

| Field | Current Value | New Value |
|-------|---------------|-----------|
| **Office Address** | Near SRR Public School, Salur Paleti Road, Bheemili, Visakhapatnam, Andhra Pradesh, India - 531162 | Near JNTU Metro Station, Sardar Patel Nagar, Dharma Reddy Colony Phase II, Kukatpally Housing Board Colony, Kukatpally, Hyderabad, Telangana 500085 |
| **Phone Number** | +91 9123456789 | +91 7036555699 |
| **Email Address** | info@agrfoundation.org | info@agrfoundation.ngo |

Update lines 28-34 (Office Address):
```jsx
<p className="text-muted-foreground text-sm">
  Near JNTU Metro Station, Sardar Patel Nagar,
  <br />
  Dharma Reddy Colony Phase II, Kukatpally Housing Board Colony,
  <br />
  Kukatpally, Hyderabad, Telangana 500085
</p>
```

Update line 44 (Phone):
```jsx
<p className="text-muted-foreground text-sm">+91 7036555699</p>
```

Update line 54 (Email):
```jsx
<p className="text-muted-foreground text-sm">info@agrfoundation.ngo</p>
```

---

### Task 3: Update Google Maps Embed

**File: `src/components/ContactSection.tsx`**

**Current Map URL (line 106):**
```
https://www.google.com/maps/embed?pb=...Bheemunipatnam...
```

**New Map URL:**
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7610.3844234599765!2d78.38406581679982!3d17.49833566522362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91003137a339%3A0x46d7bebcb13df32f!2sAGR%20FOUNDATION!5e0!3m2!1sen!2sin!4v1754285070405!5m2!1sen!2sin
```

This shows the exact AGR Foundation office location in Kukatpally, Hyderabad.

---

### Summary of Files to Modify

| File | Action |
|------|--------|
| `public/favicon.svg` | Copy uploaded logo here |
| `index.html` | Add favicon link tag |
| `src/components/ContactSection.tsx` | Update address, phone, email, and map URL |

---

### After Implementation

The browser tab will display the AGR Foundation logo, and the Contact Us section will show:
- **New Hyderabad office address** (Kukatpally)
- **Updated phone number** (+91 7036555699)
- **Correct email domain** (.ngo instead of .org)
- **Accurate Google Maps** pointing to AGR Foundation's location
