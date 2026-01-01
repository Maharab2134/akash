import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { blogAPI } from "../services/api";
import BlogCard from "../components/blog/BlogCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  FaSearch,
  FaCalendar,
  FaUser,
  FaTag,
  FaFire,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

const popularTags = [
  "React",
  "JavaScript",
  "Laravel",
  "Node.js",
  "Vue.js",
  "CSS",
  "Next.js",
  "PHP",
  "AWS",
  "MySQL",
];

export default function Blog() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => blogAPI.getAll({ status: "published" }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.data) {
      let posts = data.data;

      // Filter by category
      if (selectedCategory !== "all") {
        posts = posts.filter((post) => post.category === selectedCategory);
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        posts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(term) ||
            post.excerpt?.toLowerCase().includes(term) ||
            post.content?.toLowerCase().includes(term) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(term))
        );
      }

      setFilteredPosts(posts);

      const counts = data.meta?.category_counts || {};
      const dynamicCategories = [
        { id: "all", name: "All Posts", count: data.data.length },
        ...Object.entries(counts).map(([name, count]) => ({
          id: name,
          name,
          count,
        })),
      ];

      setCategories(dynamicCategories);
    }
  }, [data, selectedCategory, searchTerm]);

  const popularPosts =
    data?.data
      ?.filter((post) => post.view_count > 50)
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 5) || [];

  const recentPosts =
    data?.data
      ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5) || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Failed to load posts
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-16 bg-gradient-to-br from-blue-500 to-purple-600"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative px-4 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Our Blog
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-blue-100">
              Latest insights, tutorials, and news from our team
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <FaSearch className="absolute w-5 h-5 text-gray-400 left-4 top-3.5" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span>{category.name}</span>
                  {category.count > 0 && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-black/10 rounded-full">
                      {category.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Posts Grid */}
            <AnimatePresence>
              {filteredPosts?.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="mb-4 text-gray-400">
                    <FaSearch className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    No articles found
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-gray-600">
                    Try adjusting your search or filter
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                    }}
                    className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Posts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-white border border-gray-200 rounded-lg"
            >
              <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                <FaClock className="text-blue-500" />
                Recent Posts
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-3 p-2 rounded-lg group hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-lg">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-blue-100">
                            <span className="font-bold text-blue-600">
                              {post.title?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                          {post.title}
                        </h4>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <FaCalendar className="w-3 h-3 mr-1" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Popular Posts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-white border border-gray-200 rounded-lg"
            >
              <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                <FaFire className="text-orange-500" />
                Popular Posts
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-3 p-2 rounded-lg group hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-orange-500 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                          {post.title}
                        </h4>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <FaUser className="w-3 h-3 mr-1" />
                          {post.author?.full_name || "Admin"}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 bg-white border border-gray-200 rounded-lg"
            >
              <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                <FaTag className="text-green-500" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      to={`/blog/tag/${tag.toLowerCase()}`}
                      className="inline-block px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600"
                    >
                      #{tag}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 text-white rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
            >
              <h3 className="mb-3 text-lg font-bold">Newsletter</h3>
              <p className="mb-4 text-sm text-blue-100">
                Subscribe to get updates
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 text-white placeholder-blue-200 border rounded-lg bg-white/20 border-white/30 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button className="flex items-center justify-center w-full gap-2 px-4 py-2 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100">
                  Subscribe
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
