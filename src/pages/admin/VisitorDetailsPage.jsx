// src/pages/admin/VisitorDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaClock,
  FaUser,
  FaEye,
  FaExternalLinkAlt,
  FaHistory,
  FaFlag,
  FaLaptop,
  FaChartLine,
  FaCog,
  FaNetworkWired,
  FaShieldAlt,
  FaRegClock,
  FaServer,
} from "react-icons/fa";
import { analyticsAPI } from "../../services/api";

/* =========================
   HELPERS
========================= */
const getDeviceIcon = (device = "") => {
  const d = device?.toLowerCase() || "";
  if (d.includes("mobile")) return <FaMobileAlt className="text-emerald-600" />;
  if (d.includes("tablet")) return <FaTabletAlt className="text-amber-600" />;
  return <FaDesktop className="text-blue-600" />;
};

const getDeviceColor = (device = "") => {
  const d = device?.toLowerCase() || "";
  if (d.includes("mobile")) return "bg-emerald-100 text-emerald-800";
  if (d.includes("tablet")) return "bg-amber-100 text-amber-800";
  return "bg-blue-100 text-blue-800";
};

const getBrowserColor = (browser = "") => {
  const b = browser?.toLowerCase() || "";
  if (b.includes("chrome")) return "bg-green-100 text-green-800";
  if (b.includes("firefox")) return "bg-orange-100 text-orange-800";
  if (b.includes("safari")) return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (timeString) => {
  if (!timeString) return "N/A";
  const date = new Date(timeString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDuration = (seconds) => {
  if (!seconds) return "0s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

const truncateText = (text, maxLength = 40) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/* =========================
   COMPONENT
========================= */
export default function VisitorDetailsPage() {
  const { session_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(location.state?.visitor || null);

  const { data: pageData, isLoading: pageLoading } = useQuery({
    queryKey: ["visitor-pages", session_id],
    queryFn: () => analyticsAPI.getVisitorDetails(session_id),
    enabled: !!session_id,
  });

  const pageHistory = pageData?.data || [];

  /* =========================
     LOADING STATE
  ========================= */
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate("/admin/analytics")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Analytics
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">
              Loading visitor details...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Fetching visitor journey data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate("/admin/analytics")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Analytics
            </button>
          </div>

          <div className="max-w-md mx-auto text-center">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <FaUser className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Visitor not found
              </h2>
              <p className="mt-2 text-gray-600">
                The requested visitor data could not be found.
              </p>
              <button
                onClick={() => navigate("/admin/analytics")}
                className="mt-6 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/analytics")}
              className="p-2.5 text-gray-600 transition-colors bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Visitor Journey
              </h1>
              <p className="mt-1 text-gray-600">
                Session ID:{" "}
                <span className="font-mono text-gray-800">
                  {visitor.session_id || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (visitor.ip) {
                  console.log("Block IP:", visitor.ip);
                }
              }}
              className="px-4 py-2.5 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-xl hover:bg-red-100 border border-red-200"
            >
              <FaFlag className="inline mr-2" />
              Block Visitor
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <FaNetworkWired className="inline mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Visitor Profile Card */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <FaUser className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-gray-200 rounded-lg">
                  <div
                    className={`p-1 rounded ${getDeviceColor(visitor.device)}`}
                  >
                    {getDeviceIcon(visitor.device)}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Visitor Profile
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <FaGlobe className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-sm">
                      {visitor.ip || "Unknown IP"}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(visitor.time)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Pages
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <FaEye className="w-4 h-4 text-blue-500" />
                  <span className="text-xl font-bold text-gray-900">
                    {visitor.pages || 0}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Duration
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <FaClock className="w-4 h-4 text-emerald-500" />
                  <span className="text-xl font-bold text-gray-900">
                    {formatDuration(visitor.session_duration)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Status
                </div>
                <div className="mt-1">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      visitor.is_returning
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {visitor.is_returning ? "Returning" : "New Visitor"}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Referrer
                </div>
                <div className="mt-1">
                  <span className="block text-sm font-medium text-gray-900 truncate">
                    {visitor.referrer === "direct" || !visitor.referrer
                      ? "Direct"
                      : truncateText(visitor.referrer, 20)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Location Details */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-50 rounded-lg">
                <FaMapMarkerAlt className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Location Details
                </h3>
                <p className="text-sm text-gray-500">Geographic information</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Country</span>
                <span className="font-medium text-gray-900">
                  {visitor.country || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">City</span>
                <span className="font-medium text-gray-900">
                  {visitor.city || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Region</span>
                <span className="font-medium text-gray-900">
                  {visitor.region || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <FaCog className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Device Information
                </h3>
                <p className="text-sm text-gray-500">
                  Technical specifications
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Device Type</span>
                <div className="flex items-center gap-2">
                  {getDeviceIcon(visitor.device)}
                  <span className="font-medium text-gray-900 capitalize">
                    {visitor.device || "Desktop"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Browser</span>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${getBrowserColor(
                    visitor.browser
                  )}`}
                >
                  {visitor.browser || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Operating System</span>
                <span className="font-medium text-gray-900">
                  {visitor.os || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <FaServer className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Session Details</h3>
                <p className="text-sm text-gray-500">Visit information</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Landing Page</span>
                <span className="font-medium text-blue-600 truncate max-w-[150px]">
                  {visitor.landing_page || "/"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Exit Page</span>
                <span className="font-medium text-gray-900 truncate max-w-[150px]">
                  {visitor.exit_page || "/"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-gray-600">Visit Time</span>
                <span className="font-medium text-gray-900">
                  {formatTime(visitor.time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Visit History */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Page Visit History
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Timeline of pages visited during this session
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
                {pageHistory.length} pages
              </div>
              <div className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                {formatDuration(visitor.session_duration)} total
              </div>
            </div>
          </div>

          {pageHistory.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
                <FaHistory className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">
                No page visits recorded
              </h4>
              <p className="max-w-md mx-auto mt-2 text-gray-600">
                This visitor hasn't visited any pages during this session, or
                the page tracking data is not available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pageHistory.map((page, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 transition-all bg-white border border-gray-200 group rounded-xl hover:border-blue-300 hover:shadow-sm"
                >
                  {/* Step Indicator */}
                  <div className="relative">
                    <div className="flex items-center justify-center w-10 h-10 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <span className="font-semibold text-blue-700">
                        {index + 1}
                      </span>
                    </div>
                    {index < pageHistory.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-8 bg-gray-200"></div>
                    )}
                  </div>

                  {/* Page Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate transition-colors group-hover:text-blue-600">
                          {page.page_url || page.landing_page || "Unknown Page"}
                        </h4>
                        {page.page_title && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                            {page.page_title}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <FaClock className="w-3 h-3" />
                            <span>{formatTime(page.visited_at)}</span>
                          </div>

                          {page.duration && (
                            <div className="text-xs text-gray-500">
                              Duration:{" "}
                              <span className="font-medium">
                                {Math.round(page.duration)}s
                              </span>
                            </div>
                          )}

                          {page.is_returning && (
                            <span className="px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">
                              Returning Visit
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => window.open(page.page_url, "_blank")}
                          className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-600"
                          title="Open page"
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Note */}
          <div className="pt-6 mt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                Data captured by analytics system. All times are in local
                timezone.
              </div>
              <div className="text-gray-400">
                Session started at {formatTime(visitor.time)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
