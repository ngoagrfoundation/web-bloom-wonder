// API configuration for cPanel PHP backend
// In Lovable preview, API calls will gracefully fail (no PHP server)
// On cPanel, these endpoints work with the PHP files in /api/

const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('lovable.app');

export const API_BASE_URL = isProduction 
  ? `${window.location.origin}/api` 
  : '/api'; // Will fail gracefully in preview

/**
 * Submit form data to the PHP backend (fire-and-forget)
 * Used alongside Google Sheets submission for redundancy
 */
export const submitFormToAPI = async (formType: string, data: Record<string, unknown>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-form.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ form_type: formType, data }),
    });
    return response.ok;
  } catch {
    // Silently fail - Google Sheets is the primary storage
    console.log('API submission skipped (not on cPanel)');
    return false;
  }
};

/**
 * Record a donation payment to the PHP backend
 */
export const recordDonationToAPI = async (donationData: {
  razorpay_payment_id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  donation_type: string;
  pan_number: string;
  status: string;
}): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/record-donation.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(donationData),
    });
    return response.ok;
  } catch {
    console.log('Donation recording skipped (not on cPanel)');
    return false;
  }
};

/**
 * Fetch gallery images from the database (with fallback)
 */
export const fetchGalleryImages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/gallery.php`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch {
    return null; // Caller should fall back to static data
  }
};

/**
 * Fetch events from the database (with fallback)
 */
export const fetchEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/events.php`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch {
    return null; // Caller should fall back to static data
  }
};
