import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "swiper/css";

/* ---------------- Magnetic Hook ---------------- */
function useMagnetic(strength = 25) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x / strength}px, ${
      y / strength
    }px)`;
  };

  const onMouseLeave = () => {
    ref.current.style.transform = `translate(0px, 0px)`;
  };

  return { ref, onMouseMove, onMouseLeave };
}

/* ---------------- Component ---------------- */
export default function IndustrialMediaSlider({ images = [] }) {
  const [activeImage, setActiveImage] = useState(null);

  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <section className="mt-28">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center mb-4">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="inline-flex mr-3"
            >
              <SparklesIcon className="text-blue-500 w-7 h-7" />
            </motion.span>

            <h3 className="text-3xl font-bold text-gray-900">
              Featured{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Gallery
              </span>
            </h3>
          </div>

          <p className="max-w-2xl mx-auto text-gray-600">
            A glimpse of our professional and industrial-grade digital work
          </p>
        </div>

        {/* ================= SLIDER ================= */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={36}
          slidesPerView={1}
          loop
          speed={900}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {images.map((img, index) => {
            const magnetic = useMagnetic(20);

            return (
              <SwiperSlide key={index}>
                <motion.div
                  ref={magnetic.ref}
                  onMouseMove={magnetic.onMouseMove}
                  onMouseLeave={magnetic.onMouseLeave}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  onClick={() => setActiveImage(img.url)}
                  className="relative overflow-hidden bg-gray-100 shadow-xl cursor-pointer rounded-3xl group"
                >
                  {/* IMAGE (NO CROP in modal, clean crop here) */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <img
                      src={img.url}
                      alt="Portfolio"
                      className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ================= FULLSCREEN MODAL ================= */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90"
            onClick={() => setActiveImage(null)}
          >
            <motion.img
              src={activeImage}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Close Button */}
            <button
              className="absolute p-3 bg-white rounded-full top-6 right-6"
              onClick={() => setActiveImage(null)}
            >
              <XMarkIcon className="w-6 h-6 text-gray-800" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
