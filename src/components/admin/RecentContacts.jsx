import { useState } from "react";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const statusColors = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  read: "bg-amber-50 text-amber-700 border border-amber-200",
  replied: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  spam: "bg-rose-50 text-rose-700 border border-rose-200",
};

const statusIcons = {
  new: "🔵",
  read: "🟡",
  replied: "🟢",
  spam: "🔴",
};

const statusLabels = {
  new: "New",
  read: "Read",
  replied: "Replied",
  spam: "Spam",
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (str) => {
  const colors = [
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-emerald-500 to-teal-500",
    "bg-gradient-to-r from-orange-500 to-amber-500",
    "bg-gradient-to-r from-violet-500 to-indigo-500",
  ];
  const index = str
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export default function RecentContacts({ contacts }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  const formatMessage = (message) => {
    if (message.length > 120) {
      return message.substring(0, 120) + "...";
    }
    return message;
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffHours = Math.floor((now - messageDate) / (1000 * 60 * 60));

    if (diffHours < 24) {
      if (diffHours < 1) {
        const diffMinutes = Math.floor((now - messageDate) / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredContacts =
    activeFilter === "all"
      ? contacts
      : contacts.filter((contact) => contact.status === activeFilter);

  return (
    <>
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Recent Contacts
                  </h3>
                  <p className="text-sm text-gray-500">
                    {contacts.length} total messages •{" "}
                    {contacts.filter((c) => c.status === "new").length} unread
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/admin/contacts"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-md"
            >
              View All
              <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex pb-1 mt-6 space-x-2 overflow-x-auto">
            {["all", "new", "read", "replied", "spam"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter === "all" ? "All Messages" : statusLabels[filter]}
                {filter !== "all" && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white rounded-full">
                    {contacts.filter((c) => c.status === filter).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contact List */}
        <div className="divide-y divide-gray-100">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="px-6 py-4 transition-all duration-200 hover:bg-gray-50/50 group"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${getRandomColor(
                        contact.name
                      )}`}
                    >
                      {getInitials(contact.name)}
                    </div>
                    {contact.status === "new" && (
                      <div className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full -top-1 -right-1"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {contact.name}
                          </h4>
                          <span
                            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              statusColors[contact.status]
                            }`}
                          >
                            {statusIcons[contact.status]}{" "}
                            {statusLabels[contact.status]}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 space-x-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <EnvelopeIcon className="w-4 h-4 mr-1.5" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <PhoneIcon className="w-4 h-4 mr-1.5" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                        <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
                        <span>{formatTime(contact.created_at)}</span>
                      </div>
                    </div>

                    {contact.subject && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-900">
                          {contact.subject}
                        </span>
                      </div>
                    )}

                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {contact.message}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(contact)}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm"
                        >
                          <EyeIcon className="w-4 h-4 mr-1.5" />
                          Quick View
                        </button>
                        <a
                          href={`mailto:${
                            contact.email
                          }?subject=Re: ${encodeURIComponent(
                            contact.subject || "Your Inquiry"
                          )}&body=${encodeURIComponent(
                            `Dear ${contact.name},\n\n`
                          )}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all duration-200"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                          Reply
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200">
                <EnvelopeIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">
                No messages found
              </h4>
              <p className="max-w-sm mx-auto text-gray-500">
                {activeFilter === "all"
                  ? "No contact messages available"
                  : `No ${statusLabels[activeFilter]} messages found`}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredContacts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredContacts.length} of {contacts.length} messages
              </div>
              <Link
                to="/admin/contacts"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 group"
              >
                Manage all contacts
                <svg
                  className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
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
              onClick={handleCloseModal}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            {/* Modal Content */}
            <div className="relative inline-block overflow-hidden text-left align-bottom transition-all transform bg-white shadow-2xl rounded-2xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Modal Header */}
              <div className="px-8 pt-8 pb-6">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${getRandomColor(
                        selectedContact.name
                      )}`}
                    >
                      {getInitials(selectedContact.name)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedContact.name}
                      </h3>
                      <p className="text-gray-500">{selectedContact.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 transition-colors hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    <span className="sr-only">Close</span>
                    <span className="text-2xl">×</span>
                  </button>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
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
                </div>

                {/* Message Card */}
                <div className="mb-8">
                  {selectedContact.subject && (
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">
                        Subject
                      </h4>
                      <div className="px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl">
                        <span className="font-medium text-gray-900">
                          {selectedContact.subject}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Message
                      </h4>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            statusColors[selectedContact.status]
                          }`}
                        >
                          {statusIcons[selectedContact.status]}{" "}
                          {statusLabels[selectedContact.status]}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="w-4 h-4 mr-1.5" />
                          {new Date(
                            selectedContact.created_at
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 border border-gray-200 bg-gray-50 rounded-xl">
                      <div className="prose-sm prose max-w-none">
                        <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                    <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all duration-200 hover:shadow-sm">
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Mark as Replied
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Close
                    </button>
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${
                        selectedContact.subject || "Your Inquiry"
                      }&body=Dear ${selectedContact.name},%0D%0A%0D%0A`}
                      className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
