import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useState, useRef } from "react";
import {
  FaArrowRight,
  FaCheck,
  FaStar,
  FaClock,
  FaRocket,
  FaFire,
  FaBolt,
  FaGem,
  FaHeart,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function ServiceCard({ service, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const cardRef = useRef(null);

  // Mouse position tracking for parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    x.set((mouseX - centerX) / 25);
    y.set((mouseY - centerY) / 25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const badgeColors = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-green-500 to-emerald-400",
    "from-orange-500 to-red-400",
    "from-indigo-500 to-blue-400",
  ];

  const getBadgeColor = (index) => badgeColors[index % badgeColors.length];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        y: -12,
        transition: { duration: 0.3 },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        rotateX: springY,
        rotateY: springX,
      }}
      className="relative cursor-pointer perspective-1000"
    >
      {/* Background Glow Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl"
      />

      {/* Particle Effects */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  scale: 0,
                  opacity: 0,
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Card Container */}
      <div className="relative overflow-hidden transition-all duration-300 bg-white border shadow-xl border-gray-200/50 backdrop-blur-sm rounded-3xl hover:shadow-2xl hover:border-blue-300/50">
        {/* Floating Badges */}
        <div className="absolute z-10 flex flex-col gap-2 top-4 right-4">
          {service.is_popular && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                delay: index * 0.1 + 0.3,
              }}
              whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
              className="relative"
            >
              <div className="px-3 py-1.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                <div className="flex items-center gap-1">
                  <FaFire className="w-3 h-3" />
                  <span>Trending</span>
                </div>
              </div>
            </motion.div>
          )}

          {index === 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                delay: index * 0.1 + 0.4,
              }}
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <div className="px-3 py-1.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg">
                <div className="flex items-center gap-1">
                  <FaGem className="w-3 h-3" />
                  <span>Best Value</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-8">
          {/* Icon Section */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              delay: index * 0.1 + 0.2,
              stiffness: 200,
            }}
            whileHover={{
              scale: 1.1,
              rotate: [0, 5, -5, 0],
              transition: { duration: 0.5 },
            }}
            className="relative mb-8"
          >
            <div className="relative w-24 h-24 mx-auto">
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{
                  rotate: { duration: 2, ease: "linear", repeat: Infinity },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl"
              />

              <div className="relative flex items-center justify-center w-full h-full shadow-xl bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: isHovered ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{
                    scale: { duration: 2, repeat: Infinity },
                    rotate: { duration: 0.5 },
                  }}
                  className="p-4 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <i
                    className={`${
                      service.icon || "fas fa-code"
                    } text-3xl text-white`}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="mb-4 text-center"
          >
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {service.title}
            </h3>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
              className="h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="mb-6 text-center text-gray-600"
          >
            {service.short_description}
          </motion.p>

          {/* Features List */}
          {service.features && service.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity },
                    scale: { duration: 1, repeat: Infinity },
                  }}
                >
                  <FaBolt className="w-5 h-5 text-yellow-500" />
                </motion.div>
                <span className="font-semibold text-gray-700">
                  Key Features
                </span>
              </div>

              <AnimatePresence>
                <div className="space-y-3">
                  {(showAllFeatures
                    ? service.features
                    : service.features.slice(0, 3)
                  ).map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center p-2 transition-colors rounded-lg hover:bg-blue-50/50"
                    >
                      <motion.div
                        className="flex-shrink-0 mr-3"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaCheck className="w-4 h-4 text-green-500" />
                      </motion.div>
                      <span className="text-sm text-gray-700">
                        {feature.title}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {service.features.length > 3 && (
                <motion.button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {showAllFeatures
                    ? "Show Less"
                    : `+${service.features.length - 3} More Features`}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
            className="flex items-center justify-center p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
          >
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {service.feature_count || "15+"}
              </div>
              <div className="text-xs text-gray-600">Features</div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.7 }}
            className="flex gap-3"
          >
            <Link to={`/services/${service.slug}`} className="flex-1">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center gap-2 px-6 py-3 overflow-hidden font-medium text-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
              >
                <span>View Details</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                </motion.div>

                {/* Button Shine Effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "100%" : "-100%" }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-0 left-0 w-1/2 h-full skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </Link>

            <Link to="/contact">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 shadow-sm cursor-pointer rounded-xl"
              >
                Get Quote
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom Gradient Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        />
      </div>

      {/* CSS for perspective */}
      <style jsx="true">{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </motion.div>
  );
}
