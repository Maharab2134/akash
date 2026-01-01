import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { servicesAPI } from "../../services/api";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const fallbackServices = [
  { name: "Web Development", slug: "web-development" },
  { name: "Mobile App Development", slug: "mobile-app-development" },
  { name: "E-Commerce Solutions", slug: "ecommerce-solutions" },
  { name: "UI/UX Design", slug: "ui-ux-design" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "VR/AR Development", slug: "vr-ar" },
];

export default function Footer() {
  const { data: servicesData, isError: servicesError } = useQuery({
    queryKey: ["footer-services"],
    queryFn: () => servicesAPI.getAll(),
  });

  const currentYear = new Date().getFullYear();

  // Use API data or fallback to demo data
  const services = Array.isArray(servicesData?.data)
    ? servicesData.data.slice(0, 6)
    : Array.isArray(servicesData)
    ? servicesData.slice(0, 6)
    : fallbackServices;

  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Our Projects", link: "/projects" },
    { name: "Blog", link: "/blog" },
    { name: "Contact", link: "/contact" },
    { name: "Privacy Policy", link: "/privacy" },
    { name: "Terms of Service", link: "/terms" },
  ];

  const socialLinks = [
    {
      icon: FaFacebook,
      link: "https://facebook.com/aminwebtech",
      label: "Facebook",
    },
    {
      icon: FaTwitter,
      link: "https://twitter.com/aminwebtech",
      label: "Twitter",
    },
    {
      icon: FaLinkedin,
      link: "https://linkedin.com/company/aminwebtech",
      label: "LinkedIn",
    },
    { icon: FaGithub, link: "https://github.com/aminwebtech", label: "GitHub" },
    {
      icon: FaInstagram,
      link: "https://instagram.com/aminwebtech",
      label: "Instagram",
    },
    {
      icon: FaYoutube,
      link: "https://youtube.com/aminwebtech",
      label: "YouTube",
    },
  ];

  return (
    <footer className="text-white bg-gray-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="ml-2 text-2xl font-bold">
                AminWeb<span className="text-blue-400">Tech</span>
              </span>
            </div>
            <p className="mb-6 text-gray-400">
              AminWebTech is a software company based in Dhaka that provides
              comprehensive digital solutions. Their primary focus is on
              delivering solutions for Web, App, Software, Digital Marketing,
              and Graphics Design.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug || service.name}>
                  <Link
                    to={`/services/${
                      service.slug ||
                      service.name.toLowerCase().replace(/\s+/g, "-")
                    }`}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {service.name || service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="w-5 h-5 mt-1 mr-3 text-blue-400" />
                <div>
                  <p className="text-gray-400">
                    House- 03 (3rd Floor), Road- 02, Block- C, Section- 6
                  </p>
                  <p className="text-gray-400">Dhaka 1207, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-5 h-5 mr-3 text-blue-400" />
                <a
                  href="tel:+8801234567890"
                  className="text-gray-400 hover:text-white"
                >
                  +880 1886-928948
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="w-5 h-5 mr-3 text-blue-400" />
                <a
                  href="mailto:aminwebtech@gmail.com"
                  className="text-gray-400 hover:text-white"
                >
                  aminwebtech@gmail.com
                </a>
              </div>
            </div>

            {/* Newsletter
            <div className="mt-8">
              <h4 className="mb-3 text-sm font-semibold">NEWSLETTER</h4>
              <p className="mb-3 text-sm text-gray-400">
                Subscribe to get updates about our latest offerings
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 text-gray-900 rounded-l-lg focus:outline-none"
                />
                <button className="px-4 py-2 font-medium bg-blue-600 rounded-r-lg hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} AminWebTech. All rights reserved.
            </p>
            <div className="flex mt-4 space-x-6 md:mt-0">
              <Link
                to="/privacy"
                className="text-sm text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-400 hover:text-white"
              >
                Terms of Service
              </Link>
              {/* <Link
                to="/sitemap"
                className="text-sm text-gray-400 hover:text-white"
              >
                Sitemap
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
