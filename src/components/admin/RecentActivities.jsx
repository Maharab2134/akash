import { formatDistanceToNow } from "date-fns";
import {
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const activityIcons = {
  create_service: PlusIcon,
  update_service: PencilIcon,
  delete_service: TrashIcon,
  create_post: DocumentTextIcon,
  update_post: PencilIcon,
  delete_post: TrashIcon,
  upload_media: PhotoIcon,
  delete_media: TrashIcon,
  login: UserIcon,
  logout: UserIcon,
  default: DocumentTextIcon,
};

export default function RecentActivities({
  activities,
  onClear,
  clearing = false,
}) {
  const getActivityIcon = (action) => {
    const Icon = activityIcons[action] || activityIcons.default;
    return <Icon className="w-5 h-5 text-gray-400" />;
  };

  const getActivityColor = (action) => {
    if (action.includes("create")) return "text-green-600 bg-green-50";
    if (action.includes("update")) return "text-blue-600 bg-blue-50";
    if (action.includes("delete")) return "text-red-600 bg-red-50";
    if (action.includes("login")) return "text-purple-600 bg-purple-50";
    return "text-gray-600 bg-gray-50";
  };

  const formatActionText = (action, description) => {
    const actionMap = {
      create_service: "Created a service",
      update_service: "Updated a service",
      delete_service: "Deleted a service",
      login: "Logged in",
      logout: "Logged out",
    };

    const baseText = actionMap[action] || "Performed an action";
    return description ? `${baseText}: ${description}` : baseText;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activities
          </h3>
          <p className="text-sm text-gray-600">
            Latest actions performed in the system
          </p>
        </div>

        {activities.length > 0 && onClear && (
          <button
            onClick={() => {
              if (window.confirm("Clear all activities?")) {
                onClear();
              }
            }}
            disabled={clearing}
            className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${getActivityColor(
                      activity.action
                    )}`}
                  >
                    {getActivityIcon(activity.action)}
                  </div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.full_name || activity.username}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatActionText(activity.action, activity.description)}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <span>
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                    {activity.ip_address && (
                      <span className="ml-4">IP: {activity.ip_address}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No activities found</p>
            <p className="mt-1 text-sm text-gray-400">
              Activities will appear here as you use the system
            </p>
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All Activities →
          </button>
        </div>
      )}
    </div>
  );
}
