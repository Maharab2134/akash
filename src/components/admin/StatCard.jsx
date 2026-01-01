import { Link } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "bg-blue-500",
  progress = 0,
  link = "#",
}) {
  const isPositive = change && !change.startsWith("-");
  const changeColor = isPositive ? "text-green-600" : "text-red-600";

  // Clamp progress between 0–100
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <Link to={link} className="block">
      <div className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
        {/* Top section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>

            {change && (
              <div className="flex items-center mt-2">
                {isPositive ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" />
                )}

                <span className={`text-sm font-medium ${changeColor}`}>
                  {change}
                </span>

                <span className="ml-1 text-sm text-gray-500">
                  from last month
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div
            className={`h-14 w-14 rounded-xl ${color} flex items-center justify-center`}
          >
            <Icon className="text-white w-7 h-7" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
            <div
              className={`h-full ${color} transition-all duration-500`}
              style={{ width: `${safeProgress}%` }}
            />
          </div>

          <div className="mt-1 text-xs text-gray-500">
            {safeProgress}% completed
          </div>
        </div>
      </div>
    </Link>
  );
}
