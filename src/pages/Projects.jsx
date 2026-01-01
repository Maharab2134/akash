import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsAPI } from "../services/api";
import ProjectCard from "../components/projects/ProjectCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

import {
  FaSearch,
  FaFilter,
  FaCode,
  FaMobile,
  FaShoppingCart,
  FaPalette,
  FaChartLine,
  FaRocket,
  FaReact,
  FaNodeJs,
  FaPhp,
  FaLaravel,
  FaDatabase,
  FaAws,
  FaGoogle,
} from "react-icons/fa";
import { SiMongodb, SiFlutter, SiFirebase } from "react-icons/si";
/* =======================
   CATEGORY DATA
======================= */
const categories = [
  { id: "all", name: "All Projects", icon: FaFilter },
  { id: "web", name: "Web Applications", icon: FaCode },
  { id: "mobile", name: "Mobile Apps", icon: FaMobile },
  { id: "ecommerce", name: "E-Commerce", icon: FaShoppingCart },
  { id: "design", name: "UI/UX Design", icon: FaPalette },
  { id: "marketing", name: "Digital Marketing", icon: FaChartLine },
];

/* =======================
   WORKING PROCESS
======================= */
const workingProcess = [
  {
    step: "01",
    title: "Requirement Analysis",
    description:
      "We understand your business needs and gather complete requirements.",
    icon: FaSearch,
  },
  {
    step: "02",
    title: "UI/UX Design",
    description: "We design clean, modern and user-friendly interfaces.",
    icon: FaPalette,
  },
  {
    step: "03",
    title: "Development",
    description: "Our developers build scalable and secure solutions.",
    icon: FaCode,
  },
  {
    step: "04",
    title: "Testing & Launch",
    description: "We test thoroughly and launch with full support.",
    icon: FaRocket,
  },
];

/* =======================
   TECHNOLOGIES
======================= */
const technologies = [
  { name: "React", icon: FaReact, color: "text-sky-500" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-600" },
  { name: "PHP", icon: FaPhp, color: "text-indigo-600" },
  { name: "Laravel", icon: FaLaravel, color: "text-red-600" },
  { name: "MySQL", icon: FaDatabase, color: "text-blue-600" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-700" },
  { name: "Flutter", icon: SiFlutter, color: "text-sky-400" },
  { name: "Firebase", icon: SiFirebase, color: "text-yellow-500" },
  { name: "AWS", icon: FaAws, color: "text-orange-500" },
];

/* =======================
   TESTIMONIALS
======================= */
const testimonials = [
  {
    name: "Ahmed Rahman",
    company: "E-Commerce Business",
    feedback: "They delivered our project on time with excellent quality.",
  },
  {
    name: "Sarah Khan",
    company: "Startup Founder",
    feedback: "Professional team, great communication and support.",
  },
  {
    name: "John Smith",
    company: "Marketing Agency",
    feedback: "Outstanding service and very skilled developers.",
  },
];

/* =======================
   COMPONENT
======================= */
export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsAPI.getAll({ status: "active" }),
  });

  const filteredProjects = data?.data?.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" ||
      project.category?.toLowerCase().includes(selectedCategory);

    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-12">
      <div className="px-4 mx-auto max-w-7xl">
        {/* ================= HERO ================= */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Our Projects</h1>
          <p className="max-w-3xl mx-auto text-gray-600">
            Explore our successful projects and see how we help businesses grow.
          </p>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-8">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 border rounded-lg"
            />
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          </div>

          {/* ================= CATEGORIES ================= */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="mr-2" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= PROJECT GRID ================= */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* ================= EMPTY ================= */}
        {filteredProjects?.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No projects found
          </div>
        )}

        {/* ================= WORKING PROCESS ================= */}
        <div className="mt-20">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Our Working Process
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {workingProcess.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 bg-white shadow rounded-xl">
                  <div className="flex justify-between mb-4">
                    <Icon className="text-3xl text-blue-600" />
                    <span className="text-2xl font-bold text-gray-300">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= TECHNOLOGY SLIDER ================= */}
        <div className="mt-20">
          <h2 className="mb-8 text-3xl font-bold text-center">
            Technologies We Use
          </h2>

          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll">
              {technologies.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={i}
                    className="min-w-[160px] bg-gray-100 p-5 rounded-lg text-center font-semibold flex flex-col items-center"
                  >
                    <Icon className={`text-3xl ${tech.color}`} />
                    <span className="mt-2 text-gray-700">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= TESTIMONIALS ================= */}
        <div className="mt-20">
          <h2 className="mb-12 text-3xl font-bold text-center">
            What Our Clients Say
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 bg-white shadow rounded-xl">
                <p className="mb-4 text-gray-600">“{t.feedback}”</p>
                <h4 className="font-semibold">{t.name}</h4>
                <span className="text-sm text-gray-500">{t.company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
