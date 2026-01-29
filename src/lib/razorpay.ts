/**
 * Razorpay Payment Gateway Utilities
 * Client-side integration for donation payments
 */

/**
 * Dynamically loads the Razorpay checkout script
 * @returns Promise that resolves to true if script loaded successfully
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Public API Key (safe to use in frontend - this is how Razorpay is designed)
export const RAZORPAY_KEY_ID = 'rzp_live_S9ZfJn3TTaXZ9G';

// Organization details for checkout
export const RAZORPAY_CONFIG = {
  name: 'AGR Foundation',
  description: 'Donation',
  currency: 'INR',
  image: '/favicon.svg',
  theme: {
    color: '#800000', // Maroon to match branding
  },
} as const;
