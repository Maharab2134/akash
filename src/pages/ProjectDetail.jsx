import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { projectsAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NotFound from "./NotFound";
import ProjectCard from "../components/projects/ProjectCard";
import {
  FaArrowLeft,
  FaCalendar,
  FaUser,
  FaGlobe,
  FaCode,
  FaCheck,
  FaClock,
  FaTag,
  FaEye,
  FaLightbulb,
  FaChartLine,
  FaExternalLinkAlt,
  FaImages,
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";

export default function ProjectDetail() {
  const { slug } = useParams();
  const isNumeric = /^\d+$/.test(slug);

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: () =>
      isNumeric ? projectsAPI.getById(slug) : projectsAPI.getBySlug(slug),
  });

  const { data: relatedProjects } = useQuery({
    queryKey: ["related-projects"],
    queryFn: () => projectsAPI.getRelated(slug),
    enabled: !!data?.data,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return <NotFound />;
  }

  const project = data.data;

  // Normalize technologies into a clean string array
  const parseTechnologies = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((t) => (typeof t === "string" ? t.trim() : String(t).trim()))
        .filter((t) => t.length > 0);
    }
    if (typeof value === "string") {
      // Try JSON first
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed
            .map((t) => (typeof t === "string" ? t.trim() : String(t).trim()))
            .filter((t) => t.length > 0);
        }
      } catch (_) {}

      // Extract quoted tokens like ["React""Node.js"] → [React, Node.js]
      const quoted = value.match(/"([^"]+)"/g);
      if (quoted && quoted.length) {
        return quoted
          .map((m) => m.slice(1, -1).trim())
          .filter((t) => t.length > 0);
      }

      // Fallback: split by commas or whitespace
      return value
        .split(/\s*,\s*|\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
    // Anything else → stringified and split by whitespace
    return String(value)
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

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
                to="/projects"
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-white transition-all bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>

              <div className="flex items-center gap-3 mb-4">
                {project.client_logo && (
                  <div className="p-3 bg-white rounded-lg shadow-lg">
                    <img
                      src={project.client_logo}
                      alt={project.client_name}
                      className="object-contain w-12 h-12"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold text-white md:text-5xl">
                    {project.title}
                  </h1>
                  <p className="mt-2 text-lg text-blue-100">
                    For {project.client_name}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xl text-white/90">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-6 mt-8">
                <div className="flex items-center gap-2 text-white">
                  <div className="p-2 rounded-lg bg-white/20">
                    <FaCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Timeline</p>
                    <p className="font-medium">
                      {new Date(project.start_date).toLocaleDateString()} -{" "}
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString()
                        : "Present"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <div className="p-2 rounded-lg bg-white/20">
                    <FaTag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Category</p>
                    <p className="font-medium">{project.category}</p>
                  </div>
                </div>

                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 transition-all bg-white rounded-lg hover:bg-gray-100 hover:shadow-lg"
                  >
                    <FaGlobe className="w-5 h-5" />
                    <span>Live Demo</span>
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cover Image */}
            {project.cover_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12 overflow-hidden shadow-2xl rounded-2xl"
              >
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-auto transition-transform duration-700 hover:scale-105"
                />
              </motion.div>
            )}

            {/* Content Sections */}
            <div className="space-y-12">
              {project.challenge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-8 bg-white shadow-lg rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <FaEye className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      The Challenge
                    </h2>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {project.challenge}
                    </p>
                  </div>
                </motion.div>
              )}

              {project.solution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-8 bg-white shadow-lg rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <HiOutlineLightBulb className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Our Solution
                    </h2>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {project.solution}
                    </p>
                  </div>
                </motion.div>
              )}

              {project.result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="p-8 bg-white shadow-lg rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <FaChartLine className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      The Result
                    </h2>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {project.result}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="p-8 bg-white shadow-lg rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <FaImages className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Project Gallery
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {project.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden group rounded-xl"
                      >
                        <img
                          src={image}
                          alt={`${project.title} - ${index + 1}`}
                          className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-end p-4 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100">
                          <span className="font-medium text-white">
                            View Image {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-white shadow-lg rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaCode className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Technologies Used
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {parseTechnologies(project.technologies).map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-white shadow-lg rounded-2xl"
            >
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Key Features
              </h3>
              <ul className="space-y-4">
                {project.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-1 mt-0.5">
                      <FaCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 bg-white shadow-lg rounded-2xl"
            >
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Project Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">Client</span>
                  <span className="font-semibold text-gray-900">
                    {project.client_name}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">Timeline</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(project.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.is_active ? "Completed" : "In Progress"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 text-white shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl"
            >
              <h3 className="mb-3 text-xl font-bold">
                Have a Similar Project?
              </h3>
              <p className="mb-6 text-blue-100">
                Let's discuss how we can bring your ideas to life.
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="block w-full py-3 font-semibold text-center text-blue-600 transition-all bg-white rounded-lg hover:bg-gray-50 hover:shadow-lg"
                >
                  Start Your Project
                </Link>
                <Link
                  to="/services"
                  className="block w-full py-3 font-semibold text-center text-white transition-all border-2 border-white rounded-lg hover:bg-white/10"
                >
                  View Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects?.data && relatedProjects.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Projects
              </h2>
              <Link
                to="/projects"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                View All Projects →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.data.slice(0, 3).map((relatedProject) => (
                <ProjectCard
                  key={relatedProject.id}
                  project={relatedProject}
                  layout="compact"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
