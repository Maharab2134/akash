import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { teamAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  FaBullseye,
  FaEye,
  FaRocket,
  FaUsers,
  FaAward,
  FaHandshake,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaHeart,
  FaLightbulb,
  FaShieldAlt,
  FaGlobe,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import journeyImg from "../assets/img_journey.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function About() {
  const { data: teamData, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: () => teamAPI.getAll(),
  });

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Navigation references for Swiper
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const stats = [
    {
      icon: FaAward,
      value: "5+",
      label: "Years Experience",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      icon: FaUsers,
      value: "50+",
      label: "Happy Clients",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: FaRocket,
      value: "150+",
      label: "Projects Completed",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: FaHandshake,
      value: "24/7",
      label: "Support",
      color: "from-green-400 to-green-600",
    },
  ];

  const values = [
    {
      icon: FaBullseye,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, delivering high-quality solutions that exceed expectations.",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: FaUsers,
      title: "Collaboration",
      description:
        "We believe in working closely with our clients to understand their needs and achieve shared success.",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      icon: FaEye,
      title: "Transparency",
      description:
        "We maintain open communication and transparency throughout the project lifecycle.",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: FaRocket,
      title: "Innovation",
      description:
        "We constantly explore new technologies and methodologies to provide cutting-edge solutions.",
      gradient: "from-purple-400 to-pink-500",
    },
  ];

  const features = [
    {
      icon: FaShieldAlt,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
    },
    {
      icon: FaGlobe,
      title: "Global Reach",
      description: "Serving clients across 20+ countries worldwide",
    },
    {
      icon: FaChartLine,
      title: "Growth Focused",
      description: "Solutions designed to scale with your business",
    },
    {
      icon: FaLightbulb,
      title: "Future Ready",
      description: "Adopting latest technologies for tomorrow's challenges",
    },
  ];

  // Fixed SVG data URL
  const patternSVG =
    "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  const whitePatternSVG =
    "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Animated Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: `url("${patternSVG}")` }}
          ></div>
        </div>

        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <span className="px-4 py-1 text-sm font-semibold text-white">
                Since 2018
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold text-transparent md:text-7xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text">
              About AminWebTech
            </h1>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 md:text-2xl dark:text-gray-300">
              We are a team of passionate{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                developers
              </span>
              ,
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {" "}
                designers
              </span>
              , and
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {" "}
                strategists
              </span>{" "}
              dedicated to delivering exceptional digital solutions.
            </p>

            {/* Floating Elements */}
            <div className="absolute w-20 h-20 rounded-full top-10 left-10 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute w-32 h-32 delay-1000 rounded-full bottom-10 right-10 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Stats with Animation */}
      <div className="px-4 mx-auto -mt-16 max-w-7xl sm:px-6 lg:px-8 md:-mt-20">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div
                className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r group-hover:opacity-100 rounded-2xl blur-xl"
                style={{
                  background:
                    stat.color === "from-yellow-400 to-yellow-600"
                      ? "linear-gradient(135deg, #fbbf24, #d97706)"
                      : stat.color === "from-blue-400 to-blue-600"
                      ? "linear-gradient(135deg, #60a5fa, #2563eb)"
                      : stat.color === "from-purple-400 to-purple-600"
                      ? "linear-gradient(135deg, #a78bfa, #7c3aed)"
                      : "linear-gradient(135deg, #34d399, #059669)",
                }}
              ></div>
              <div className="relative p-6 transition-all duration-300 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl md:p-8 hover:shadow-2xl dark:border-gray-700">
                <div
                  className={`h-14 w-14 rounded-xl bg-gradient-to-r ${stat.color} p-3 mx-auto mb-4 shadow-lg`}
                >
                  <stat.icon className="w-full h-full text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                  {stat.value}
                </div>
                <div className="font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story with Image */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-28">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold text-blue-600 rounded-full bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400">
              <FaHeart className="w-4 h-4" />
              Our Journey
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl dark:text-white">
              Building Digital Dreams{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Since 2018
              </span>
            </h2>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Founded in 2018, AminWebTech began as a small team of passionate
                developers with a vision to transform businesses through
                technology. What started as a humble beginning has now grown
                into a full-fledged digital agency serving clients across the
                globe.
              </p>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Our journey has been marked by continuous learning, innovation,
                and a relentless pursuit of excellence. We've evolved from basic
                web development to offering comprehensive digital solutions
                including mobile apps, e-commerce platforms, and cutting-edge
                VR/AR experiences.
              </p>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"
          >
            <motion.img
              src={journeyImg}
              alt="Innovation"
              className="object-contain w-full h-full p-10"
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Our Values with Cards */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 md:py-28">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 mb-4 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <FaHeart className="w-4 h-4" />
              Our Principles
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Core Values That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Drive Us
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              These principles guide our decisions and define our company
              culture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div
                  className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r rounded-2xl group-hover:opacity-100 blur-xl"
                  style={{
                    background:
                      value.gradient === "from-yellow-400 to-orange-500"
                        ? "linear-gradient(135deg, #fbbf24, #f97316)"
                        : value.gradient === "from-blue-400 to-cyan-500"
                        ? "linear-gradient(135deg, #60a5fa, #06b6d4)"
                        : value.gradient === "from-green-400 to-emerald-500"
                        ? "linear-gradient(135deg, #34d399, #10b981)"
                        : "linear-gradient(135deg, #a78bfa, #ec4899)",
                  }}
                ></div>
                <div className="relative h-full p-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl hover:shadow-2xl dark:border-gray-700">
                  <div
                    className={`h-16 w-16 rounded-xl bg-gradient-to-r ${value.gradient} p-4 flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-center text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team with Slider */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-4 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
            <FaUsers className="w-4 h-4" />
            Meet The Team
          </div>
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Dream Team
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Passionate experts dedicated to delivering outstanding results
          </p>
        </motion.div>

        {/* Team Slider */}
        <div className="relative">
          {/* Custom Navigation Buttons */}
          <button
            ref={navigationPrevRef}
            className="absolute left-0 z-10 flex items-center justify-center w-12 h-12 text-gray-700 transition-all duration-300 -translate-x-4 -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-lg top-1/2 md:-translate-x-8 md:h-14 md:w-14 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:border-gray-700"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>

          <button
            ref={navigationNextRef}
            className="absolute right-0 z-10 flex items-center justify-center w-12 h-12 text-gray-700 transition-all duration-300 translate-x-4 -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-lg top-1/2 md:translate-x-8 md:h-14 md:w-14 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:border-gray-700"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>

          {/* Swiper Slider */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            centeredSlides
            loop={teamData?.data?.length > 3}
            speed={900}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }}
            className="team-slider !py-10"
          >
            {teamData?.data?.map((member) => (
              <SwiperSlide key={member.id}>
                {({ isActive }) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: isActive ? 1 : 0.5,
                      scale: isActive ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`h-full transition-all duration-300 ${
                      isActive ? "z-10" : "z-0"
                    }`}
                  >
                    <div className="flex flex-col h-full p-6 border border-gray-100 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl dark:border-gray-700">
                      {/* Avatar */}
                      <div className="relative mb-6">
                        <div className="w-32 h-32 p-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                          <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-blue-600 bg-white rounded-full dark:bg-gray-800 dark:text-blue-400">
                            {member.name?.[0]}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-grow text-center">
                        <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <p className="mb-4 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                          {member.position}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {member.bio?.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Dots */}
          <div className="swiper-pagination !relative !mt-8"></div>
        </div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {teamData?.data?.length || 0}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Team Members
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                15+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Years Combined Experience
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                50+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Technologies Mastered
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animated CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url("${whitePatternSVG}")` }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 bg-white/10 blur-3xl"></div>
        <div className="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 blur-3xl"></div>

        <div className="relative py-20 md:py-28">
          <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6 text-4xl font-bold text-white md:text-6xl"
            >
              Ready to Transform{" "}
              <span className="text-yellow-300">Your Digital Presence?</span>
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto mb-10 text-xl text-blue-100"
            >
              Let's collaborate to bring your vision to life with our expert
              team and proven methodologies.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <a
                href="/contact"
                className="relative px-8 py-4 overflow-hidden font-bold text-blue-600 transition-all duration-300 bg-white group rounded-xl hover:shadow-2xl"
              >
                <span className="relative z-10">Start a Project</span>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:opacity-100"></div>
              </a>
              <a
                href="/services"
                className="relative px-8 py-4 overflow-hidden font-bold text-white transition-all duration-300 border-2 border-white group rounded-xl hover:bg-white/10"
              >
                <span className="relative z-10">View Our Services</span>
                <div className="absolute inset-0 transition-colors duration-300 bg-white/5 group-hover:bg-white/10"></div>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mt-10 text-blue-200"
            >
              <FaRocket className="w-5 h-5 animate-bounce" />
              <span>Trusted by 50+ leading companies worldwide</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
