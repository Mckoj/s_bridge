import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor — attach auth token ─────────────────────────────────
// NOTE: Caching is NOT done at the Axios level because different service
// functions transform/map the raw response.data before returning it to hooks.
// Caching raw response.data would cause a shape mismatch when hooks try to
// read the cache expecting the already-mapped type.
// Each service function handles its own cache read/write after transformation.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — global 401 handler ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
