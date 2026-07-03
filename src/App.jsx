import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import PublicPriceList from './pages/PublicPriceList';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';

import AdminSettings from './pages/admin/AdminSettings';
import AdminServices from './pages/admin/AdminServices';
import AdminProjects from './pages/admin/AdminProjects';
import AdminEquipments from './pages/admin/AdminEquipments';
import AdminClients from './pages/admin/AdminClients';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminInbox from './pages/admin/AdminInbox';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="price-list" element={<PublicPriceList />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="projects" element={<AdminProjects />} />
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
