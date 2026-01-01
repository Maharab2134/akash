import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

export default function WhatsAppFloat({ offset = 0 }) {
  const GAP = 72; // distance between buttons

  return (
    <>
      {/* ================= Messenger ================= */}
      <motion.a
        href="https://www.facebook.com/messages/t/102856358303333"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-40 group"
        style={{
          right: "2rem",
          bottom: `calc(2rem + ${offset + GAP}px)`,
        }}
        aria-label="Chat on Messenger"
      >
        {/* Tooltip */}
        <span className="absolute px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-300 translate-x-2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 pointer-events-none right-16 top-1/2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
          Chat on Messenger
          <span className="absolute w-0 h-0 -translate-y-1/2 border-t-8 border-b-8 border-l-8 top-1/2 -right-2 border-t-transparent border-b-transparent border-l-white" />
        </span>

        {/* Soft Pulse (subtle, premium) */}
        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></span>

        {/* Button */}
        <div className="relative flex items-center justify-center w-12 h-12 text-white rounded-full shadow-xl md:w-14 md:h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 hover:brightness-110">
          <FaFacebookMessenger className="w-6 h-6 md:w-7 md:h-7" />
        </div>
      </motion.a>

      {/* ================= WhatsApp ================= */}
      <motion.a
        href="https://wa.me/+8801719928948"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.12 }}
        className="fixed z-40 group"
        style={{
          right: "2rem",
          bottom: `calc(2rem + ${offset}px)`,
        }}
        aria-label="Chat on WhatsApp"
      >
        {/* Tooltip */}
        <span className="absolute px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-300 translate-x-2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 pointer-events-none right-16 top-1/2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
          Chat on WhatsApp
          <span className="absolute w-0 h-0 -translate-y-1/2 border-t-8 border-b-8 border-l-8 top-1/2 -right-2 border-t-transparent border-b-transparent border-l-white" />
        </span>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping"></span>

        {/* Button */}
        <div className="relative flex items-center justify-center w-12 h-12 text-white bg-green-500 rounded-full shadow-xl md:w-14 md:h-14 hover:bg-green-600">
          <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" />
        </div>
      </motion.a>
    </>
  );
}
