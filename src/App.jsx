import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import MainLayout from './components/layout/MainLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import PublicPriceList from './pages/PublicPriceList';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';

import AdminSettings from './pages/admin/AdminSettings';
import AdminAbout from './pages/admin/AdminAbout';
import AdminAdvantages from './pages/admin/AdminAdvantages';
import AdminServices from './pages/admin/AdminServices';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPriceList from './pages/admin/AdminPriceList';
import AdminEquipments from './pages/admin/AdminEquipments';
import AdminClients from './pages/admin/AdminClients';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminInbox from './pages/admin/AdminInbox';

function App() {
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('primary_color, secondary_color, bg_color, text_color').limit(1).single();
        if (data) {
          const isValidHex = (hex) => typeof hex === 'string' && /^#[0-9A-Fa-f]{6}$/.test(hex);
          const getLuminance = (hex) => {
            if (!isValidHex(hex)) return 0.5;
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };

          // Primary accent color (default vibrant amber #f5a623)
          const primary = isValidHex(data.primary_color) ? data.primary_color : '#f5a623';
          document.documentElement.style.setProperty('--color-primary', primary);

          // Secondary dark color (must have low luminance < 0.3 for deep contrast, default #1b253b)
          const secondary = isValidHex(data.secondary_color) && getLuminance(data.secondary_color) < 0.3
            ? data.secondary_color
            : '#1b253b';
          document.documentElement.style.setProperty('--color-secondary', secondary);

          // Background color: UI layout requires a clean light background (luminance > 0.65).
          // If a dark background like #2e3138 was mistakenly set, fallback to crisp slate #f8fafc.
          const bg = isValidHex(data.bg_color) && getLuminance(data.bg_color) > 0.65
            ? data.bg_color
            : '#f8fafc';
          document.documentElement.style.setProperty('--color-background', bg);

          // Foreground text color: Must be dark (luminance < 0.25) to be readable on light background (default #0f172a)
          const text = isValidHex(data.text_color) && getLuminance(data.text_color) < 0.25
            ? data.text_color
            : '#0f172a';
          document.documentElement.style.setProperty('--color-foreground', text);
        }
      } catch (err) {
        console.error('Error applying theme settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="price-list" element={<PublicPriceList />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="advantages" element={<AdminAdvantages />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="pricelist" element={<AdminPriceList />} />
          <Route path="equipments" element={<AdminEquipments />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="inbox" element={<AdminInbox />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
