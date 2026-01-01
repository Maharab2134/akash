import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  InboxIcon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon,
  ExclamationCircleIcon,
  EyeIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Status configuration with industry-standard colors
const STATUS_CONFIG = {
  new: {
    label: "New",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    icon: InboxIcon,
    gradient: "from-blue-500 to-cyan-500",
  },
  read: {
    label: "Read",
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    icon: EyeIcon,
    gradient: "from-amber-500 to-orange-500",
  },
  replied: {
    label: "Replied",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    icon: PaperAirplaneIcon,
    gradient: "from-emerald-500 to-teal-500",
  },
  spam: {
    label: "Spam",
    color: "bg-rose-500",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    icon: ShieldExclamationIcon,
    gradient: "from-rose-500 to-pink-500",
  },
};

const STATS_CONFIG = {
  total: {
    label: "Total Messages",
    color: "bg-gradient-to-r from-indigo-500 to-purple-600",
    icon: UserGroupIcon,
  },
  new: {
    label: "New",
    color: "bg-gradient-to-r from-blue-500 to-cyan-600",
    icon: InboxIcon,
  },
  read: {
    label: "Read",
    color: "bg-gradient-to-r from-amber-500 to-orange-600",
    icon: EyeIcon,
  },
  replied: {
    label: "Replied",
    color: "bg-gradient-to-r from-emerald-500 to-teal-600",
    icon: PaperAirplaneIcon,
  },
  spam: {
    label: "Spam",
    color: "bg-gradient-to-r from-rose-500 to-pink-600",
    icon: ShieldExclamationIcon,
  },
};

// Get user initials for avatar
const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Generate random gradient for avatar
const getAvatarGradient = (str) => {
  const gradients = [
    "bg-gradient-to-br from-blue-500 to-cyan-500",
    "bg-gradient-to-br from-purple-500 to-pink-500",
    "bg-gradient-to-br from-emerald-500 to-teal-500",
    "bg-gradient-to-br from-orange-500 to-amber-500",
    "bg-gradient-to-br from-violet-500 to-indigo-500",
  ];
  const index = str
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[index % gradients.length];
};

export default function AdminContacts() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  // Fetch contacts
  const { data, isLoading, error } = useQuery({
    queryKey: ["contacts", { search, status: statusFilter }],
    queryFn: () => {
      const params = {};
      if (search && search.trim()) {
        params.search = search.trim();
      }
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      return contactAPI.getAll(params);
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => contactAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
      toast.success("Status updated successfully");
      setSelectedContact(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update status");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => contactAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
        exact: false,
      });
      toast.success("Contact deleted successfully");
      setSelectedContact(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete contact");
    },
  });

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteMutation.mutate(id);
    }
  };

  const contacts = data?.data || [];

  // Calculate statistics
  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    read: contacts.filter((c) => c.status === "read").length,
    replied: contacts.filter((c) => c.status === "replied").length,
    spam: contacts.filter((c) => c.status === "spam").length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Inbox</h1>
          <p className="mt-2 text-gray-600">
            Manage customer inquiries and messages from your website
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(STATS_CONFIG).map(([key, config]) => (
            <div
              key={key}
              className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {config.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stats[key] || 0}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${config.color}`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Messages</option>
                <option value="new">New Messages</option>
                <option value="read">Read Messages</option>
                <option value="replied">Replied Messages</option>
                <option value="spam">Spam Messages</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Refresh
              </button>
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-6 h-96">
            <div className="p-4 rounded-full bg-red-50">
              <ExclamationCircleIcon className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Failed to Load Messages
            </h3>
            <p className="max-w-md mt-2 text-center text-gray-600">
              {error?.response?.data?.error ||
                "An error occurred while loading contacts"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 mt-6 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 h-96">
            <div className="p-4 rounded-full bg-blue-50">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No Messages Found
            </h3>
            <p className="mt-2 text-gray-600">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "Customer messages will appear here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {contacts.map((contact) => {
              const status = STATUS_CONFIG[contact.status];

              return (
                <div
                  key={contact.id}
                  className={`p-6 hover:bg-gray-50/50 transition-all ${
                    contact.status === "new" ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${getAvatarGradient(
                          contact.name
                        )}`}
                      >
                        {getInitials(contact.name)}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-semibold text-gray-900">
                              {contact.name}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} ${status.borderColor} border`}
                            >
                              <status.icon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <EnvelopeIcon className="w-4 h-4" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <span className="flex items-center gap-1.5">
                                <PhoneIcon className="w-4 h-4" />
                                {contact.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="w-4 h-4" />
                              {formatDate(contact.created_at)}
                            </span>
                          </div>

                          {contact.subject && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {contact.subject}
                              </span>
                            </div>
                          )}

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {contact.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="relative">
                            <select
                              value={contact.status}
                              onChange={(e) =>
                                handleStatusChange(contact.id, e.target.value)
                              }
                              className="pl-3 pr-8 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                            >
                              {Object.entries(STATUS_CONFIG).map(
                                ([key, config]) => (
                                  <option key={key} value={key}>
                                    {config.label}
                                  </option>
                                )
                              )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-900/70 backdrop-blur-sm"
              onClick={() => setSelectedContact(null)}
            />

            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="px-8 pt-8 pb-6">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${getAvatarGradient(
                        selectedContact.name
                      )}`}
                    >
                      {getInitials(selectedContact.name)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedContact.name}
                      </h3>
                      <p className="text-gray-600">{selectedContact.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 text-gray-400 transition-colors hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
                  <div className="p-5 border border-blue-100 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="ml-3 font-medium text-gray-900">Email</h4>
                    </div>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-lg font-medium text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>

                  {selectedContact.phone && (
                    <div className="p-5 border rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <PhoneIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h4 className="ml-3 font-medium text-gray-900">
                          Phone
                        </h4>
                      </div>
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="text-lg font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}

                  <div className="p-5 border border-purple-100 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <CalendarIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="ml-3 font-medium text-gray-900">Date</h4>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {formatFullDate(selectedContact.created_at)}
                    </p>
                  </div>
                </div>

                {/* Message Section */}
                <div className="space-y-6">
                  {selectedContact.subject && (
                    <div>
                      <h4 className="mb-3 text-sm font-medium tracking-wide text-gray-700 uppercase">
                        Subject
                      </h4>
                      <div className="p-4 border border-gray-200 bg-gray-50 rounded-xl">
                        <p className="text-lg font-medium text-gray-900">
                          {selectedContact.subject}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="mb-3 text-sm font-medium tracking-wide text-gray-700 uppercase">
                      Message
                    </h4>
                    <div className="p-5 border border-gray-200 bg-gray-50 rounded-xl">
                      <div className="prose-sm prose max-w-none">
                        <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          value={selectedContact.status}
                          onChange={(e) =>
                            handleStatusChange(
                              selectedContact.id,
                              e.target.value
                            )
                          }
                          className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {Object.entries(STATUS_CONFIG).map(
                            ([key, config]) => (
                              <option key={key} value={key}>
                                {config.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <button
                        onClick={() => handleDelete(selectedContact.id)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>

                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${
                        selectedContact.subject || "Your Inquiry"
                      }&body=Dear ${selectedContact.name},%0D%0A%0D%0A`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-md"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
