import { FaQuoteLeft, FaStar } from "react-icons/fa";

export default function TestimonialCard({ testimonial }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <FaQuoteLeft className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>

      <p className="text-gray-700 dark:text-gray-300 italic mb-8 text-lg">
        "{testimonial.content}"
      </p>

      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.client_name}
              className="h-14 w-14 rounded-full object-cover border-2 border-blue-200"
            />
          ) : (
            <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {testimonial.client_name?.[0]}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {testimonial.client_name}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {testimonial.position || "Client"}, {testimonial.company}
              </p>
            </div>

            <div className="flex">{renderStars(testimonial.rating || 5)}</div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              {testimonial.is_featured && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Badge */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg
            className="h-4 w-4 text-green-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Verified Customer</span>
        </div>
      </div>
    </div>
  );
}
