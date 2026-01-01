import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const trackPerformance = () => {
  const timing = performance.timing;

  const payload = {
    page_url: window.location.pathname,
    page_title: document.title,
    load_time: timing.loadEventEnd - timing.navigationStart,
    dom_content_loaded:
      timing.domContentLoadedEventEnd - timing.navigationStart,
    ttfb: timing.responseStart - timing.requestStart,
    user_agent: navigator.userAgent,
  };

  axios.post(`${API_URL}/analytics/performance`, payload).catch(() => {});
};
