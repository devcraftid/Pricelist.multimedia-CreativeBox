import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, ArrowLeft } from 'lucide-react';
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
      setError('Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#273554] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#f5a623] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-10">
            <div className="bg-white p-3 rounded-2xl shadow-lg mb-6 w-24 h-24 flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <img src="/admin-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
            <p className="text-blue-100/70 mt-2 font-medium">Masuk untuk mengelola konten website</p>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl mb-6 text-sm text-center font-medium">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-blue-100 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 text-white placeholder-blue-200/50 rounded-xl focus:ring-2 focus:ring-[#f5a623] focus:border-[#f5a623] outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@creativebox.id"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-blue-100 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 text-white placeholder-blue-200/50 rounded-xl focus:ring-2 focus:ring-[#f5a623] focus:border-[#f5a623] outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#f5a623] to-[#e09212] hover:from-yellow-400 hover:to-orange-500 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all mt-4 disabled:opacity-70 flex justify-center items-center gap-2 tracking-wide"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock size={18} />
              )}
              {loading ? 'MEMVERIFIKASI...' : 'MASUK KE ADMIN'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-blue-200/70 hover:text-white transition-colors font-medium">
              <ArrowLeft size={16} /> Kembali ke Halaman Publik
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
