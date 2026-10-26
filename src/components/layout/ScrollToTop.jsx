import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Memastikan setiap kali route berpindah (terutama saat klik menu di Footer),
 * posisi layar langsung di-reset ke paling atas (top: 0),
 * sehingga transisi halaman baru yang masuk dari atas dapat terlihat sempurna dan elegan.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}
