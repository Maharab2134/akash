import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
// Create axios instance
const api = axios.create({
  baseURL: BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;

      if (path.startsWith("/admin")) {
        console.warn("401 inside admin, skipping force redirect");
        return Promise.reject(error);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/admin/login");
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  profile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const servicesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    const res = await api.get(`/services?${queryParams.toString()}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/services/${id}`);
    return res.data;
  },

  getBySlug: async (slug) => {
    const res = await api.get(`/services/slug/${slug}`);
    return res.data;
  },

  getFeatured: async () => {
    const res = await api.get("/services/featured");
    return res.data?.data ?? res.data ?? [];
  },

  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const projectsAPI = {
  getAll: (params) => api.get("/projects", { params }),
  getFeatured: () => api.get("/projects/featured"),
  getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const blogAPI = {
  getAll: (params) => api.get("/posts", { params }),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`),
  create: (data) => api.post("/posts", data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const teamAPI = {
  getAll: () => api.get("/team"),
  create: (data) => api.post("/team", data),
  update: (id, data) => api.put(`/team/${id}`, data),
  delete: (id) => api.delete(`/team/${id}`),
};

export const testimonialsAPI = {
  getAll: (params = {}) => api.get("/testimonials", { params }),
  getFeatured: () => api.get("/testimonials/featured"),
  create: (data) => api.post("/testimonials", data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
  toggleFeatured: (id) => api.patch(`/testimonials/toggle-featured/${id}`),
};

export const mediaAPI = {
  getAll: async (params = {}) => {
    return api.get("/media", { params });
  },

  upload: async (formData) => {
    return api.post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  delete: async (id) => {
    return api.delete(`/media/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};

export const dashboardAPI = {
  getStats: () => api.get("/dashboard"),
  clearActivities: () => api.delete("/dashboard/activities"),
};

export const contactAPI = {
  submit: (data) => api.post("/contact", data),
  getAll: (params) => api.get("/contact", { params }),
  updateStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const settingsAPI = {
  getAll: () => api.get("/settings"),
  update: (key, value) => api.put(`/settings/${key}`, { value }),
};
export const analyticsAPI = {
  getDashboard: () => api.get("/analytics"),
  getVisitors: (params) => api.get("/analytics/visitors", { params }),
  getCountries: (params) => api.get("/analytics/countries", { params }),
  getTopPages: (params) => api.get("/analytics/top-pages", { params }),
  getVisitorDetails: (sessionId) => api.get(`/analytics/visitor/${sessionId}`),
  trackVisitor: (data) => api.post("/analytics/track", data),
  getAllVisitors: ({ days }) =>
    api.get("/analytics/visitors/all", {
      params: { days },
    }),
};

export default api;
