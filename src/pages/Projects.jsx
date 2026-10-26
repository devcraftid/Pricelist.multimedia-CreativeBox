import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Play, X, ChevronLeft, ChevronRight, ExternalLink, Calendar, Film, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Video parsing & formatting helper
  const getVideoDetails = (url) => {
    if (!url) return null;
    const trimmed = url.trim();

    // 1. YouTube (standard watch, shorts, youtu.be, embed)
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const isShort = trimmed.includes('/shorts/');
      return {
        type: 'youtube',
        id: ytMatch[1],
        isVertical: isShort,
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
        thumbnail: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
        label: isShort ? 'YouTube Shorts' : 'YouTube Video'
      };
    }

    // 2. Instagram (Reels, Posts, TV)
    const igMatch = trimmed.match(/instagram\.com\/(reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
    if (igMatch && igMatch[2]) {
      const postType = igMatch[1];
      const postId = igMatch[2];
      const isVertical = postType === 'reel';
      return {
        type: 'instagram',
        id: postId,
        isVertical: isVertical,
        embedUrl: `https://www.instagram.com/${postType}/${postId}/embed/captioned/`,
        thumbnail: null,
        label: postType === 'reel' ? 'Instagram Reel' : 'Instagram Video'
      };
    }

    // 3. Direct Video Files (MP4, WebM, OGG, MOV)
    if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
      return {
        type: 'direct',
        url: trimmed,
        isVertical: false,
        embedUrl: null,
        thumbnail: null,
        label: 'Video Player'
      };
    }

    // 4. Vimeo
    const vimeoMatch = trimmed.match(/vimeo\.com\/([0-9]+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: 'vimeo',
        id: vimeoMatch[1],
        isVertical: false,
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        thumbnail: null,
        label: 'Vimeo Video'
      };
    }

    // 5. Google Drive video preview
    const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    if (driveMatch && driveMatch[1]) {
      return {
        type: 'drive',
        id: driveMatch[1],
        isVertical: false,
        embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
        thumbnail: null,
        label: 'Google Drive Video'
      };
    }

    // Generic iframe fallback
    return {
      type: 'generic',
      embedUrl: trimmed,
      isVertical: false,
      thumbnail: null,
      label: 'Video Player'
    };
  };

  const getThumbnailUrl = (item) => {
    if (item.image_url) return item.image_url;
    if (item.video_url) {
      const video = getVideoDetails(item.video_url);
      if (video?.thumbnail) return video.thumbnail;
      if (video?.type === 'instagram') {
        return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80';
      }
      return 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80';
    }
    return 'https://placehold.co/600x600/f8fafc/64748b?text=Creative+Box';
  };

  // Next / Previous Navigation
  const currentIndex = selectedProject 
    ? projects.findIndex(p => p.id === selectedProject.id) 
    : -1;

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    if (projects.length === 0) return;
    if (currentIndex > 0) {
      setSelectedProject(projects[currentIndex - 1]);
    } else {
      setSelectedProject(projects[projects.length - 1]);
    }
  }, [currentIndex, projects]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    if (projects.length === 0) return;
    if (currentIndex < projects.length - 1) {
      setSelectedProject(projects[currentIndex + 1]);
    } else {
      setSelectedProject(projects[0]);
    }
  }, [currentIndex, projects]);

  // Keyboard navigation (ESC, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, handlePrev, handleNext]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 font-bold">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin mr-3" />
        Memuat Galeri Project...
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden bg-slate-50 pt-24 sm:pt-32 md:pt-40 pb-20 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles size={14} className="text-amber-600" />
            <span>Portofolio & Dokumentasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Project Update !
          </h1>
          <p className="text-slate-500 text-xs sm:text-base mt-2 max-w-2xl">
            Kumpulan hasil karya, liputan event, dan dokumentasi multimedia terbaru. Klik gambar atau video untuk memutar langsung di website.
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mt-4 mx-auto sm:mx-0" />
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white border border-dashed border-slate-300 rounded-3xl mb-12 shadow-xs">
            <Film size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-700">Belum ada project yang ditambahkan oleh Admin.</p>
            <p className="text-xs text-slate-400 mt-1">Silakan tambahkan data melalui panel admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 mb-16">
            {projects.map((item, idx) => {
              const video = getVideoDetails(item.video_url);
              return (
                <motion.div 
                  key={item.id || idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                  onClick={() => setSelectedProject(item)} 
                  className="group relative aspect-square sm:aspect-[4/5] overflow-hidden rounded-2xl bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200/80 hover:border-amber-400 active:scale-[0.98]"
                >
                  {/* Thumbnail Image */}
                  <img 
                    loading="lazy"
                    src={getThumbnailUrl(item)} 
                    alt={item.title || 'Project'} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108" 
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 sm:opacity-40 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Type Badge (Top Right) */}
                  {item.video_url ? (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <div className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-white/20 shadow-sm">
                        <Play fill="currentColor" size={10} className="text-amber-400" />
                        <span>{video?.isVertical ? 'Reel' : 'Video'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/60 backdrop-blur-md text-white p-1 rounded-lg text-[10px] border border-white/20 shadow-sm">
                        <ImageIcon size={12} className="text-slate-300" />
                      </div>
                    </div>
                  )}

                  {/* Center Play Button for Videos (Appears on Hover / Subtle on Mobile) */}
                  {item.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-115 pl-0.5">
                        <Play fill="currentColor" size={20} className="text-slate-950" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Text Content */}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    {item.client_name && (
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300 line-clamp-1 block drop-shadow-xs">
                        {item.client_name}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-xs sm:text-sm md:text-base line-clamp-2 leading-tight drop-shadow-sm">
                      {item.title || 'Project Update'}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Modal Lightbox (Instagram / Reels Style In-App Player) */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
              onClick={() => setSelectedProject(null)}
            >
              {/* Top Action Bar */}
              <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-50 flex items-center gap-2">
                <button
                  aria-label="Tutup Project"
                  className="text-white hover:text-amber-400 bg-white/15 hover:bg-white/25 p-2.5 rounded-full backdrop-blur-md transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xl active:scale-95 border border-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(null);
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Prev Button (Floating Left) */}
              {projects.length > 1 && (
                <button
                  aria-label="Project Sebelumnya"
                  className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 text-white/90 hover:text-white bg-white/10 hover:bg-white/25 p-3 rounded-full backdrop-blur-md transition-all min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center shadow-2xl active:scale-95 border border-white/10"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={26} />
                </button>
              )}

              {/* Next Button (Floating Right) */}
              {projects.length > 1 && (
                <button
                  aria-label="Project Selanjutnya"
                  className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 text-white/90 hover:text-white bg-white/10 hover:bg-white/25 p-3 rounded-full backdrop-blur-md transition-all min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center shadow-2xl active:scale-95 border border-white/10"
                  onClick={handleNext}
                >
                  <ChevronRight size={26} />
                </button>
              )}
              
              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col items-center justify-center my-auto w-full max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 border border-white/15 shadow-2xl ${
                  selectedProject.video_url
                    ? (getVideoDetails(selectedProject.video_url)?.isVertical 
                        ? "max-w-[420px]" 
                        : "max-w-4xl")
                    : "max-w-4xl"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Media Container */}
                <div className="relative w-full flex items-center justify-center bg-black overflow-hidden">
                  {selectedProject.video_url ? (
                    (() => {
                      const video = getVideoDetails(selectedProject.video_url);

                      // Direct Video (MP4 / WebM / Cloud file)
                      if (video?.type === 'direct') {
                        return (
                          <div className="w-full max-h-[70vh] flex items-center justify-center bg-black">
                            <video 
                              controls 
                              autoPlay 
                              playsInline 
                              loop
                              src={video.url} 
                              className="max-h-[70vh] w-auto max-w-full rounded-t-2xl shadow-2xl bg-black"
                            >
                              Browser Anda tidak mendukung pemutar video.
                            </video>
                          </div>
                        );
                      }

                      // Vertical Video (Instagram Reels / YouTube Shorts)
                      if (video?.isVertical) {
                        return (
                          <div className="w-full aspect-[9/16] max-h-[68vh] sm:max-h-[72vh] mx-auto bg-black flex items-center justify-center relative">
                            <iframe
                              src={video.embedUrl}
                              title={selectedProject.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                        );
                      }

                      // Landscape Standard Video (YouTube 16:9, Vimeo, etc.)
                      return (
                        <div className="w-full aspect-video max-h-[68vh] sm:max-h-[72vh] bg-black flex items-center justify-center relative">
                          <iframe
                            src={video?.embedUrl || selectedProject.video_url}
                            title={selectedProject.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      );
                    })()
                  ) : (
                    // Photo / Image Lightbox
                    <div className="w-full max-h-[70vh] sm:max-h-[75vh] flex items-center justify-center bg-black p-2">
                      <img
                        src={selectedProject.image_url || 'https://placehold.co/800x600?text=Creative+Box'}
                        alt={selectedProject.title}
                        className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                      />
                    </div>
                  )}
                </div>
                
                {/* Information Card (Instagram Feed Style) */}
                <div className="w-full bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 border-t border-white/10 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          {selectedProject.video_url ? (getVideoDetails(selectedProject.video_url)?.label || 'Video Player') : 'Photo Gallery'}
                        </span>
                        {selectedProject.client_name && (
                          <span className="text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-full font-medium">
                            Klien: {selectedProject.client_name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white text-base sm:text-xl font-bold leading-snug truncate">
                        {selectedProject.title}
                      </h3>
                    </div>

                    {/* External Link button */}
                    {selectedProject.video_url && (
                      <a 
                        href={selectedProject.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/15 shrink-0 self-start sm:self-auto active:scale-95"
                        title="Buka tautan asli di tab baru"
                      >
                        <ExternalLink size={13} />
                        <span>Buka Sumber Asli</span>
                      </a>
                    )}
                  </div>

                  {selectedProject.description && (
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-h-20 overflow-y-auto whitespace-pre-wrap pr-1">
                      {selectedProject.description}
                    </p>
                  )}

                  {selectedProject.date_completed && (
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>Selesai: {new Date(selectedProject.date_completed).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}

                  {/* Mobile Prev / Next Controls */}
                  {projects.length > 1 && (
                    <div className="flex sm:hidden items-center justify-between pt-3 mt-3 border-t border-white/10">
                      <button
                        onClick={handlePrev}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold flex items-center gap-1 active:bg-white/20"
                      >
                        <ChevronLeft size={14} /> Sebelumnya
                      </button>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {currentIndex + 1} dari {projects.length}
                      </span>
                      <button
                        onClick={handleNext}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold flex items-center gap-1 active:bg-white/20"
                      >
                        Selanjutnya <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
