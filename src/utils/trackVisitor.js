import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const trackVisitor = async () => {
  try {
    // ❌ Admin panel ignore
    if (window.location.pathname.startsWith("/admin")) return;

    let sessionId = localStorage.getItem("session_id");
    let isFirstVisit = false;

    // ✅ Session create only once
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);
      isFirstVisit = true;
    }

    // ✅ Landing page save only once
    let landingPage = localStorage.getItem("landing_page");
    if (!landingPage) {
      landingPage = window.location.pathname;
      localStorage.setItem("landing_page", landingPage);
    }

    const payload = {
      session_id: sessionId,
      landing_page: landingPage,
      current_page: window.location.pathname,
      referrer: document.referrer || "direct",
      browser: navigator.userAgent,
      device_type: /mobile/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      is_first_visit: isFirstVisit,
    };

    await axios.post(`${API_URL}/analytics/track`, payload);
  } catch (err) {
    console.warn("Visitor tracking failed");
  }
};
