import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

import {
  FaUsers,
  FaEye,
  FaChartLine,
  FaMousePointer,
  FaGlobe,
  FaClock,
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaMapMarkerAlt,
  FaTimes,
  FaChevronRight,
  FaExternalLinkAlt,
  FaUser,
  FaLayerGroup,
} from "react-icons/fa";

import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

import { analyticsAPI } from "../../services/api";
import StatCard from "../../components/admin/StatCard";
import VisitorTable from "../../components/admin/VisitorTable";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState(7);
  const [activeTab, setActiveTab] = useState("visitors");

  /* ======================
     DASHBOARD SUMMARY
  ====================== */
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: analyticsAPI.getDashboard,
  });

  /* ======================
     VISITORS
  ====================== */
  const { data: visitorsApi } = useQuery({
    queryKey: ["analytics-visitors", timeRange],
    queryFn: () => analyticsAPI.getVisitors({ days: timeRange }),
  });

  /* ======================
     COUNTRIES
  ====================== */
  const { data: countriesApi } = useQuery({
    queryKey: ["analytics-countries", timeRange],
    queryFn: () => analyticsAPI.getCountries({ days: timeRange }),
  });

  /* ======================
     TOP PAGES
  ====================== */
  const { data: topPagesApi } = useQuery({
    queryKey: ["analytics-top-pages", timeRange],
    queryFn: () => analyticsAPI.getTopPages({ days: timeRange }),
  });

  /* ======================
     TRAFFIC TRENDS
  ====================== */
  const { data: trafficTrendsApi } = useQuery({
    queryKey: ["analytics-traffic-trends", timeRange],
    queryFn: () => analyticsAPI.getTrafficTrends({ days: timeRange }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-blue-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-[3px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700">
          Loading analytics...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Fetching your dashboard data
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="p-8 border border-red-100 shadow-sm bg-gradient-to-r from-red-50 to-white rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                Failed to load analytics
              </h3>
              <p className="mt-2 text-gray-600">
                We couldn't fetch your dashboard data. Please check your
                connection and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================
     DATA TRANSFORM
  ====================== */
  const stats = data?.data || {};

  const visitorStats = {
    totalVisitors: Number(stats.total_visitors || 0),
    newVisitors: Number(stats.new_visitors || 0),
    activeNow: Number(stats.active_now || 0),
    bounceRate: Number(stats.bounce_rate || 0).toFixed(1),
    totalPageViews: Number(stats.total_page_views || 0),
    avgSessionDuration: Math.round(stats.avg_session_duration / 60) || 0,
    returningVisitors: Number(stats.returning_visitors || 0),
  };

  const recentVisitors =
    visitorsApi?.data?.slice(0, 5).map((v) => ({
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
    })) ?? [];

  const countryData = countriesApi?.data || [];
  const countryChart = {
    labels: countryData.map((c) => c.country) ?? [],
    datasets: [
      {
        data: countryData.map((c) => c.visitors) ?? [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
          "#0ea5e9",
          "#f97316",
          "#ec4899",
        ],
        borderWidth: 1,
        borderRadius: 8,
        spacing: 2,
      },
    ],
  };

  const topPages =
    topPagesApi?.data?.map((p) => ({
      page: p.page,
      views: p.total_views,
      visitors: p.visitors,
      avgTime: `${Math.round(p.avg_duration / 60)}m`,
      bounceRate: p.bounce_rate,
    })) ?? [];

  const trafficTrends = trafficTrendsApi?.data || [];
  const trafficChart = {
    labels: trafficTrends.map((t) => {
      const date = new Date(t.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Visitors",
        data: trafficTrends.map((t) => t.visitors),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: "Page Views",
        data: trafficTrends.map((t) => t.page_views),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-transparent text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time insights and visitor analytics for your website
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-3 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow">
              <FaClock className="text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={visitorStats.totalVisitors.toLocaleString()}
          icon={FaUsers}
          color="bg-blue-500"
          progress={100} // 🔥 FIX
        />

        <StatCard
          title="New Visitors"
          value={visitorStats.newVisitors.toLocaleString()}
          icon={FaEye}
          color="bg-green-500"
          progress={
            visitorStats.totalVisitors
              ? Math.round(
                  (visitorStats.newVisitors / visitorStats.totalVisitors) * 100
                )
              : 0
          }
        />

        <StatCard
          title="Active Now"
          value={visitorStats.activeNow.toLocaleString()}
          icon={FaChartLine}
          color="bg-purple-500"
          progress={
            visitorStats.totalVisitors
              ? Math.round(
                  (visitorStats.activeNow / visitorStats.totalVisitors) * 100
                )
              : 0
          }
        />

        <StatCard
          title="Bounce Rate"
          value={`${visitorStats.bounceRate}%`}
          icon={FaMousePointer}
          color={
            Number(visitorStats.bounceRate) > 50 ? "bg-red-500" : "bg-green-500"
          }
          progress={Number(visitorStats.bounceRate)}
        />
      </div>

      {/* TRAFFIC TRENDS CHART */}
      {trafficTrends.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col justify-between mb-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Traffic Overview
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Visitor and page view trends
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Visitors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Page Views</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <Line
              data={trafficChart}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    titleColor: "#374151",
                    bodyColor: "#374151",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    padding: 12,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    callbacks: {
                      label: (context) =>
                        `${
                          context.dataset.label
                        }: ${context.parsed.y.toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(229, 231, 235, 0.5)",
                    },
                    ticks: {
                      color: "#6b7280",
                      font: {
                        size: 12,
                      },
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#6b7280",
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
                interaction: {
                  intersect: false,
                  mode: "index",
                },
              }}
            />
          </div>
        </div>
      )}

      {/* VISITORS & ANALYTICS GRID */}
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Country Distribution */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Visitor Distribution
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Top countries by visitors
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FaGlobe className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="h-80">
              <Doughnut
                data={countryChart}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  cutout: "60%",
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: "circle",
                        font: {
                          size: 12,
                        },
                        color: "#374151",
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          );
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} visitors (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="pt-6 mt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total countries</span>
                <span className="font-medium text-gray-900">
                  {countryData.length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Visitors */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Visitors
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Last 24 hours activity
                </p>
              </div>
              <div className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                {recentVisitors.length} active
              </div>
            </div>
            <div className="overflow-hidden border border-gray-100 rounded-xl">
              <VisitorTable visitors={recentVisitors} />
            </div>
            <div className="pt-6 mt-6 border-t border-gray-100">
              <button className="w-full py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                View all visitors →
              </button>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col justify-between mb-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Pages
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Most viewed pages by visitors
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                Export Data
              </button>
            </div>
          </div>

          <div className="overflow-hidden border border-gray-100 rounded-xl">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 pl-6 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase">
                    Page URL
                  </th>
                  <th className="py-4 text-xs font-semibold tracking-wider text-center text-gray-900 uppercase">
                    Views
                  </th>
                  <th className="py-4 text-xs font-semibold tracking-wider text-center text-gray-900 uppercase">
                    Visitors
                  </th>
                  <th className="py-4 text-xs font-semibold tracking-wider text-center text-gray-900 uppercase">
                    Avg Time
                  </th>
                  <th className="py-4 pr-6 text-xs font-semibold tracking-wider text-center text-gray-900 uppercase">
                    Bounce Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPages.map((p, i) => (
                  <tr
                    key={i}
                    className="transition-colors cursor-pointer hover:bg-gray-50 group"
                    onClick={() => window.open(p.page, "_blank")}
                  >
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            i === 0
                              ? "bg-yellow-500"
                              : i === 1
                              ? "bg-gray-400"
                              : i === 2
                              ? "bg-orange-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[300px]">
                            {p.page}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {new URL(p.page, window.location.origin).pathname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
                        {p.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 font-medium text-center text-gray-700">
                      {p.visitors.toLocaleString()}
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                        {p.avgTime}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${
                          p.bounceRate > 50
                            ? "bg-red-100 text-red-800"
                            : p.bounceRate > 30
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {p.bounceRate ? `${p.bounceRate.toFixed(1)}%` : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {topPages.length === 0 && (
            <div className="py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full">
                <FaGlobe className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">
                No page data available
              </h4>
              <p className="mt-2 text-gray-600">
                Start tracking to see your top performing pages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
