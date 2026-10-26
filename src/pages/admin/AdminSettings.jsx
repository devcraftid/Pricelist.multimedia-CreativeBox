import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    id: '',
    hero_title: '',
    hero_subtitle: '',
    wa_number: '',
    email: '',
    address: '',
    facebook_url: '',
    instagram_url: '',
    logo_url: '',
    hero_image_url: '',
    map_embed_url: '',
    primary_color: '#f5a623',
    secondary_color: '#1b253b',
    bg_color: '#f8fafc',
    text_color: '#0f172a',
    promo_active: false,
    promo_text: '',
    promo_link: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*').limit(1);
    if (data && data.length > 0) {
      setSettings(data[0]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setMessage({ text: 'Mengupload gambar...', type: 'info' });
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public_assets')
        .getPublicUrl(filePath);

      setSettings(prev => ({ ...prev, [field]: publicUrl }));
      setMessage({ text: 'Upload berhasil! Jangan lupa klik Simpan.', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Gagal mengupload gambar.', type: 'error' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      let error;
      if (settings.id) {
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({
            hero_title: settings.hero_title,
            hero_subtitle: settings.hero_subtitle,
            wa_number: settings.wa_number,
            email: settings.email,
            address: settings.address,
            facebook_url: settings.facebook_url,
            instagram_url: settings.instagram_url,
            logo_url: settings.logo_url,
            hero_image_url: settings.hero_image_url,
            map_embed_url: settings.map_embed_url,
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            bg_color: settings.bg_color,
            text_color: settings.text_color,
            promo_active: settings.promo_active,
            promo_text: settings.promo_text,
            promo_link: settings.promo_link,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert([{
            hero_title: settings.hero_title,
            hero_subtitle: settings.hero_subtitle,
            wa_number: settings.wa_number,
            email: settings.email,
            address: settings.address,
            facebook_url: settings.facebook_url,
            instagram_url: settings.instagram_url,
            logo_url: settings.logo_url,
            hero_image_url: settings.hero_image_url,
            map_embed_url: settings.map_embed_url,
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            bg_color: settings.bg_color,
            text_color: settings.text_color,
            promo_active: settings.promo_active,
            promo_text: settings.promo_text,
            promo_link: settings.promo_link
          }]);
        error = insertError;
        // Fetch again to get the new ID
        fetchSettings();
      }

      if (error) throw error;
      setMessage({ text: 'Pengaturan berhasil disimpan!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Gagal menyimpan pengaturan.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Pengaturan Situs</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">Atur teks utama, gambar logo, banner, dan kontak website Anda.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Logo & Hero Settings */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
            <ImageIcon size={20} className="text-primary" /> Identitas & Banner
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo Website</label>
              {settings.logo_url && (
                <div className="relative inline-block mb-3">
                  <img src={settings.logo_url} alt="Logo" className="h-16 object-contain bg-slate-100 p-2 rounded-xl border border-slate-200" />
                  <button 
                    type="button" 
                    onClick={() => setSettings({...settings, logo_url: ''})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
                    title="Hapus Logo"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-slate-200">
                  <Upload size={16} /> Upload Logo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gambar Banner Utama (Hero)</label>
              {settings.hero_image_url && (
                <div className="relative inline-block mb-3">
                  <img src={settings.hero_image_url} alt="Hero" className="h-16 w-32 object-cover bg-slate-100 p-2 rounded-xl border border-slate-200" />
                  <button 
                    type="button" 
                    onClick={() => setSettings({...settings, hero_image_url: ''})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
                    title="Hapus Banner"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-slate-200">
                  <Upload size={16} /> Upload Banner
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image_url')} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Atas Banner (Kecil)</label>
              <input type="text" name="hero_title" value={settings.hero_title} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Teks Utama Banner (Besar)</label>
              <textarea name="hero_subtitle" value={settings.hero_subtitle} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"></textarea>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Informasi Kontak & Sosial Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
              <input type="text" name="wa_number" value={settings.wa_number} onChange={handleChange} placeholder="Cth: 6287772486006" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
              <input type="email" name="email" value={settings.email} onChange={handleChange} placeholder="admin@multicam.id" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap Kantor</label>
              <textarea name="address" value={settings.address} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link Facebook</label>
              <input type="url" name="facebook_url" value={settings.facebook_url} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link Instagram</label>
              <input type="url" name="instagram_url" value={settings.instagram_url} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Embed URL (Iframe src)</label>
              <input type="url" name="map_embed_url" value={settings.map_embed_url} onChange={handleChange} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
              <p className="text-[11px] text-slate-500 mt-1">Kosongkan jika Anda belum ingin menampilkan peta di halaman Contact Us.</p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              Warna Tema
            </h3>
            <button
              type="button"
              onClick={() => {
                setSettings(prev => ({
                  ...prev,
                  primary_color: '#f5a623',
                  secondary_color: '#1b253b',
                  bg_color: '#f8fafc',
                  text_color: '#0f172a'
                }));
                setMessage({ text: 'Warna di-reset ke rekomendasi (Emas, Navy, Slate). Klik SIMPAN PENGATURAN di bawah untuk menyimpan.', type: 'info' });
              }}
              className="text-xs font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300 px-3.5 py-2 rounded-xl transition-colors cursor-pointer w-full sm:w-fit text-center"
            >
              ↺ Reset ke Rekomendasi (HD Contrast)
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Warna Utama (Aksen / Tombol)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="primary_color" 
                  value={settings.primary_color || '#f5a623'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded-xl cursor-pointer shrink-0"
                />
                <input 
                  type="text" 
                  name="primary_color" 
                  value={settings.primary_color || '#f5a623'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none uppercase font-mono text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Warna Sekunder (Latar Gelap / Header)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="secondary_color" 
                  value={settings.secondary_color || '#1b253b'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded-xl cursor-pointer shrink-0"
                />
                <input 
                  type="text" 
                  name="secondary_color" 
                  value={settings.secondary_color || '#1b253b'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none uppercase font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Warna Latar Belakang (Website)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="bg_color" 
                  value={settings.bg_color || '#f8fafc'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded-xl cursor-pointer shrink-0"
                />
                <input 
                  type="text" 
                  name="bg_color" 
                  value={settings.bg_color || '#f8fafc'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none uppercase font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Warna Teks Utama</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="text_color" 
                  value={settings.text_color || '#0f172a'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded-xl cursor-pointer shrink-0"
                />
                <input 
                  type="text" 
                  name="text_color" 
                  value={settings.text_color || '#0f172a'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none uppercase font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Promo Settings */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
            Pengaturan Tombol Promo
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="promo_active"
                name="promo_active"
                checked={settings.promo_active || false}
                onChange={(e) => setSettings(prev => ({ ...prev, promo_active: e.target.checked }))}
                className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
              />
              <label htmlFor="promo_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                Tampilkan Tombol Promo di Navigasi Publik
              </label>
            </div>
            
            {settings.promo_active && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teks Tombol Promo</label>
                  <input type="text" name="promo_text" value={settings.promo_text || ''} onChange={handleChange} placeholder="Cth: PROMO AKHIR TAHUN!" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link URL Promo</label>
                  <input type="url" name="promo_link" value={settings.promo_link || ''} onChange={handleChange} placeholder="Cth: https://wa.me/... atau /price-list" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto justify-center bg-primary hover:bg-amber-400 text-secondary px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-primary/20 active:scale-95"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

      </form>
    </div>
  );
}
