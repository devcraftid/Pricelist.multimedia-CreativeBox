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
    text_color: '#0f172a'
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
            text_color: settings.text_color
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Pengaturan Situs</h2>
        <p className="text-slate-500 mt-2">Atur teks utama, gambar logo, banner, dan kontak website Anda.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-600' : message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Logo & Hero Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ImageIcon size={20} className="text-primary" /> Identitas & Banner
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo Website</label>
              {settings.logo_url && (
                <div className="relative inline-block mb-3">
                  <img src={settings.logo_url} alt="Logo" className="h-16 object-contain bg-slate-100 p-2 rounded border border-slate-200" />
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
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Upload size={16} /> Upload Logo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gambar Banner Utama (Hero)</label>
              {settings.hero_image_url && (
                <div className="relative inline-block mb-3">
                  <img src={settings.hero_image_url} alt="Hero" className="h-16 w-32 object-cover bg-slate-100 p-2 rounded border border-slate-200" />
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
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Upload size={16} /> Upload Banner
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image_url')} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Atas Banner (Kecil)</label>
              <input type="text" name="hero_title" value={settings.hero_title} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Teks Utama Banner (Besar)</label>
              <textarea name="hero_subtitle" value={settings.hero_subtitle} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Informasi Kontak & Sosial Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
              <input type="text" name="wa_number" value={settings.wa_number} onChange={handleChange} placeholder="Cth: 6287772486006" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
              <input type="email" name="email" value={settings.email} onChange={handleChange} placeholder="admin@multicam.id" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap Kantor</label>
              <textarea name="address" value={settings.address} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link Facebook</label>
              <input type="url" name="facebook_url" value={settings.facebook_url} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link Instagram</label>
              <input type="url" name="instagram_url" value={settings.instagram_url} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Embed URL (Iframe src)</label>
              <input type="url" name="map_embed_url" value={settings.map_embed_url} onChange={handleChange} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              <p className="text-xs text-slate-500 mt-1">Kosongkan jika Anda belum ingin menampilkan peta di halaman Contact Us.</p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Warna Tema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warna Utama (Aksen / Tombol)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="primary_color" 
                  value={settings.primary_color || '#f5a623'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  name="primary_color" 
                  value={settings.primary_color || '#f5a623'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase font-mono"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warna Sekunder (Latar Gelap / Header)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="secondary_color" 
                  value={settings.secondary_color || '#1b253b'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  name="secondary_color" 
                  value={settings.secondary_color || '#1b253b'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warna Latar Belakang (Website)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="bg_color" 
                  value={settings.bg_color || '#f8fafc'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  name="bg_color" 
                  value={settings.bg_color || '#f8fafc'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warna Teks Utama</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="text_color" 
                  value={settings.text_color || '#0f172a'} 
                  onChange={handleChange} 
                  className="w-12 h-12 p-1 border border-slate-200 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  name="text_color" 
                  value={settings.text_color || '#0f172a'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-lg"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

      </form>
    </div>
  );
}
