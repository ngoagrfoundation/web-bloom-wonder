// API configuration for cPanel PHP backend
const PRODUCTION_API = 'https://agrfoundation.ngo/api';

const isPreview = window.location.hostname.includes('lovable.app') || window.location.hostname === 'localhost';

export const API_BASE_URL = isPreview ? '/api' : PRODUCTION_API;

/**
 * Submit form data to the PHP backend
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
    console.log('API submission failed');
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
    console.log('Donation recording failed');
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
    return null;
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
    return null;
  }
};
