import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FaMapMarkerAlt,
  FaDesktop,
  FaGlobe,
  FaHistory,
  FaShieldAlt,
} from "react-icons/fa";

export default function VisitorDetailsModal({ isOpen, onClose, visitor }) {
  if (!isOpen || !visitor) return null;
  const visitorDetails = {
    ip: visitor.ip_address ?? visitor.ip,
    location: `${visitor.city ?? "Unknown"}, ${visitor.country ?? "Unknown"}`,
    device: visitor.device_type ?? visitor.device,
    browser: visitor.browser,
    os: visitor.os ?? "Unknown",
    screen: visitor.screen ?? "Unknown",
    language: visitor.language ?? navigator.language,
    referrer: visitor.referrer ?? "Direct",

    sessionStart: visitor.visited_at
      ? new Date(visitor.visited_at).toLocaleTimeString()
      : "Unknown",

    sessionDuration: visitor.session_duration
      ? `${Math.floor(visitor.session_duration / 60)}m ${
          visitor.session_duration % 60
        }s`
      : "0m",

    pagesVisited: visitor.pages_visited ?? [],
    actions: visitor.actions ?? [],

    threatScore: visitor.threat_score ?? 0,
    isBot: visitor.is_bot ?? false,
    vpn: visitor.vpn ?? false,
    proxy: visitor.proxy ?? false,
  };

  const getThreatLevel = (score) => {
    if (score < 25)
      return { level: "Low", color: "bg-green-100 text-green-800" };
    if (score < 50)
      return { level: "Medium", color: "bg-yellow-100 text-yellow-800" };
    if (score < 75)
      return { level: "High", color: "bg-orange-100 text-orange-800" };
    return { level: "Critical", color: "bg-red-100 text-red-800" };
  };

  const threatLevel = getThreatLevel(visitorDetails.threatScore);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Visitor Details
                </h3>
                <p className="text-sm text-gray-500">
                  Detailed information about visitor activity
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Visitor Summary */}
            <div className="p-4 mb-6 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm text-gray-500">IP Address</div>
                  <div className="font-medium text-gray-900">
                    {visitorDetails.ip}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="flex items-center font-medium text-gray-900">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                    {visitorDetails.location}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Device</div>
                  <div className="flex items-center font-medium text-gray-900">
                    <FaDesktop className="w-4 h-4 mr-2 text-gray-400" />
                    {visitorDetails.device}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Threat Score</div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${threatLevel.color}`}
                  >
                    {threatLevel.level} ({visitorDetails.threatScore}/100)
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Technical Details */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <FaGlobe className="w-5 h-5 mr-2 text-blue-500" />
                  Technical Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Browser:</span>
                    <span className="font-medium">
                      {visitorDetails.browser}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operating System:</span>
                    <span className="font-medium">{visitorDetails.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Screen Resolution:</span>
                    <span className="font-medium">{visitorDetails.screen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">
                      {visitorDetails.language}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referrer:</span>
                    <span className="font-medium">
                      {visitorDetails.referrer}
                    </span>
                  </div>
                </div>

                {/* Security Status */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <h5 className="flex items-center mb-3 font-semibold text-gray-900 text-md">
                    <FaShieldAlt className="w-4 h-4 mr-2 text-green-500" />
                    Security Status
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bot Detection:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          visitorDetails.isBot
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {visitorDetails.isBot ? "Detected" : "Clean"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VPN/Proxy:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          visitorDetails.vpn || visitorDetails.proxy
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {visitorDetails.vpn || visitorDetails.proxy
                          ? "Detected"
                          : "Clean"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <FaHistory className="w-5 h-5 mr-2 text-purple-500" />
                  Session Details
                </h4>

                <div className="mb-4">
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Session Start:</span>
                    <span className="font-medium">
                      {visitorDetails.sessionStart}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Session Duration:</span>
                    <span className="font-medium">
                      {visitorDetails.sessionDuration}
                    </span>
                  </div>
                </div>

                {/* Page Visit History */}
                <div className="mb-4">
                  <h5 className="mb-3 font-semibold text-gray-900 text-md">
                    Page Visit History
                  </h5>
                  <div className="space-y-2">
                    {visitorDetails.pagesVisited.map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">{page.page}</div>
                          <div className="text-xs text-gray-500">
                            {page.time}
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {page.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Actions */}
                <div>
                  <h5 className="mb-3 font-semibold text-gray-900 text-md">
                    User Actions
                  </h5>
                  <div className="space-y-2">
                    {visitorDetails.actions.map((action, index) => (
                      <div
                        key={index}
                        className="p-2 border border-blue-100 rounded bg-blue-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-800">
                            {action.action}
                          </span>
                          <span className="text-xs text-gray-500">
                            {action.time}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-blue-700">
                          {action.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Visitor ID: #{visitor.id} • Last Updated: Just now
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Block IP
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
