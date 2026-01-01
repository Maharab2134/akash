import {
  FaDesktop,
  FaMobile,
  FaTablet,
  FaTabletAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const getDeviceIcon = (device) => {
  switch (device.toLowerCase()) {
    case "desktop":
      return <FaDesktop className="w-4 h-4 text-blue-500" />;
    case "mobile":
      return <FaMobile className="w-4 h-4 text-green-500" />;
    case "tablet":
      return <FaTabletAlt className="w-4 h-4 text-yellow-500" />;
    default:
      return <FaDesktop className="w-4 h-4 text-gray-500" />;
  }
};

const getBrowserColor = (browser) => {
  const colors = {
    chrome: "bg-blue-100 text-blue-800",
    safari: "bg-gray-100 text-gray-800",
    firefox: "bg-orange-100 text-orange-800",
    edge: "bg-blue-100 text-blue-800",
    opera: "bg-red-100 text-red-800",
  };
  return colors[browser.toLowerCase()] || "bg-gray-100 text-gray-800";
};

export default function VisitorTable({ visitors }) {
  const getCountryFlag = (country) => {
    const flags = {
      USA: "🇺🇸",
      Bangladesh: "🇧🇩",
      India: "🇮🇳",
      UK: "🇬🇧",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Germany: "🇩🇪",
    };
    return flags[country] || "🌍";
  };
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              IP Address
            </th>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Location
            </th>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Device
            </th>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Browser
            </th>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Time
            </th>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Pages
            </th>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visitors.map((visitor) => (
            <tr key={visitor.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <FaGlobe className="w-4 h-4 mr-2 text-gray-400" />
                  {visitor.ip}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2 text-xl">
                    {getCountryFlag(visitor.country)}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {visitor.country}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                      {visitor.city}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  {getDeviceIcon(visitor.device)}
                  <span className="ml-2 text-sm text-gray-900">
                    {visitor.device}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getBrowserColor(
                    visitor.browser
                  )}`}
                >
                  {visitor.browser}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                {visitor.time}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FaEye className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium">{visitor.pages}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                <button
                  onClick={() =>
                    navigate(`/admin/analytics/visitor/${visitor.session_id}`, {
                      state: { visitor },
                    })
                  }
                  className="text-blue-600 hover:text-blue-900"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
