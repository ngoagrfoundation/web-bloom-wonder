

## Razorpay Payment Gateway Integration (Client-Side Only)

### Overview

This plan integrates Razorpay payment gateway directly into the donation form without requiring any backend/database. Users will be able to pay using UPI, cards, net banking, and wallets.

---

### Security Note

The Razorpay **API Key** (starting with `rzp_live_`) is a **public key** and is safe to use in frontend code - this is how Razorpay is designed to work. The **Secret Key** should never be stored in code and is only needed for server-side operations (which we're not using in this client-side integration).

---

### How It Works

```text
+------------------+     +-------------------+     +------------------+
|   User fills     | --> |  Razorpay Checkout| --> |  Payment Success |
|   donation form  |     |  Modal Opens      |     |  Toast & Reset   |
+------------------+     +-------------------+     +------------------+
                              |
                              v
                    +-------------------+
                    | UPI, Cards, Net   |
                    | Banking, Wallets  |
                    +-------------------+
```

---

### Implementation Details

#### Step 1: Create Razorpay Utility File

**New File: `src/lib/razorpay.ts`**

This file handles:
- Dynamic loading of Razorpay checkout script
- Storing the public API key

```typescript
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Public API Key (safe to use in frontend)
export const RAZORPAY_KEY_ID = 'rzp_live_S9ZfJn3TTaXZ9G';
```

---

#### Step 2: Create TypeScript Declarations

**New File: `src/types/razorpay.d.ts`**

Provides type safety for Razorpay's JavaScript SDK:

```typescript
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler?: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
```

---

#### Step 3: Update DonationForm Component

**File: `src/components/DonationForm.tsx`**

Key changes:

1. **Add imports** for Razorpay utilities and Loader icon
2. **Add `isProcessing` state** to show loading during payment
3. **Create `handlePayment` function** that:
   - Loads the Razorpay script
   - Opens the checkout modal with donation details
   - Handles success/failure callbacks
4. **Update submit handler** to call `handlePayment` on step 3
5. **Update button** to show loading state

**Payment Flow:**
- Amount is converted to paise (multiply by 100)
- Donor details are prefilled in the modal
- On success: Show toast, reset form to step 1
- On failure: Show error toast

**Checkout Configuration:**
- Currency: INR
- Theme color: #800000 (maroon to match branding)
- Prefill: Name, email, phone from form
- Notes: Donation type, PAN, anonymous flag, dedication

---

### Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/razorpay.ts` | Create | Script loader and API key |
| `src/types/razorpay.d.ts` | Create | TypeScript declarations |
| `src/components/DonationForm.tsx` | Modify | Integrate payment checkout |

---

### User Experience After Implementation

1. User selects donation type (One-Time, Monthly, Sponsor)
2. User selects or enters amount
3. User fills personal details
4. User reviews summary and clicks "Complete Donation"
5. **Razorpay modal opens** with all payment options:
   - UPI (Google Pay, PhonePe, Paytm, etc.)
   - Credit/Debit Cards
   - Net Banking (all major banks)
   - Wallets
6. After successful payment:
   - Success toast appears
   - Form resets to step 1
   - User receives confirmation email from Razorpay

---

### Payment Options Available

- Google Pay, PhonePe, Paytm UPI
- Visa, Mastercard, RuPay cards
- 50+ banks for net banking
- Paytm, Amazon Pay, PhonePe wallets
- EMI options (if enabled in your Razorpay dashboard)

---

### Technical Notes

- No backend required - payments go directly to your Razorpay account
- Payment records are available in your Razorpay Dashboard
- Razorpay handles all payment security (PCI-DSS compliant)
- 80G receipts can be generated using donation notes captured

