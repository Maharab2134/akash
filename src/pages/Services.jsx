import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { servicesAPI } from "../services/api";
import ServiceCard from "../components/services/ServiceCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  FaRocket,
  FaCode,
  FaPalette,
  FaMobileAlt,
  FaChartLine,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";

const serviceCategories = [
  { id: "all", name: "All Services", icon: FaRocket },
  { id: "web", name: "Web Development", icon: FaCode },
  { id: "design", name: "UI/UX Design", icon: FaPalette },
  { id: "mobile", name: "Mobile Apps", icon: FaMobileAlt },
  { id: "marketing", name: "Marketing", icon: FaChartLine },
  { id: "backend", name: "Backend Services", icon: FaServer },
  { id: "security", name: "Security", icon: FaShieldAlt },
];

export default function Services() {
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => servicesAPI.getAll({ status: "active" }),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-blue-300 rounded-full -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bg-purple-300 rounded-full top-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bg-pink-300 rounded-full -bottom-40 left-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            <FaRocket className="w-4 h-4" />
            <span>Our Premium Services</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Solutions That Drive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Growth
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
            We deliver cutting-edge digital solutions tailored to your business
            needs, helping you stay ahead in today's competitive market.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-3 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg"
                >
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">
                    {category.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {Array.isArray(data) &&
            data.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="p-12 text-white shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Transform Your Business?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-blue-100">
              Let's discuss your project and create a custom solution that
              exceeds your expectations.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 font-bold text-blue-600 transition-colors bg-white rounded-lg shadow-lg hover:bg-gray-100"
              >
                Get Free Consultation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.div>
  );
}
