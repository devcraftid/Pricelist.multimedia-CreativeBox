import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// HD Studio Transition: Halaman selalu masuk dengan mulus dari ATAS (y: -40 -> 0)
const pageVariants = {
  initial: {
    opacity: 0,
    y: -40,
    scale: 0.992,
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.48,
      ease: [0.16, 1, 0.3, 1], // Smooth Apple-style cubic curve
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.992,
    filter: 'blur(4px)',
    transition: {
      duration: 0.22,
      ease: 'easeIn',
    },
  },
};

const MainLayout = () => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary relative overflow-x-hidden w-full max-w-full">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-grow will-change-transform w-full max-w-full overflow-x-hidden"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />

      {/* Floating HD Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3 sm:p-3.5 rounded-full bg-secondary/90 hover:bg-primary text-white hover:text-slate-950 shadow-2xl shadow-black/40 border border-white/10 backdrop-blur-md transition-colors flex items-center justify-center group min-h-[44px] min-w-[44px] touch-manipulation"
          >
            <ArrowUp size={20} className="transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
