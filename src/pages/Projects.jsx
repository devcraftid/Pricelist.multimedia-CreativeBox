import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Facebook, Youtube, Instagram } from 'lucide-react';

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

  // Default images to show if database is empty to maintain the layout appearance
  const defaultProjects = Array(15).fill(null).map((_, i) => ({
    id: `default-${i}`,
    image_url: `https://picsum.photos/seed/project${i}/400/400`,
    title: `Project ${i + 1}`
  }));

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-[#1a2035] font-bold">Loading Project Updates...</div>;
  }

  return (
    <div className="w-full bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a2035]">Project Update !</h1>
        </div>

        {/* Grid Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 mb-16">
          {displayProjects.map((item) => (
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
              <Facebook size={24} fill="currentColor" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-[#c4302b] hover:bg-[#9e2723] text-white transition-colors shadow-md"
            >
              <Youtube size={24} />
            </a>
            <a 
              href={settings?.instagram_url || '#'} 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white transition-opacity shadow-md"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Projects;
