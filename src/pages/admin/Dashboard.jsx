import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FaUsers,
  FaProjectDiagram,
  FaBlog,
  FaEnvelope,
  FaCode,
  FaStar,
  FaImage,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { dashboardAPI } from "../../services/api";
import StatCard from "../../components/admin/StatCard";
import RecentActivities from "../../components/admin/RecentActivities.jsx";
import RecentContacts from "../../components/admin/RecentContacts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardAPI.getStats(),
  });

  const queryClient = useQueryClient();

  const clearActivitiesMutation = useMutation({
    mutationFn: () => dashboardAPI.clearActivities(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Activities cleared");
    },
    onError: () => {
      toast.error("Failed to clear activities");
    },
  });

  const [chartData, setChartData] = useState({
    labels: [
      "Services",
      "Projects",
      "Blog Posts",
      "Team",
      "Testimonials",
      "Media",
    ],
    datasets: [
      {
        label: "Content Count",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(139, 92, 246)",
          "rgb(239, 68, 68)",
          "rgb(99, 102, 241)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (data?.data?.stats) {
      const stats = data.data.stats;
      setChartData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: [
              stats.total_services,
              stats.total_projects,
              stats.total_posts,
              stats.total_team,
              stats.total_testimonials,
              stats.total_media,
            ],
          },
        ],
      }));
    }
  }, [data]);
  console.log("Dashboard data:", data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 text-red-700 border border-red-200 rounded bg-red-50">
        Failed to load dashboard data
      </div>
    );
  }

  const stats = data?.data?.stats || {};
  const activities = data?.data?.recent_activities || [];
  const contacts = data?.data?.recent_contacts || [];

  const statCards = [
    {
      title: "Total Services",
      value: stats.total_services || 0,
      icon: FaCode,
      color: "bg-blue-500",
      progress: stats.services_progress || 0,
      link: "/admin/services",
    },
    {
      title: "Active Projects",
      value: stats.total_projects || 0,
      icon: FaProjectDiagram,
      color: "bg-green-500",
      progress: stats.projects_progress || 0,
      link: "/admin/projects",
    },
    {
      title: "Blog Posts",
      value: stats.total_posts || 0,
      icon: FaBlog,
      color: "bg-yellow-500",
      progress: stats.posts_progress || 0,
      link: "/admin/blog",
    },
    {
      title: "Team Members",
      value: stats.total_team || 0,
      icon: FaUserFriends,
      color: "bg-purple-500",
      progress: 100,
      link: "/admin/team",
    },
    {
      title: "Testimonials",
      value: stats.total_testimonials || 0,
      icon: FaStar,
      color: "bg-red-500",
      progress: 100,
      link: "/admin/testimonials",
    },
    {
      title: "New Contacts",
      value: stats.new_contacts || 0,
      icon: FaEnvelope,
      color: "bg-indigo-500",
      progress: stats.contacts_progress || 0,
      link: "/admin/contacts",
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Content Overview",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your site.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-lg shadow">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Doughnut Chart */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-center h-64">
            <Doughnut
              data={{
                labels: ["Active", "Inactive"],
                datasets: [
                  {
                    data: [
                      stats.active_services || 0,
                      stats.total_services - stats.active_services || 0,
                    ],
                    backgroundColor: ["#10B981", "#EF4444"],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Services Status",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activities and Contacts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivities
          activities={activities}
          onClear={() => clearActivitiesMutation.mutate()}
          clearing={clearActivitiesMutation.isLoading}
        />
        <RecentContacts contacts={contacts} />
      </div>
    </div>
  );
}
