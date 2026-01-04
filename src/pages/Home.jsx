import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { servicesAPI, projectsAPI, testimonialsAPI } from "../services/api";
import Hero from "../components/home/Hero.jsx";
import ServiceCard from "../components/services/ServiceCard";
import ProjectCard from "../components/projects/ProjectCard";
import TestimonialCard from "../components/testimonials/TestimonialCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowUpRightIcon,
  PlayCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const fallbackServices = [
  {
    id: "svc-1",
    title: "Custom Web Development",
    short_description: "Modern, responsive sites tailored to your brand.",
    icon: "fas fa-code",
    color: "from-blue-500 to-cyan-500",
    features: [
      { title: "Responsive Design", description: "Works on all devices" },
      { title: "Performance", description: "Fast loading times" },
    ],
  },
  {
    id: "svc-2",
    title: "Mobile Applications",
    short_description: "Cross-platform apps that delight users.",
    icon: "fas fa-mobile-alt",
    color: "from-purple-500 to-pink-500",
    features: [
      { title: "iOS & Android", description: "Native performance" },
      { title: "Offline Support", description: "Work without internet" },
    ],
  },
  {
    id: "svc-3",
    title: "Cloud & DevOps",
    short_description: "Reliable deployments and scalable infrastructure.",
    icon: "fas fa-cloud",
    color: "from-orange-500 to-red-500",
    features: [
      { title: "Auto Scaling", description: "Handle traffic spikes" },
      { title: "CI/CD", description: "Automated deployments" },
    ],
  },
  {
    id: "svc-4",
    title: "UI/UX Design",
    short_description: "Beautiful interfaces with great user experience.",
    icon: "fas fa-paint-brush",
    color: "from-green-500 to-emerald-500",
    features: [
      { title: "User Research", description: "Understand your users" },
      { title: "Prototyping", description: "Test before building" },
    ],
  },
  {
    id: "svc-5",
    title: "Digital Marketing",
    short_description: "Grow your business with strategic marketing.",
    icon: "fas fa-chart-line",
    color: "from-indigo-500 to-blue-500",
    features: [
      { title: "SEO", description: "Rank higher on Google" },
      { title: "Social Media", description: "Engage your audience" },
    ],
  },
  {
    id: "svc-6",
    title: "AI & ML Solutions",
    short_description: "Intelligent solutions for modern businesses.",
    icon: "fas fa-brain",
    color: "from-violet-500 to-purple-500",
    features: [
      { title: "Predictive Analytics", description: "Data-driven insights" },
      { title: "Automation", description: "Streamline processes" },
    ],
  },
];

const fallbackProjects = [
  {
    id: "proj-1",
    title: "E-commerce Redesign",
    category: "Retail",
    description: "A frictionless shopping experience across devices.",
    client_name: "StyleMart",
    technologies: ["React", "Node.js", "MongoDB"],
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
  },
  {
    id: "proj-2",
    title: "Fintech Dashboard",
    category: "Finance",
    description: "Real-time analytics with a clean, usable UI.",
    client_name: "FinTech Pro",
    technologies: ["Vue.js", "Python", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w-800&auto=format&fit=crop",
  },
  {
    id: "proj-3",
    title: "SaaS Onboarding",
    category: "SaaS",
    description: "Guided flows that boost activation and retention.",
    client_name: "SaaS Solutions",
    technologies: ["React", "TypeScript", "AWS"],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w-800&auto=format&fit=crop",
  },
];

const fallbackTestimonials = [
  {
    id: "test-1",
    client_name: "Alex Morgan",
    company: "RetailCo",
    position: "CMO",
    content:
      "They delivered on time with polish and care. Our e-commerce platform saw a 200% increase in sales.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
  },
  {
    id: "test-2",
    client_name: "Priya Shah",
    company: "Finlytics",
    position: "Founder",
    content:
      "The team understood our needs and shipped fast. The mobile app has 4.8-star rating on both stores.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop",
  },
  {
    id: "test-3",
    client_name: "Diego Ramos",
    company: "CloudOps",
    position: "CTO",
    content:
      "Rock-solid engineering and great collaboration. Our platform handles 10,000+ requests per second.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop",
  },
];

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  // Normalize mixed API data (array, JSON string, CSV string)
  const normalizeToArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      // Try JSON parse first if looks like JSON
      if (
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        (trimmed.startsWith("{") && trimmed.endsWith("}"))
      ) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        } catch {}
      }
      // Fallback: CSV -> array of strings
      return trimmed
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return [];
  };

  const normalizeFeatures = (features) => {
    const arr = normalizeToArray(features);
    return arr
      .map((f) => (typeof f === "string" ? { title: f } : f))
      .filter(Boolean);
  };

  const normalizeTechnologies = (technologies) => {
    const arr = normalizeToArray(technologies);
    return arr
      .map((t) => (typeof t === "string" ? t : t?.name ?? ""))
      .filter(Boolean);
  };

  const {
    data: services,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ["featured-services"],
    queryFn: () => servicesAPI.getFeatured(),
    retry: 1,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: () => projectsAPI.getFeatured(),
    retry: 1,
  });

  const {
    data: testimonials,
    isLoading: testimonialsLoading,
    isError: testimonialsError,
  } = useQuery({
    queryKey: ["featured-testimonials"],
    queryFn: () => testimonialsAPI.getFeatured(),
    retry: 1,
  });

  const [stats, setStats] = useState([
    {
      label: "Projects Completed",
      value: 250,
      suffix: "+",
      icon: TrophyIcon,
      color: "text-yellow-500",
    },
    {
      label: "Happy Clients",
      value: 120,
      suffix: "+",
      icon: UserGroupIcon,
      color: "text-green-500",
    },
    {
      label: "Team Experts",
      value: 25,
      suffix: "+",
      icon: SparklesIcon,
      color: "text-purple-500",
    },
    {
      label: "Years Experience",
      value: 8,
      suffix: "+",
      icon: ChartBarIcon,
      color: "text-blue-500",
    },
  ]);

  const [animatedStats, setAnimatedStats] = useState(
    stats.map((stat) => ({ ...stat, animatedValue: 0 }))
  );

  useEffect(() => {
    const timers = animatedStats.map((stat, index) => {
      return setTimeout(() => {
        let start = 0;
        const end = stat.value;
        const duration = 1500;
        const incrementTime = 20;
        const steps = duration / incrementTime;
        const incrementValue = end / steps;

        const timer = setInterval(() => {
          start += incrementValue;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setAnimatedStats((prev) =>
            prev.map((s, i) =>
              i === index ? { ...s, animatedValue: Math.floor(start) } : s
            )
          );
        }, incrementTime);

        return () => clearInterval(timer);
      }, index * 200);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const isLoading = servicesLoading || projectsLoading || testimonialsLoading;

  const safeServices =
    Array.isArray(services) && services.length > 0
      ? services
      : fallbackServices;
  const safeProjects = Array.isArray(projects)
    ? projects
    : Array.isArray(projects?.data)
    ? projects.data
    : fallbackProjects;
  const safeTestimonials = testimonials?.data || fallbackTestimonials;

  const displayServices =
    Array.isArray(safeServices) && safeServices.length > 0
      ? safeServices
      : fallbackServices;
  const displayProjects =
    Array.isArray(safeProjects) && safeProjects.length > 0
      ? safeProjects
      : fallbackProjects;
  const displayTestimonials =
    Array.isArray(safeTestimonials) && safeTestimonials.length > 0
      ? safeTestimonials
      : fallbackTestimonials;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <Hero />

      {/* Stats Section - Modern Design */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-72 h-72 bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full w-96 h-96 bg-purple-500/10 blur-3xl" />

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {animatedStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative p-8 transition-all duration-300 border group bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:border-white/20 hover:scale-105"
                >
                  <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl group-hover:opacity-100" />

                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 transition-colors rounded-full bg-white/10 group-hover:bg-white/20">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="mb-2 text-5xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                      {stat.animatedValue}
                      {stat.suffix}
                    </div>
                    <div className="font-medium text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section - Modern Cards */}
      <section className="relative py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 mb-4 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              What We Offer
            </motion.div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Digital Solutions
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              We deliver innovative digital solutions that drive growth and
              transform businesses
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 transition-transform duration-500 transform bg-gradient-to-br from-gray-900 to-black rounded-3xl group-hover:scale-105" />
                <div className="relative p-8 transition-all duration-500 bg-white border border-gray-100 shadow-2xl rounded-3xl shadow-gray-200/50 group-hover:shadow-2xl group-hover:shadow-blue-100/50">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${
                      service.color || "from-blue-500 to-cyan-500"
                    } mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <i className={`${service.icon} text-2xl text-white`}></i>
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                    {service.title}
                  </h3>

                  <p className="mb-6 text-gray-600">
                    {service.short_description}
                  </p>

                  <div className="mb-8 space-y-3">
                    {normalizeFeatures(service.features)
                      .slice(0, 2)
                      .map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <ShieldCheckIcon className="w-5 h-5 mr-3 text-green-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {feature.title}
                          </span>
                        </div>
                      ))}
                  </div>

                  <Link
                    to={`/services/${service.slug || service.id}`}
                    className="inline-flex items-center font-semibold text-blue-600 transition-colors group-hover:text-blue-700"
                  >
                    Learn More
                    <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform transform group-hover:translate-x-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              Explore All Services
              <RocketLaunchIcon className="w-5 h-5 ml-3 transition-transform transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects Section - Modern Showcase */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent" />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between mb-16 lg:flex-row lg:items-center">
            <div className="mb-8 lg:w-1/2 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center px-4 py-2 mb-4 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full"
              >
                <TrophyIcon className="w-4 h-4 mr-2" />
                Our Portfolio
              </motion.div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Featured{" "}
                <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                  Projects
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Discover our latest work that showcases innovation, creativity,
                and technical excellence
              </p>
              <Link
                to="/projects"
                className="inline-flex items-center px-6 py-3 font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-full hover:border-gray-400"
              >
                View All Projects
                <ArrowUpRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2 lg:pl-12"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20" />
                <div className="relative p-8 bg-white shadow-2xl rounded-2xl">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">
                    Why Choose Us?
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <BoltIcon className="w-6 h-6 mr-3 text-yellow-500" />
                      <span className="text-gray-700">
                        Industry-leading expertise
                      </span>
                    </li>
                    <li className="flex items-center">
                      <ShieldCheckIcon className="w-6 h-6 mr-3 text-green-500" />
                      <span className="text-gray-700">
                        100% satisfaction guarantee
                      </span>
                    </li>
                    <li className="flex items-center">
                      <SparklesIcon className="w-6 h-6 mr-3 text-blue-500" />
                      <span className="text-gray-700">
                        Innovative solutions
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl group-hover:opacity-100 blur-xl" />
                <div className="relative overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-2xl rounded-3xl shadow-gray-200/50 group-hover:border-transparent">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-400 to-purple-400">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-700 transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="text-4xl font-bold text-white">
                          {project.title.charAt(0)}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 text-sm font-semibold text-white rounded-full bg-white/20 backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                      {project.title}
                    </h3>
                    <p className="relative mb-6 text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {normalizeTechnologies(project.technologies)
                        .slice(0, 3)
                        .map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {project.client_name}
                        </div>
                      </div>
                      <Link
                        to={`/projects/${project.slug || project.id}`}
                        className="inline-flex items-center justify-center w-12 h-12 text-blue-600 transition-colors rounded-full bg-blue-50 hover:bg-blue-100"
                      >
                        <ArrowRightIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Carousel Style */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute rounded-full -top-24 -right-24 w-96 h-96 bg-yellow-500/10 blur-3xl" />
        <div className="absolute rounded-full -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 blur-3xl" />

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 mb-4 text-sm font-semibold text-yellow-600 bg-yellow-100 rounded-full"
            >
              <StarIcon className="w-4 h-4 mr-2" />
              Client Testimonials
            </motion.div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Trusted by{" "}
              <span className="text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">
                Industry Leaders
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              See what our clients have to say about working with us
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="relative p-8 transition-all duration-500 bg-white border border-gray-100 shadow-2xl rounded-3xl shadow-gray-200/50 hover:border-yellow-200 hover:shadow-2xl hover:shadow-yellow-100/50">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-bl-3xl rounded-tr-3xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 p-1 mr-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.client_name}
                          className="object-cover w-full h-full border-2 border-white rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-yellow-100 border-2 border-white rounded-full">
                          <UserCircleIcon className="w-10 h-10 text-yellow-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonial.client_name}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {testimonial.position}
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  <p className="mb-6 italic text-gray-700">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center space-x-4">
              <Link
                to="/about"
                className="px-8 py-3 font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-full hover:border-gray-400"
              >
                Read More Stories
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 font-semibold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:shadow-2xl hover:shadow-yellow-500/25"
              >
                Share Your Experience
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Modern Gradient Design */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop')] opacity-10" />
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full w-96 h-96 bg-white/10 blur-3xl" />

        <div className="relative max-w-4xl px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-white/20 backdrop-blur-sm">
              <PlayCircleIcon className="w-6 h-6 mr-3 text-white" />
              <span className="font-semibold text-white">Ready to Begin?</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Let's Build Something{" "}
              <span className="text-yellow-300">Amazing</span> Together
            </h2>

            <p className="max-w-2xl mx-auto mb-10 text-xl text-blue-100">
              Join hundreds of successful companies that trust us with their
              digital transformation
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center px-10 py-4 text-lg font-bold text-blue-600 bg-white rounded-full hover:bg-gray-50 hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 min-w-[200px] justify-center"
              >
                Start Your Project
                <ArrowRightIcon className="w-5 h-5 ml-3 transition-transform transform group-hover:translate-x-2" />
              </Link>

              <Link
                to="/projects"
                className="group inline-flex items-center px-10 py-4 text-lg font-bold text-white border-2 border-white rounded-full hover:bg-white/10 hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 min-w-[200px] justify-center"
              >
                View Our Work
                <ArrowUpRightIcon className="w-5 h-5 ml-3" />
              </Link>
            </div>

            <div className="pt-8 mt-12 border-t border-white/20">
              <div className="flex flex-wrap justify-center gap-8 text-white/80">
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">30-Day</div>
                  <div className="text-sm">Money Back</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm">Satisfaction</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
