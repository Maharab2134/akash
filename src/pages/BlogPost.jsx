import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { blogAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NotFound from "./NotFound";
import {
  FaArrowLeft,
  FaCalendar,
  FaUser,
  FaEye,
  FaClock,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaBookmark,
  FaHeart,
  FaComment,
  FaTag,
  FaFolder,
  FaArrowRight,
  FaQuoteLeft,
  FaExternalLinkAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BlogPost() {
  const { slug } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => blogAPI.getBySlug(slug),
  });

  useEffect(() => {
    if (data?.data) {
      setLikeCount(data.data.likes_count || 0);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return <NotFound />;
  }

  const post = data.data;

  // Normalize tags
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string" && post.tags
    ? post.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimatedReadTime =
    post.reading_time ||
    Math.max(1, Math.ceil((post.content?.length || 0) / 1000));

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 md:py-12">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Back Button with gradient */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Post Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {post.category && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400">
                    <FaFolder className="w-3 h-3" />
                    {post.category}
                  </span>
                )}
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm"
                  >
                    <FaTag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                    {post.author?.full_name?.[0] || "A"}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {post.author?.full_name || "Admin"}
                    </div>
                    <div className="text-xs">{formatDate(post.created_at)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    <span>{estimatedReadTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="w-4 h-4" />
                    <span>{post.view_count || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Featured Image - Fixed Size */}
            {post.featured_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative mb-10 group"
              >
                <div className="relative overflow-hidden shadow-2xl rounded-2xl">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (e && e.target) {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/1200x600/3b82f6/ffffff?text=${encodeURIComponent(
                          post.title
                        )}`;
                      }
                    }}
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/30 to-transparent group-hover:opacity-100"></div>
                </div>

                {/* Image Caption */}
                {post.image_caption && (
                  <div className="mt-4 text-sm italic text-center text-gray-500 dark:text-gray-400">
                    {post.image_caption}
                  </div>
                )}
              </motion.div>
            )}

            {/* Interactive Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-between p-6 mb-10 bg-white shadow-lg dark:bg-gray-800 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isLiked
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                  }`}
                >
                  <FaHeart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="font-medium">{likeCount}</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-all duration-300 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600">
                  <FaComment className="w-5 h-5" />
                  <span className="font-medium">Comment</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleBookmark}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isBookmarked
                      ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  }`}
                >
                  <FaBookmark className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Share:
                  </span>
                  <div className="flex gap-2">
                    {[
                      {
                        icon: FaFacebook,
                        color: "hover:text-blue-600",
                        label: "Facebook",
                      },
                      {
                        icon: FaTwitter,
                        color: "hover:text-sky-500",
                        label: "Twitter",
                      },
                      {
                        icon: FaLinkedin,
                        color: "hover:text-blue-700",
                        label: "LinkedIn",
                      },
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className={`p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                        aria-label={`Share on ${social.label}`}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Post Content */}
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12 prose prose-lg dark:prose-invert max-w-none"
            >
              {/* Custom styling for better readability */}
              <style>{`
                .prose {
                  color: #374151;
                }
                .dark .prose {
                  color: #d1d5db;
                }
                .prose img {
                  border-radius: 1rem;
                  margin: 2rem auto;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .prose h2 {
                  margin-top: 3rem;
                  padding-bottom: 0.5rem;
                  border-bottom: 2px solid #e5e7eb;
                }
                .dark .prose h2 {
                  border-color: #4b5563;
                }
                .prose p {
                  line-height: 1.8;
                  margin-bottom: 1.5rem;
                }
                .prose ul, .prose ol {
                  margin-bottom: 1.5rem;
                }
                .prose li {
                  margin-bottom: 0.5rem;
                }
                .prose blockquote {
                  border-left: 4px solid #3b82f6;
                  background: #f8fafc;
                  padding: 1.5rem;
                  border-radius: 0.75rem;
                  font-style: italic;
                }
                .dark .prose blockquote {
                  background: #1f2937;
                  border-color: #60a5fa;
                }
                .prose code {
                  background: #f3f4f6;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.375rem;
                  font-size: 0.875em;
                }
                .dark .prose code {
                  background: #374151;
                }
                .prose pre {
                  background: #1e293b;
                  color: #e2e8f0;
                  padding: 1.5rem;
                  border-radius: 0.75rem;
                  overflow-x: auto;
                }
              `}</style>

              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </motion.article>

            {/* Author Bio - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 mb-12 border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl dark:border-gray-700"
            >
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                    {post.author?.full_name?.[0] || "A"}
                  </div>
                  <div className="absolute w-8 h-8 bg-green-500 border-4 border-white rounded-full -bottom-2 -right-2 dark:border-gray-800"></div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between mb-4">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {post.author?.full_name || "Admin"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {post.author?.position || "Senior Web Developer"}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-4 md:mt-0">
                      {[FaTwitter, FaLinkedin, FaGithub, FaInstagram].map(
                        (Icon, idx) => (
                          <a
                            key={idx}
                            href="#"
                            className="flex items-center justify-center w-10 h-10 text-gray-600 transition-all duration-300 bg-white rounded-full shadow-sm dark:bg-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110"
                          >
                            <Icon className="w-5 h-5" />
                          </a>
                        )
                      )}
                    </div>
                  </div>

                  <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    {post.author?.bio ||
                      "Expert in web development with over 5 years of experience. Passionate about creating beautiful, functional websites and sharing knowledge with the community."}
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 font-medium text-blue-600 transition-all duration-300 dark:text-blue-400 hover:gap-3"
                  >
                    View all articles by{" "}
                    {post.author?.full_name?.split(" ")[0] || "Author"}
                    <FaArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Newsletter Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative mb-12 overflow-hidden rounded-3xl"
            >
              {" "}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>
              <div className="relative px-8 py-12 text-center md:px-12">
                <FaQuoteLeft className="w-12 h-12 mx-auto mb-6 text-white/30" />
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Stay Updated with the Latest Insights
                </h2>
                <p className="max-w-2xl mx-auto mb-8 text-lg text-blue-100">
                  Join 10,000+ subscribers and get weekly articles on web
                  development, design trends, and business growth.
                </p>

                <div className="flex flex-col justify-center max-w-md gap-4 mx-auto sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-6 py-4 pr-12 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <FaEnvelope className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-4 top-1/2" />
                  </div>
                  <button className="px-8 py-4 font-semibold text-blue-600 transition-all duration-300 bg-white rounded-xl hover:bg-blue-50 whitespace-nowrap hover:shadow-lg">
                    Subscribe Now
                  </button>
                </div>

                <p className="mt-6 text-sm text-blue-200/70">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky space-y-8 top-8"
            >
              <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
                <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></span>
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {[
                    "Introduction",
                    "Getting Started",
                    "Deep Dive",
                    "Best Practices",
                    "Conclusion",
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href={`#section-${idx}`}
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 transition-all duration-300 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl group"
                    >
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-500">
                        0{idx + 1}
                      </span>
                      <span className="flex-1">{item}</span>
                      <FaExternalLinkAlt className="w-3 h-3 transition-opacity opacity-0 group-hover:opacity-100" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Popular Tags */}
              <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
                <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-600"></span>
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "JavaScript",
                    "NextJS",
                    "Tailwind",
                    "NodeJS",
                    "TypeScript",
                    "Web Development",
                    "UI/UX",
                    "Performance",
                  ].map((tag, idx) => (
                    <a
                      key={idx}
                      href={`/blog/tag/${tag.toLowerCase()}`}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white transition-all duration-300"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>

              {/* Related Posts */}
              <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
                <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-green-500 to-emerald-600"></span>
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Mastering React Hooks in 2024",
                      readTime: "5 min",
                    },
                    {
                      title: "Building Scalable APIs with Node.js",
                      readTime: "8 min",
                    },
                    { title: "Tailwind CSS Best Practices", readTime: "6 min" },
                    {
                      title: "The Future of Web Development",
                      readTime: "7 min",
                    },
                  ].map((article, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="block p-4 transition-all duration-300 border border-gray-100 group rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-12 h-12 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-green-400 to-emerald-500">
                          0{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <FaClock className="w-3 h-3" />
                            {article.readTime} read
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                <h3 className="mb-6 text-xl font-bold">Article Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Reading Time</span>
                    <span className="font-semibold">
                      {estimatedReadTime} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Word Count</span>
                    <span className="font-semibold">
                      {((post.content?.length || 0) / 5) | 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Published</span>
                    <span className="font-semibold">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Views</span>
                    <span className="font-semibold">
                      {post.view_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
