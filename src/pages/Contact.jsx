import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { contactAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

// Animation components
import { motion } from "framer-motion";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().matches(/^[+]?[\d\s-]+$/, "Invalid phone number"),
    subject: yup.string().required("Subject is required"),
    message: yup
      .string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters"),
  })
  .required();

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await contactAPI.submit(data);
      toast.success("Message sent successfully! We will contact you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: "Phone",
      details: ["+880 1886-928948", "+880 1719-928948"],
      action: "tel:+8801886928948",
      bgColor: "bg-blue-500",
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      details: ["+880 1719-928948"],
      action: "https://wa.me/+8801719928948",
      bgColor: "bg-green-500",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["aminwebtech@gmail.com"],
      action: "mailto:aminwebtech@gmail.com",
      bgColor: "bg-red-500",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      details: ["Dhaka, Bangladesh"],
      action: "https://maps.google.com",
      bgColor: "bg-purple-500",
    },
    {
      icon: MdAccessTime,
      title: "Working Hours",
      details: ["Sun-Thu: 9:00 AM - 6:00 PM"],
      action: null,
      bgColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Animated Background Elements */}
      {showAnimation && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute bg-blue-300 rounded-full top-20 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bg-purple-300 rounded-full top-40 left-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute bg-pink-300 rounded-full -bottom-8 left-40 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          />
        </>
      )}

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 py-16 text-center"
        >
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            Let's Start <span className="text-blue-600">Something Great</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Ready to bring your ideas to life? Get in touch with our team of
            experts.
          </p>
        </motion.div>

        <div className="px-4 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column - Contact Info with Animation */}
            <div className="space-y-8">
              {/* Animated Contact Cards */}
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.action || "#"}
                    target={info.action ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${
                      info.action ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-14 w-14 ${info.bgColor} rounded-xl flex items-center justify-center mr-5`}
                      >
                        <Icon className="text-white h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-gray-900">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                      {info.action && (
                        <FaArrowRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </motion.a>
                );
              })}

              {/* Animated Support Character */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl"
              >
                <div className="relative z-10">
                  <h3 className="mb-3 text-2xl font-bold">
                    Need Immediate Help?
                  </h3>
                  <p className="mb-6 opacity-90">
                    Our team is ready to assist you 24/7
                  </p>
                  <a
                    href="tel:+8801886928948"
                    className="inline-flex items-center px-6 py-3 font-semibold text-blue-600 transition-all duration-300 transform bg-white rounded-lg hover:bg-blue-50 hover:scale-105"
                  >
                    <FaPhone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </div>
                {/* Floating Character */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute bottom-0 right-6"
                >
                  <div className="relative">
                    {/* Simple cartoon character - Support Robot */}
                    <div className="flex items-center justify-center w-32 h-32 rounded-full bg-white/20">
                      <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-300 rounded-full">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-white rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-8 bg-white shadow-2xl rounded-3xl lg:p-12"
              >
                <div className="mb-10 text-center">
                  <h2 className="mb-3 text-3xl font-bold text-gray-900">
                    Send us a message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you ASAP
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.name
                            ? "border-red-500"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                        placeholder="Enter your name"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.email
                            ? "border-red-500"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9+\s]*$/,
                            message: "Only numbers are allowed",
                          },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9+\s]/g,
                            ""
                          );
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.phone
                            ? "border-red-500"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                        placeholder="+880 1234 567890"
                      />

                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Subject *
                      </label>
                      <input
                        type="text"
                        {...register("subject")}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.subject
                            ? "border-red-500"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                        placeholder="How can we help you?"
                      />
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.subject.message}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Your Message *
                    </label>
                    <textarea
                      {...register("message")}
                      rows="5"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.message
                          ? "border-red-500"
                          : "border-gray-200 hover:border-blue-400"
                      }`}
                      placeholder="Tell us about your project or inquiry..."
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.message.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center w-full px-6 py-4 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl hover:shadow-xl disabled:opacity-50 group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 mr-3 border-b-2 border-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Animated Success Character - Shows on form focus */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-4 right-4"
                >
                  {/* Another cartoon character - Happy Bot */}
                  <div className="w-20 h-20">
                    <div className="relative">
                      <div className="w-16 h-16 bg-blue-100 rounded-full"></div>
                      <div className="absolute w-8 h-8 bg-white rounded-full top-4 left-4">
                        <div className="w-4 h-4 mx-auto mt-2 bg-blue-400 rounded-full"></div>
                      </div>
                      {/* Smile */}
                      <div className="absolute w-4 h-2 bg-blue-300 rounded-full bottom-6 left-6"></div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Animated Map Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-12 overflow-hidden bg-white shadow-2xl rounded-3xl"
              >
                <div className="p-6 text-white bg-gradient-to-r from-gray-900 to-gray-800">
                  <h3 className="flex items-center text-2xl font-bold">
                    <FaMapMarkerAlt className="w-6 h-6 mr-3" />
                    Our Location
                  </h3>
                  <p className="mt-2 text-gray-300">Dhaka, Bangladesh</p>
                </div>
                <div className="relative h-64 overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500">
                  {/* Animated map markers */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/3"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-full shadow-lg">
                      <FaMapMarkerAlt className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-8 text-center text-white bg-black/20 rounded-2xl backdrop-blur-sm">
                      <p className="text-lg font-semibold">
                        We're located in the heart of Dhaka
                      </p>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-blue-600 transition-all duration-300 bg-white rounded-lg hover:bg-blue-50"
                      >
                        View on Map
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
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
    </div>
  );
}
