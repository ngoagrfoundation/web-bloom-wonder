// API configuration for cPanel PHP backend
const isLovablePreview = window.location.hostname.includes('lovable.app') || window.location.hostname.includes('lovableproject.com') || window.location.hostname === 'localhost';

export const API_BASE_URL = isLovablePreview ? 'https://agrfoundation.ngo/api' : '/api';

export const submitFormToAPI = async (formType: string, data: Record<string, unknown>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-form.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ form_type: formType, data }),
    });

    const responseText = await response.text();
    let parsed: Record<string, unknown> | null = null;

    try {
      parsed = responseText ? JSON.parse(responseText) : null;
    } catch {
      parsed = null;
    }

    if (response.ok) {
      return parsed?.success !== false;
    }

    // Some hosts may still persist the submission even if the response status/body is imperfect.
    if (parsed?.success === true || responseText.includes('"success":true')) {
      return true;
    }

    return false;
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

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  video_url: string;
  description: string;
  publishedAt: string;
}

export const fetchYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
  try {
    const settings = await fetchPublicSettings();
    if (!settings) return [];
    const apiKey = settings.youtube_api_key;
    const channelId = settings.youtube_channel_id;
    if (!apiKey || !channelId) return [];
    const maxResults = settings.youtube_max_results || '20';

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}&order=date&type=video&maxResults=${maxResults}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items) return [];

    return data.items.map((item: { id: { videoId: string }; snippet: { title: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } }; description: string; publishedAt: string } }) => ({
      id: `yt-${item.id.videoId}`,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
      video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch {
    console.log('YouTube fetch failed');
    return [];
  }
};
