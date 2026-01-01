import { Link } from "react-router-dom";
import { FaCalendar, FaUser, FaExternalLinkAlt } from "react-icons/fa";

export default function ProjectCard({ project }) {
  const parseTechnologies = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((t) => (typeof t === "string" ? t.trim() : String(t).trim()))
        .filter((t) => t.length > 0);
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed
            .map((t) => (typeof t === "string" ? t.trim() : String(t).trim()))
            .filter((t) => t.length > 0);
        }
      } catch (_) {}

      const quoted = value.match(/"([^"]+)"/g);
      if (quoted && quoted.length) {
        return quoted
          .map((m) => m.slice(1, -1).trim())
          .filter((t) => t.length > 0);
      }

      return value
        .split(/\s*,\s*|\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
    return String(value)
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  return (
    <div className="relative overflow-hidden transition-all duration-500 bg-white shadow-lg group dark:bg-gray-800 rounded-2xl hover:-translate-y-3 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        {project.cover_image ? (
          <img
            src={project.cover_image}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600">
            <span className="text-3xl font-bold text-white">
              {project.title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 opacity-0 bg-black/60 group-hover:opacity-100">
          <Link
            to={`/projects/${project.slug || project.id}`}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-500 translate-y-6 bg-blue-600 rounded-lg opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-blue-700"
          >
            View Details
            <FaExternalLinkAlt />
          </Link>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
            {project.category || "Project"}
          </span>
        </div>

        {/* Client Logo */}
        {project.client_logo && (
          <div className="absolute p-1 bg-white rounded-full shadow bottom-4 right-4">
            <img
              src={project.client_logo}
              alt={project.client_name}
              className="object-contain w-10 h-10 rounded-full"
            />
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-blue-600">
          {project.title}
        </h3>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {project.description || "No description available."}
        </p>

        {/* Technologies */}
        {(() => {
          const techs = parseTechnologies(project.technologies);
          return techs.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {techs.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
              {techs.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{techs.length - 3}
                </span>
              )}
            </div>
          ) : null;
        })()}

        {/* Meta */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <FaUser />
            {project.client_name || "Client"}
          </div>
          <div className="flex items-center gap-2">
            <FaCalendar />
            {project.created_at
              ? new Date(project.created_at).getFullYear()
              : "Year"}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Link
            to={`/projects/${project.slug || project.id}`}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Details
          </Link>

          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
