// src/pages/admin/AllVisitors.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaFilter, FaSearch } from "react-icons/fa";
import VisitorTable from "../../components/admin/VisitorTable";
import { analyticsAPI } from "../../services/api";

export default function AllVisitors() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const { data: visitorsApi, isLoading } = useQuery({
    queryKey: ["all-visitors", timeRange],
    queryFn: () => analyticsAPI.getAllVisitors({ days: timeRange }),
  });
  console.log("RAW visitorsApi:", visitorsApi);
  console.log("Is Array?", Array.isArray(visitorsApi));

  const { data: countriesApi } = useQuery({
    queryKey: ["countries-for-filter"],
    queryFn: () => analyticsAPI.getCountries({ days: timeRange }),
  });

  // ভিজিটর ডেটা প্রসেসিং
  const allVisitors = Array.isArray(visitorsApi?.data)
    ? visitorsApi.data.map((v) => ({
        id: v.id,
        session_id: v.session_id,
        ip: v.ip_address,
        country: v.country,
        city: v.city,
        device: v.device_type,
        browser: v.browser,
        browser_version: v.browser_version,
        os: v.os,
        time: v.visit_time,
        pages: v.page_views,
        session_duration: v.session_duration,
        landing_page: v.landing_page,
        exit_page: v.exit_page,
        is_returning: v.is_returning,
        referrer: v.referrer,
      }))
    : [];

  // ফিল্টার লজিক
  const filteredVisitors = allVisitors.filter((visitor) => {
    // সার্চ ফিল্টার
    const searchMatch =
      searchTerm === "" ||
      visitor.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.browser.toLowerCase().includes(searchTerm.toLowerCase());

    // ডিভাইস ফিল্টার
    const deviceMatch =
      deviceFilter === "all" || visitor.device.toLowerCase() === deviceFilter;

    // দেশ ফিল্টার
    const countryMatch =
      countryFilter === "all" || visitor.country === countryFilter;

    return searchMatch && deviceMatch && countryMatch;
  });

  // CSV এক্সপোর্ট ফাংশন
  const exportToCSV = () => {
    const headers = [
      "IP Address",
      "Country",
      "City",
      "Device",
      "Browser",
      "OS",
      "Visit Time",
      "Pages Viewed",
      "Session Duration",
      "Returning Visitor",
      "Referrer",
    ];

    const csvData = filteredVisitors.map((visitor) => [
      visitor.ip,
      visitor.country || "Unknown",
      visitor.city || "Unknown",
      visitor.device,
      `${visitor.browser} ${visitor.browser_version}`,
      visitor.os,
      new Date(visitor.time).toLocaleString(),
      visitor.pages,
      `${Math.round(visitor.session_duration / 60)}m ${
        visitor.session_duration % 60
      }s`,
      visitor.is_returning ? "Yes" : "No",
      visitor.referrer || "Direct",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Visitors</h1>
            <p className="text-gray-600">
              Complete visitor history and analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FaDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ফিল্টার এবং সার্চ */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* সার্চ */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search IP, country, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* টাইম রেঞ্জ */}
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
              <option value={0}>All time</option>
            </select>
          </div>

          {/* ডিভাইস ফিল্টার */}
          <div>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          {/* দেশ ফিল্টার */}
          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Countries</option>
              {countriesApi?.data?.map((country) => (
                <option key={country.country} value={country.country}>
                  {country.country} ({country.visitors})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* সারাংশ */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-medium text-blue-700">Total Visitors</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {filteredVisitors.length.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-sm font-medium text-green-700">Returning</p>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {filteredVisitors
                .filter((v) => v.is_returning)
                .length.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-sm font-medium text-purple-700">
              Unique Countries
            </p>
            <p className="mt-1 text-2xl font-bold text-purple-900">
              {[...new Set(filteredVisitors.map((v) => v.country))].length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-sm font-medium text-orange-700">
              Avg Pages/Visit
            </p>
            <p className="mt-1 text-2xl font-bold text-orange-900">
              {filteredVisitors.length > 0
                ? (
                    filteredVisitors.reduce((sum, v) => sum + v.pages, 0) /
                    filteredVisitors.length
                  ).toFixed(1)
                : "0.0"}
            </p>
          </div>
        </div>
      </div>

      {/* ভিজিটর টেবিল */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading visitors...</p>
          </div>
        ) : filteredVisitors.length > 0 ? (
          <VisitorTable visitors={filteredVisitors} showAllColumns={true} />
        ) : (
          <div className="py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full">
              <FaFilter className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="mt-4 text-lg font-medium text-gray-900">
              No visitors found
            </h4>
            <p className="mt-2 text-gray-600">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
