// API configuration for cPanel PHP backend
const PRODUCTION_API = 'https://agrfoundation.ngo/api';

const isPreview = window.location.hostname.includes('lovable.app') || window.location.hostname === 'localhost';

export const API_BASE_URL = isPreview ? '/api' : PRODUCTION_API;

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

export const recordDonationToAPI = async (donationData: {
  razorpay_payment_id: string; donor_name: string; donor_email: string;
  donor_phone: string; amount: number; donation_type: string;
  pan_number: string; status: string;
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

export const fetchPublicGallery = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-gallery.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch { return null; }
};

export const fetchPublicEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-events.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch { return null; }
};

export const fetchPublicNews = async (limit?: number) => {
  try {
    const params = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${API_BASE_URL}/public-news.php${params}`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch { return null; }
};

export const fetchNewsBySlug = async (slug: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-news.php?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || null;
  } catch { return null; }
};

export const fetchGalleryImages = async () => fetchPublicGallery();
export const fetchEvents = async () => fetchPublicEvents();

export const submitForm = async (formType: string, data: Record<string, unknown>): Promise<boolean> => {
  return submitFormToAPI(formType, data);
};

export const fetchPublicReels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-reels.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch { return null; }
};

export const fetchPublicTestimonials = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-testimonials.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch { return null; }
};

export const fetchPublicSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-settings.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || {};
  } catch { return null; }
};

export const fetchPublicPartners = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-partners.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch { return null; }
};

export const fetchPublicSponsors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-sponsors.php`);
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    return result.data || [];
  } catch { return null; }
};
