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
 * Fetch public gallery images (no auth required)
 */
export const fetchPublicGallery = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-gallery.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch {
    return null;
  }
};

/**
 * Fetch public events (no auth required)
 */
export const fetchPublicEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-events.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch {
    return null;
  }
};

/**
 * Fetch public news articles (no auth required)
 */
export const fetchPublicNews = async (limit?: number) => {
  try {
    const params = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${API_BASE_URL}/public-news.php${params}`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch {
    return null;
  }
};

/**
 * Fetch single news article by slug (no auth required)
 */
export const fetchNewsBySlug = async (slug: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-news.php?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || null;
  } catch {
    return null;
  }
};

/**
 * Fetch gallery images from the database (with fallback) - legacy
 */
export const fetchGalleryImages = async () => {
  return fetchPublicGallery();
};

/**
 * Fetch events from the database (with fallback) - legacy
 */
export const fetchEvents = async () => {
  return fetchPublicEvents();
};

/**
 * Submit form (alias for EventRegistrationForm)
 */
export const submitForm = async (formType: string, data: Record<string, unknown>): Promise<boolean> => {
  return submitFormToAPI(formType, data);
};

/**
 * Fetch public reels (no auth required)
 */
export const fetchPublicReels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-reels.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch {
    return null;
  }
};

/**
 * Fetch public testimonials (no auth required)
 */
export const fetchPublicTestimonials = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-testimonials.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch {
    return null;
  }
};

/**
 * Fetch public site settings (no auth required)
 */
export const fetchPublicSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-settings.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || {};
  } catch {
    return null;
  }
};
