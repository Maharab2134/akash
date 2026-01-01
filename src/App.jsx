import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPerformance } from "./utils/trackPerformance";
import AnalyticsTracker from "./components/common/AnalyticsTracker";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home";
import Services from "../src/pages/Services.jsx";
import ServiceDetail from "../src/pages/ServiceDetail";
import Projects from "../src/pages/Projects.jsx";
import ProjectDetail from "../src/pages/ProjectDetail";
import Blog from "../src/pages/Blog";
import BlogPost from "../src/pages/BlogPost";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminLogin from "../src/pages/admin/Login";
import AdminDashboard from "../src/pages/admin/Dashboard";
import AdminServices from "../src/pages/admin/Services";
import AdminProjects from "../src/pages/admin/Projects";
import AdminAnalytics from "../src/pages/admin/Analytics";
import AllVisitors from "../src/pages/admin/AllVisitors.jsx";
import VisitorDetailsPage from "../src/pages/admin/VisitorDetailsPage.jsx";
import AdminBlog from "../src/pages/admin/Blog";
import AdminTeam from "../src/pages/admin/Team";
import AdminTestimonials from "../src/pages/admin/Testimonials";
import AdminContacts from "../src/pages/admin/Contacts";
import AdminMedia from "../src/pages/admin/Media";
import AdminSettings from "../src/pages/admin/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "../src/pages/NotFound";
import ScrollToTop from "./components/common/ScrollToTop.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ScrollToTop />
          <AnalyticsTracker />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="/admin/visitors" element={<AllVisitors />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route
                path="analytics/visitor/:session_id"
                element={<VisitorDetailsPage />}
              />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
