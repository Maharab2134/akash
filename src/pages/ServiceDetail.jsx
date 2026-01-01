import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { servicesAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NotFound from "./NotFound";
import {
  FaArrowLeft,
  FaCheck,
  FaLightbulb,
  FaChartLine,
  FaAward,
  FaClock,
  FaUsers,
  FaCode,
} from "react-icons/fa";

export default function ServiceDetail() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => servicesAPI.getBySlug(slug),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return <NotFound />;
  }

  const service = data.data ?? data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-4 py-16 mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-white transition-all bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Services
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <i
                    className={`${
                      service.icon || "fas fa-code"
                    } text-4xl text-white`}
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white md:text-5xl">
                    {service.title}
                  </h1>
                  {service.is_popular && (
                    <span className="inline-block px-3 py-1 mt-2 text-sm font-semibold text-white bg-orange-400 rounded-full">
                      Popular Service
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-4 text-xl text-white/90">
                {service.full_description
                  ? service.short_description
                  : service.short_description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Short Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 mb-8 bg-white shadow-lg rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaLightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                {service.short_description}
              </p>
            </motion.div>

            {/* Detailed Description */}
            {service.full_description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="p-8 mb-8 bg-white shadow-lg rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <FaLightbulb className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detailed Description
                  </h2>
                </div>

                <div
                  className="prose prose-lg text-gray-700 max-w-none prose-ul:list-disc prose-ul:list-outside prose-ul:pl-6 prose-li:marker:text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: service.full_description,
                  }}
                />
              </motion.div>
            )}

            {/* Key Features */}
            {service.features && service.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-8 mb-8 bg-white shadow-lg rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FaCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Key Features
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        {feature.icon ? (
                          <i
                            className={`${feature.icon} text-green-600 text-lg`}
                            aria-hidden="true"
                          ></i>
                        ) : (
                          <FaCheck className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <span className="text-gray-700">{feature.title}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* What We Deliver */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-8 bg-white shadow-lg rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FaChartLine className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  What We Deliver
                </h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <FaCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Professional and scalable solutions
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Dedicated project management
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Ongoing support and maintenance
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Quality assurance and testing
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* SEO Metadata Section */}
            {(service.meta_title ||
              service.meta_description ||
              service.meta_keywords) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="p-8 mt-8 border border-gray-200 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-200 rounded-xl">
                    <FaCode className="w-6 h-6 text-gray-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    SEO Information
                  </h2>
                </div>
                <div className="space-y-6">
                  {service.meta_title && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-600">
                        Meta Title
                      </h3>
                      <p className="p-3 text-gray-800 bg-white border border-gray-200 rounded-lg">
                        {service.meta_title}
                      </p>
                    </div>
                  )}
                  {service.meta_description && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-600">
                        Meta Description
                      </h3>
                      <p className="p-3 text-gray-800 bg-white border border-gray-200 rounded-lg">
                        {service.meta_description}
                      </p>
                    </div>
                  )}
                  {service.meta_keywords && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-600">
                        Meta Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {service.meta_keywords
                          .split(",")
                          .map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-white shadow-lg rounded-2xl"
            >
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Service Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">
                    {service.category || "Professional"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {service.is_active ? "Active" : "Coming Soon"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-white shadow-lg rounded-2xl"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Why Choose Us?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <FaAward className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Experienced team of experts
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaClock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    On-time project delivery
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaUsers className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Dedicated support team
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 text-white shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl"
            >
              <h3 className="mb-3 text-xl font-bold">Ready to Get Started?</h3>
              <p className="mb-6 text-blue-100">
                Let's discuss how this service can benefit your project.
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="block w-full py-3 font-semibold text-center text-blue-600 transition-all bg-white rounded-lg hover:bg-gray-50 hover:shadow-lg"
                >
                  Request a Quote
                </Link>
                <button className="w-full py-3 font-semibold text-center text-white transition-all border-2 border-white rounded-lg hover:bg-white/10">
                  Get More Info
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
