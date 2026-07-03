import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Play } from 'lucide-react';

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
    return <div className="min-h-screen flex items-center justify-center bg-white text-[#273554] font-bold">Loading Project Updates...</div>;
  }

  return (
    <div className="w-full bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#273554]">Project Update !</h1>
        </div>

        {/* Grid Gallery */}
        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 border border-dashed rounded-lg mb-16">
            Belum ada project yang ditambahkan oleh Admin.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 mb-16">
            {projects.map((item) => (
              <div key={item.id} className="relative aspect-square overflow-hidden group cursor-pointer bg-slate-100">
                <img 
                  src={item.image_url || 'https://placehold.co/400x400?text=No+Image'} 
                  alt={item.title || 'Project'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Play Icon (Top Right) */}
                <div className="absolute top-2 right-2 text-white/90 drop-shadow-md">
                  <Play fill="currentColor" size={24} />
                </div>

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

        {/* Social Media Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 font-medium mb-6">
            Temukan project selengkapnya di media sosial kami
          </p>
          <div className="flex gap-4">
            <a 
              href={settings?.facebook_url || '#'} 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-[#3b5998] hover:bg-[#2d4373] text-white transition-colors shadow-md"
            >
              <FacebookIcon size={24} />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-[#c4302b] hover:bg-[#9e2723] text-white transition-colors shadow-md"
            >
              <YoutubeIcon size={24} />
            </a>
            <a 
              href={settings?.instagram_url || '#'} 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white transition-opacity shadow-md"
            >
              <InstagramIcon size={24} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Projects;
