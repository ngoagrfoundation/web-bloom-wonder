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
export const getSubmissions = async (page = 1, limit = 20, formType = '', search = '', dateFrom = '', dateTo = '') => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (formType) params.set('form_type', formType);
  if (search) params.set('search', search);
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);
  const res = await adminFetch(`${API_BASE_URL}/admin/submissions.php?${params}`);
  return safeJson(res);
};

export const deleteSubmission = async (id: number, formType: string) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/submissions.php?id=${id}&form_type=${formType}`, { method: 'DELETE' });
  return safeJson(res);
};

// Donations
export const getDonations = async (page = 1, limit = 20, status = '', type = '', search = '', dateFrom = '', dateTo = '') => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);
  if (type) params.set('type', type);
  if (search) params.set('search', search);
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);
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

// News
export const getNews = async () => {
  const res = await adminFetch(`${API_BASE_URL}/admin/news.php`);
  return safeJson(res);
};

export const createNews = async (data: Record<string, unknown>) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/news.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return safeJson(res);
};

export const updateNews = async (data: Record<string, unknown>) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/news.php`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return safeJson(res);
};

export const deleteNews = async (id: number) => {
  const res = await adminFetch(`${API_BASE_URL}/admin/news.php?id=${id}`, { method: 'DELETE' });
  return safeJson(res);
};

// Analytics
export const getSubmissionTrends = async () => {
  try {
    const res = await adminFetch(`${API_BASE_URL}/admin/analytics.php?type=submissions`);
    const data = await safeJson(res);
    return data.data || [];
  } catch { return []; }
};

export const getDonationTrends = async () => {
  try {
    const res = await adminFetch(`${API_BASE_URL}/admin/analytics.php?type=donations`);
    const data = await safeJson(res);
    return data.data || [];
  } catch { return []; }
};

// Seed static content
export const seedStaticGallery = async () => {
  const staticImages = [
    { alt: "Lake cleaning drive", category: "sustainability", caption: "Community members participating in lake cleaning" },
    { alt: "Students in classroom", category: "education", caption: "Education program in rural areas" },
    { alt: "Healthcare camp", category: "healthcare", caption: "Free health checkup camp" },
    { alt: "Community gathering", category: "community", caption: "Annual community gathering" },
    { alt: "Volunteer activity", category: "volunteers", caption: "Volunteers contributing to social welfare" },
    { alt: "Livelihood training", category: "livelihood", caption: "Skill development workshop" },
  ];
  
  try {
    let inserted = 0;
    for (const img of staticImages) {
      try {
        const formData = new FormData();
        formData.append("alt", img.alt);
        formData.append("category", img.category);
        formData.append("caption", img.caption);
        // These are placeholder entries without actual files - admin can replace later
      } catch { /* skip */ }
    }
    return { inserted };
  } catch { return { inserted: 0 }; }
};

export const seedStaticNews = async () => {
  const staticNews = [
    {
      slug: "clean-water-initiative-reaches-50-villages",
      title: "Clean Water Initiative Reaches 50 Villages",
      excerpt: "Our clean water program has successfully installed water purification systems in 50 villages across Telangana.",
      content: "<p>AGR Foundation's clean water initiative has reached a major milestone.</p>",
      author: "AGR Foundation",
      category: "success-story",
      read_time: 5,
      is_published: 1,
    },
    {
      slug: "annual-health-camp-serves-2000-patients",
      title: "Annual Health Camp Serves 2000+ Patients",
      excerpt: "Our annual health camp provided free medical checkups, medicines, and health education.",
      content: "<p>The annual health camp organized by AGR Foundation served over 2000 patients.</p>",
      author: "AGR Foundation",
      category: "event",
      read_time: 4,
      is_published: 1,
    },
    {
      slug: "scholarship-program-expands-to-300-students",
      title: "Scholarship Program Expands to 300 Students",
      excerpt: "With generous donor support, our education scholarship program now supports 300 students.",
      content: "<p>Our scholarship program has expanded significantly this year.</p>",
      author: "AGR Foundation",
      category: "announcement",
      read_time: 3,
      is_published: 1,
    },
  ];

  try {
    let inserted = 0;
    for (const article of staticNews) {
      try {
        await createNews(article);
        inserted++;
      } catch { /* skip duplicates */ }
    }
    return { inserted };
  } catch { return { inserted: 0 }; }
};

// Dashboard stats
export const getDashboardStats = async () => {
  try {
    const [submissions, donations, gallery, events, news, reels, testimonials] = await Promise.all([
      getSubmissions(1, 1),
      getDonations(1, 1),
      getGalleryImages(),
      getEvents(),
      getNews(),
      adminFetch(`${API_BASE_URL}/admin/reels.php`).then(r => safeJson(r)).catch(() => ({ data: [] })),
      adminFetch(`${API_BASE_URL}/admin/testimonials.php`).then(r => safeJson(r)).catch(() => ({ data: [] })),
    ]);
    return {
      totalSubmissions: submissions.total || 0,
      totalDonations: donations.stats?.total_donations || 0,
      totalAmount: donations.stats?.total_amount || 0,
      totalGallery: gallery.data?.length || 0,
      totalEvents: events.data?.length || 0,
      totalNews: news.data?.length || 0,
      totalReels: reels.data?.length || 0,
      totalTestimonials: testimonials.data?.length || 0,
    };
  } catch {
    return { totalSubmissions: 0, totalDonations: 0, totalAmount: 0, totalGallery: 0, totalEvents: 0, totalNews: 0, totalReels: 0, totalTestimonials: 0 };
  }
};

// Recent activity
export const getRecentActivity = async () => {
  try {
    const res = await getSubmissions(1, 5);
    return res.data || [];
  } catch {
    return [];
  }
};

// Database Browser
export const getTableList = async () => {
  const res = await adminFetch(`${API_BASE_URL}/admin/database.php?action=tables`);
  return safeJson(res);
};

export const getTableData = async (table: string, page = 1, limit = 50, search = '') => {
  const params = new URLSearchParams({ table, page: String(page), limit: String(limit) });
  if (search) params.set('search', search);
  const res = await adminFetch(`${API_BASE_URL}/admin/database.php?${params}`);
  return safeJson(res);
};

// Image upload
export const uploadImage = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);
  const res = await fetch(`${API_BASE_URL}/admin/upload.php`, {
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
