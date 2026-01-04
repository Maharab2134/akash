import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  Cog6ToothIcon,
  FolderIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Services", href: "/admin/services", icon: FolderIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Projects", href: "/admin/projects", icon: DocumentTextIcon },
  { name: "Blog", href: "/admin/blog", icon: DocumentTextIcon },
  { name: "Team", href: "/admin/team", icon: UserGroupIcon },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: ChatBubbleLeftRightIcon,
  },
  { name: "Contacts", href: "/admin/contacts", icon: EnvelopeIcon },
  { name: "Media", href: "/admin/media", icon: PhotoIcon },
  { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                Admin Panel
              </span>
            </div>
            <button
              type="button"
              className="text-gray-400 rounded-md hover:text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-4 py-3 text-sm font-medium ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="pt-4 mt-auto border-t">
              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 mt-4 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col bg-white border-r border-gray-200 grow">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <span className="text-xl font-bold text-blue-600">Admin Panel</span>
          </div>
          <nav className="flex flex-col flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-4 py-3 text-sm font-medium ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="pt-4 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-end flex-1 gap-x-4">
            <div className="flex items-center gap-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <span className="text-sm font-medium text-blue-600">
                  {user?.full_name?.[0] || user?.username?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
