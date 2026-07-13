import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FacebookIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const InstagramIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: projectsData },
        { data: settingsData }
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*').limit(1)
      ]);

      if (projectsData) setProjects(projectsData);
      if (settingsData && settingsData.length > 0) setSettings(settingsData[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-secondary font-bold">Loading Project Updates...</div>;
  }

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    
    // Instagram
    if (url.includes('instagram.com')) {
      let cleanUrl = url.split('?')[0];
      if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      if (!cleanUrl.endsWith('/embed')) {
        return `${cleanUrl}/embed`;
      }
      return cleanUrl;
    }

    // Default
    return url;
  };

  const getThumbnailUrl = (item) => {
    if (item.image_url) return item.image_url;
    
    if (item.video_url) {
      if (item.video_url.includes('youtube.com/watch?v=')) {
        const videoId = item.video_url.split('v=')[1].split('&')[0];
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      if (item.video_url.includes('youtu.be/')) {
        const videoId = item.video_url.split('youtu.be/')[1].split('?')[0];
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      if (item.video_url.includes('instagram.com')) {
        return 'https://placehold.co/400x400/e1306c/ffffff?text=Instagram+Video';
      }
      return 'https://placehold.co/400x400/1e293b/ffffff?text=Video';
    }
    
    return 'https://placehold.co/400x400?text=No+Image';
  };

  return (
    <div className="w-full bg-white pt-32 md:pt-40 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-secondary">Project Update !</h1>
        </div>

        {/* Grid Gallery */}
        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 border border-dashed rounded-lg mb-16">
            Belum ada project yang ditambahkan oleh Admin.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 mb-16">
            {projects.map((item) => (
              <div key={item.id} onClick={() => setSelectedProject(item)} className="relative aspect-square overflow-hidden group cursor-pointer bg-slate-100">
                <img 
                  src={getThumbnailUrl(item)} 
                  alt={item.title || 'Project'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Play Icon (Top Right) */}
                {item.video_url && (
                  <div className="absolute top-2 right-2 text-white/90 drop-shadow-md">
                    <Play fill="currentColor" size={24} />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                  <h3 className="text-white font-bold text-sm md:text-base line-clamp-3">
                    {item.title || 'Project Update'}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Lightbox */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedProject(null)}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-black/50 p-2 rounded-full"
                onClick={() => setSelectedProject(null)}
              >
                <X size={32} />
              </button>
              
              <div
                className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedProject.video_url ? (
                  <div className="w-full aspect-video rounded-lg shadow-2xl overflow-hidden bg-black flex items-center justify-center">
                    <iframe
                      src={getEmbedUrl(selectedProject.video_url)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    src={selectedProject.image_url || 'https://placehold.co/800x600?text=No+Image'}
                    alt={selectedProject.title}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
                    onClick={() => setSelectedProject(null)}
                  />
                )}
                
                <div className="mt-6 text-center">
                  <h3 className="text-white text-2xl font-bold">{selectedProject.title}</h3>
                  {selectedProject.client_name && (
                    <p className="text-primary font-medium mt-1">Client: {selectedProject.client_name}</p>
                  )}
                  {selectedProject.description && (
                    <p className="text-gray-300 mt-3 max-w-2xl mx-auto">{selectedProject.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Projects;
