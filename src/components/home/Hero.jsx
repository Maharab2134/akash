import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaPlay, FaTimes } from "react-icons/fa";

const heroSlides = [
  {
    badge: "Digital Solutions",
    title: "Digital Transformation Partner",
    subtitle:
      "We help businesses grow faster with scalable software, modern apps, and powerful digital experiences.",
    cta: "Start Your Journey",
    background: "from-blue-600 to-indigo-700",
  },
  {
    badge: "Custom Software",
    title: "Innovative Software Solutions",
    subtitle:
      "Enterprise-grade web and mobile applications tailored to your business goals.",
    cta: "Explore Our Work",
    background: "from-purple-600 to-pink-700",
  },
  {
    badge: "Trusted Partner",
    title: "Your Vision, Our Expertise",
    subtitle:
      "From idea to launch — we design, build, and scale high-performance digital products.",
    cta: "Get a Quote",
    background: "from-emerald-600 to-teal-700",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openVideo, setOpenVideo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* HERO */}
      <div className="relative h-[620px] md:h-[720px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].background}`}
          >
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative flex items-center h-full">
              <div className="px-6 mx-auto max-w-7xl">
                <div className="max-w-2xl text-white">
                  {/* Badge */}
                  <span className="inline-block px-4 py-1 mb-6 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/10">
                    {heroSlides[currentSlide].badge}
                  </span>

                  {/* Title */}
                  <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
                    {heroSlides[currentSlide].title}
                  </h1>

                  {/* Subtitle */}
                  <p className="mb-10 text-lg leading-relaxed text-white/90">
                    {heroSlides[currentSlide].subtitle}
                  </p>

                  {/* CTA */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center px-8 py-4 font-semibold text-blue-700 bg-white rounded-lg hover:bg-blue-50"
                    >
                      {heroSlides[currentSlide].cta}
                      <FaArrowRight className="ml-3" />
                    </Link>

                    <button
                      onClick={() => setOpenVideo(true)}
                      className="inline-flex items-center px-8 py-4 font-semibold text-white border rounded-lg border-white/40 hover:bg-white/10"
                    >
                      <FaPlay className="mr-3" />
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute flex gap-3 -translate-x-1/2 bottom-8 left-1/2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {openVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setOpenVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden bg-black rounded-xl"
            >
              <button
                onClick={() => setOpenVideo(false)}
                className="absolute z-10 p-2 text-white top-3 right-3"
              >
                <FaTimes />
              </button>

              {/* Replace video src */}
              <iframe
                className="w-full h-[400px]"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Demo Video"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
