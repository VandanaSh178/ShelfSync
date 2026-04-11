import axios from "axios";
import toast from "react-hot-toast";
import { store } from "../store/store"; // Import store to dispatch global actions
import { logout } from "../store/slices/authSlice";

const API = axios.create({
  // Dynamic baseURL based on environment
  baseURL: import.meta.env.VITE_API_URL || "https://shelfsync-api.onrender.com",
  withCredentials: true, // Crucial for Cookie-based Auth
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout for "Institutional Reliability"
});

/**
 * REQUEST INTERCEPTOR: Registry Synchronization
 * Triggered before every outbound packet.
 */
API.interceptors.request.use(
  (config) => {
    // Add a unique Request-ID or Timestamp for the Archival Logs
    config.headers["X-Request-Timestamp"] = new Date().toISOString();
    
    // If you decided to use Bearer Tokens instead of HttpOnly Cookies:
    // const token = localStorage.getItem("shelf_sync_token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR: Global Integrity Check
 * Handles incoming data packets and security breaches (401s).
 */
API.interceptors.response.use(
  (response) => {
    // Return the response data directly if it's a standard success
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Internal Archive Server Error";

    // 1. SESSION EXPIRED / UNAUTHORIZED
    // if (status === 401) {
    //   // Auto-purge Redux state and redirect if the session is compromised
    //   store.dispatch(logout());
      
    //   // Only toast if it's not a login attempt failing
    //   if (!error.config.url.includes("/login")) {
    //     toast.error("Session De-authorized. Please re-authenticate.", {
    //       id: "session-expired", // Prevents duplicate toasts
    //       icon: "🔐",
    //     });
    //   }
    // }

    if (status === 401) {
  const url = error.config.url;
  const isAuthCheck = url.includes("/auth/me") || url.includes("/login");
  if (!isAuthCheck) {
    store.dispatch(logout());
    toast.error("Session expired. Please log in again.", { id: "session-expired" });
  }
}

    // 2. RATE LIMITING (Too many requests)
    if (status === 429) {
      toast.error("Registry Throttling: Too many requests. Please wait.");
    }

    // 3. NETWORK / OFFLINE ERRORS
    if (error.code === "ERR_NETWORK") {
      toast.error("Core Engine Offline: Connection to Archive failed.", {
        style: { background: "#000", color: "#fff", borderRadius: "12px" }
      });
    }

    // 4. SERVER-SIDE CRASHES
    if (status >= 500) {
      toast.error("Critical System Fault: Registry Engine reported a 500 error.");
    }

    return Promise.reject(error);
  }
);

export default API;