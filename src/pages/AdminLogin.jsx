import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin');
    } catch (err) {
      setError('Email atau password tidak valid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070" 
            alt="Studio Background" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/50 to-secondary/90" />
        </div>
        
        <div className="relative z-10 px-16 max-w-2xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 uppercase">
              Creative Box<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">
                Administration
              </span>
            </h1>
            <p className="text-blue-100/80 text-lg leading-relaxed font-medium">
              Sistem manajemen konten terpadu. Kelola layanan, harga, portofolio, dan interaksi klien dengan mudah dan aman.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative bg-background">
        
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-bold group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Ke Halaman Utama
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="mb-8 flex justify-center lg:justify-start">
              <img src="/admin-logo.png" alt="Creative Box Logo" className="h-20 object-contain drop-shadow-sm filter invert brightness-0" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFF0] tracking-tight">Selamat Datang</h2>
            <p className="text-slate-300 mt-3 font-medium">Silakan masuk ke akun admin Anda.</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-8 text-sm font-bold shadow-sm flex items-center gap-3"
            >
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">Alamat Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@creativebox.id"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-400 text-secondary font-extrabold py-4 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 tracking-wider group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
              )}
              {loading ? 'MEMVERIFIKASI...' : 'MASUK SEKARANG'}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}
