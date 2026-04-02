import { API_BASE_URL } from './api';

const safeJson = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  return { error: text.substring(0, 200) || 'Server returned non-JSON response' };
};

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (response.status === 401) {
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  
  return response;
};

// Auth
export const adminLogin = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  return safeJson(res);
};

export const adminLogout = async () => {
  await fetch(`${API_BASE_URL}/auth.php?action=logout`, {
    method: 'POST',
    credentials: 'include',
  });
};

export const checkAdminAuth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth.php?action=check`, {
      credentials: 'include',
    });
    return safeJson(res);
  } catch {
    return { authenticated: false };
  }
};

export const changeAdminPassword = async (currentPassword: string, newPassword: string) => {
  const res = await adminFetch(`${API_BASE_URL}/auth.php?action=change-password`, {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  return safeJson(res);
};

// Submissions
export const getSubmissions = async (page = 1, limit = 20, formType = '') => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (formType) params.set('form_type', formType);
  const res = await adminFetch(`${API_BASE_URL}/admin/submissions.php?${params}`);
  return safeJson(res);
};

export const deleteSubmission = async (id: number, formType: string) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/submissions.php?id=${id}&form_type=${formType}`, { method: 'DELETE' });
  return safeJson(res);
};

// Donations
export const getDonations = async (page = 1, limit = 20) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await adminFetch(`${API_BASE_URL}/admin/donations.php?${params}`);
  return safeJson(res);
};

// Gallery
export const getGalleryImages = async () => {
  const res = await adminFetch(`${API_BASE_URL}/admin/gallery.php`);
  return safeJson(res);
};

export const uploadGalleryImage = async (formData: FormData) => {
  const res = await fetch(`${API_BASE_URL}/admin/gallery.php`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (res.status === 401) {
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  return safeJson(res);
};

export const updateGalleryImage = async (data: { id: number; alt?: string; category?: string; caption?: string; sort_order?: number }) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/gallery.php`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return safeJson(res);
};

export const deleteGalleryImage = async (id: number) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/gallery.php?id=${id}`, { method: 'DELETE' });
  return safeJson(res);
};

// Events
export const getEvents = async () => {
  const res = await adminFetch(`${API_BASE_URL}/admin/events.php`);
  return safeJson(res);
};

export const createEvent = async (data: Record<string, unknown>) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/events.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return safeJson(res);
};

export const updateEvent = async (data: Record<string, unknown>) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/events.php`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return safeJson(res);
};

export const deleteEvent = async (id: number) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/events.php?id=${id}`, { method: 'DELETE' });
  return safeJson(res);
};

// Dashboard stats
export const getDashboardStats = async () => {
  try {
    const [submissions, donations] = await Promise.all([
      getSubmissions(1, 1),
      getDonations(1, 1),
    ]);
    return {
      totalSubmissions: submissions.total || 0,
      totalDonations: donations.stats?.total_donations || 0,
      totalAmount: donations.stats?.total_amount || 0,
    };
  } catch {
    return { totalSubmissions: 0, totalDonations: 0, totalAmount: 0 };
  }
};
