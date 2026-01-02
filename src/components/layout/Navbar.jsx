import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { servicesAPI } from "../../services/api";
import logo from "../../assets/logo.png";

import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const location = useLocation();

  /* ===================== FETCH SERVICES FOR SUBMENU ===================== */
  const { data: servicesData } = useQuery({
    queryKey: ["navbar-services"],
    queryFn: () => servicesAPI.getAll({ status: "active" }),
  });

  const services = Array.isArray(servicesData?.data)
    ? servicesData.data
    : Array.isArray(servicesData)
    ? servicesData
    : [];

  /* ===================== MAIN NAVIGATION ===================== */
  const navigation = [
    { name: "Home", to: "/" },
    { name: "Services", to: "/services", hasDropdown: true },
    { name: "Projects", to: "/projects" },
    { name: "Blog", to: "/blog" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  /* ===================== SCROLL HIDE / SHOW ===================== */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ===================== CLOSE MOBILE ON ROUTE CHANGE ===================== */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  /* ===================== BODY SCROLL LOCK ===================== */
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [isMenuOpen]);

  /* ===================== HANDLE ESC KEY ===================== */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  return (
    <>
      {/* ===================== NAVBAR ===================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "shadow-xl border-b border-white/10 py-2 md:py-1"
            : "py-3 md:py-2"
        }`}
        style={{
          backgroundColor: scrolled
            ? "rgb(15, 23, 42)" // deep slate blue
            : "rgb(17, 24, 39)", // slightly lighter (top state)
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* ===================== LOGO ===================== */}
            <Link
              to="/"
              className="flex items-center gap-3 transition-transform active:scale-95"
            >
              <img
                src={logo}
                alt="AminWebTech"
                className="object-cover w-10 h-10 rounded-xl md:w-11 md:h-11 ring-2 ring-white"
              />
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-white md:text-xl">
                  AminWebTech
                </h1>
                <p className="text-xs text-gray-300">Digital Excellence</p>
              </div>
            </Link>

            {/* ===================== DESKTOP MENU ===================== */}
            <div className="items-center hidden gap-1 md:flex">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200
  ${
    isActive
      ? "text-cyan-400 bg-white/10"
      : "text-gray-200 hover:text-white hover:bg-white/10"
  }`
                    }
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 md:hidden" />
                    )}
                  </NavLink>

                  {/* ===================== SERVICES DROPDOWN ===================== */}
                  {item.hasDropdown && services.length > 0 && (
                    <div className="absolute left-0 invisible pt-2 transition-all duration-300 opacity-0 group-hover:visible group-hover:opacity-100">
                      <div className="w-56 p-2 bg-white border shadow-xl rounded-xl">
                        <h3 className="px-3 py-2 mb-1 text-xs font-semibold text-gray-500 uppercase">
                          Our Services
                        </h3>
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            to={`/services/${service.slug}`}
                            className="block px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* ===================== ADMIN BUTTON ===================== */}
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/admin"
                  className="px-6 py-2.5 font-semibold text-white rounded-lg transition-all duration-200
             bg-cyan-600 hover:bg-cyan-500 shadow-md active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Admin</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* ===================== MOBILE BUTTONS ===================== */}
            <div className="flex items-center gap-3 md:hidden">
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 transition-all duration-200 bg-gray-100 rounded-lg active:scale-95"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================== MOBILE MENU ===================== */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          isMenuOpen
            ? "bg-black/40 backdrop-blur-sm"
            : "bg-transparent pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="AminWebTech"
                className="object-cover w-12 h-12 rounded-xl"
              />
              <div>
                <h1 className="font-bold text-gray-900">AminWebTech</h1>
                <p className="text-sm text-gray-600">Digital Excellence</p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="h-[calc(100vh-120px)] overflow-y-auto">
            <div className="p-4 space-y-1">
              {navigation.map((item) => {
                // ================= SERVICES (WITH DROPDOWN) =================
                if (item.hasDropdown) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() =>
                          setMobileServicesOpen(!mobileServicesOpen)
                        }
                        className="flex items-center justify-between w-full px-4 py-3.5
          rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <span>{item.name}</span>
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform ${
                            mobileServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Services list — SERVICES এর ঠিক নিচে */}
                      {mobileServicesOpen && services.length > 0 && (
                        <div className="pl-6 mt-2 space-y-2">
                          {services.map((service) => (
                            <Link
                              key={service.id}
                              to={`/services/${service.slug}`}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setMobileServicesOpen(false);
                              }}
                              className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                            >
                              <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                              {service.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // ================= NORMAL MENU ITEMS =================
                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3.5 rounded-lg font-medium transition-all
        ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }`
                    }
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
              <div className="flex flex-col items-center">
                <p className="mb-2 text-sm text-gray-600">
                  Need professional help?
                </p>
                <a
                  href="tel:+8801234567890"
                  className="text-lg font-bold text-gray-900"
                >
                  +880 1234 567890
                </a>
                <p className="mt-1 text-sm text-gray-500">Call us anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-14 md:h-16" />
    </>
  );
}
