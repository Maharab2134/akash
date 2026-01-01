import { Link } from "react-router-dom";
import {
  FaCalendar,
  FaUser,
  FaEye,
  FaClock,
  FaArrowRight,
  FaTag,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function BlogCard({ post, layout = "grid" }) {
  // Helper function to extract first image from content
  const extractFirstImage = (content) => {
    if (!content) return null;
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const match = imgRegex.exec(content);
    return match ? match[1] : null;
  };

  const featuredImage = post.featured_image || extractFirstImage(post.content);

  // Normalize tags to always be an array
  let tags = [];
  if (Array.isArray(post.tags)) {
    tags = post.tags;
  } else if (typeof post.tags === "string" && post.tags.trim() !== "") {
    try {
      const parsed = JSON.parse(post.tags);
      if (Array.isArray(parsed)) tags = parsed;
      else
        tags = post.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    } catch {
      tags = post.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  // Grid layout (default)
  if (layout === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-lg group dark:bg-gray-900 rounded-2xl hover:shadow-2xl dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900"
      >
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-4xl font-bold text-white">
                {post.title?.charAt(0) || "B"}
              </span>
            </div>
          )}

          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm">
                {post.category}
              </span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FaCalendar className="w-3 h-3 mr-2" />
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center">
              <FaUser className="w-3 h-3 mr-2" />
              <span className="truncate max-w-[100px]">
                {post.author?.full_name || "Admin"}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="flex-1 mb-4 text-gray-600 dark:text-gray-300 line-clamp-2">
            {post.excerpt ||
              post.content?.replace(/<[^>]*>/g, "").substring(0, 100) + "..."}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full dark:text-gray-400 dark:bg-gray-800"
                >
                  <FaTag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full dark:text-gray-500 dark:bg-gray-800">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-800">
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group-hover:underline"
            >
              Read Article
              <FaArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-3">
              {post.view_count > 0 && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FaEye className="w-3 h-3 mr-1" />
                  {post.view_count.toLocaleString()}
                </div>
              )}
              {post.reading_time && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FaClock className="w-3 h-3 mr-1" />
                  {post.reading_time} min
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // List layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 p-4 transition-all duration-500 bg-white border border-gray-100 shadow-lg group md:flex-row dark:bg-gray-900 rounded-2xl hover:shadow-2xl dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900"
    >
      {/* Image */}
      <div className="relative flex-shrink-0 h-48 overflow-hidden md:w-48 md:h-40 rounded-xl">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-3xl font-bold text-white">
              {post.title?.charAt(0) || "B"}
            </span>
          </div>
        )}
        {post.category && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              {post.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FaCalendar className="w-3 h-3 mr-1" />
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center">
            <FaUser className="w-3 h-3 mr-1" />
            {post.author?.full_name || "Admin"}
          </div>
          {post.view_count > 0 && (
            <div className="flex items-center">
              <FaEye className="w-3 h-3 mr-1" />
              {post.view_count.toLocaleString()}
            </div>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {post.title}
        </h3>

        <p className="mb-3 text-gray-600 dark:text-gray-300 line-clamp-2">
          {post.excerpt ||
            post.content?.replace(/<[^>]*>/g, "").substring(0, 150) + "..."}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full dark:text-gray-400 dark:bg-gray-800"
              >
                <FaTag className="w-2 h-2" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group-hover:underline"
          >
            Read Full Article
            <FaArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>

          {post.reading_time && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FaClock className="w-3 h-3 mr-1" />
              {post.reading_time} min read
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
