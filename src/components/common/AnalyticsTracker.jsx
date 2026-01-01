import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AnalyticsTracker() {
  const location = useLocation();
  const lastPath = useRef(null);
  const lastTime = useRef(0);

  useEffect(() => {
    // 🔥 API URL check
    console.log("🌍 VITE_API_URL =", API_URL);

    if (!API_URL) {
      console.error("❌ API_URL is UNDEFINED");
      return;
    }

    if (location.pathname.startsWith("/admin")) return;

    const now = Date.now();

    if (
      lastPath.current === location.pathname &&
      now - lastTime.current < 5000
    ) {
      console.warn("⏭️ SKIPPED (refresh/spam)", location.pathname);
      return;
    }

    lastPath.current = location.pathname;
    lastTime.current = now;

    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);
      console.log("🆕 NEW SESSION", sessionId);
    }

    let landingPage = sessionStorage.getItem("landing_page");
    if (!landingPage) {
      landingPage = location.pathname;
      sessionStorage.setItem("landing_page", landingPage);
    }

    const payload = {
      session_id: sessionId,
      landing_page: landingPage,
      current_page: location.pathname,
      referrer: document.referrer || "direct",
      browser: navigator.userAgent.includes("Chrome")
        ? "Chrome"
        : navigator.userAgent.includes("Firefox")
        ? "Firefox"
        : "Other",
      device_type: /mobile/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
    };

    console.log("📤 TRACK PAYLOAD", payload);

    axios
      .post(`${API_URL}/analytics/track`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("✅ TRACK SUCCESS", res.data);
      })
      .catch((err) => {
        console.error(
          "❌ TRACK FAILED",
          err.response?.status,
          err.response?.data || err.message
        );
      });
  }, [location.pathname]);

  return null;
}
