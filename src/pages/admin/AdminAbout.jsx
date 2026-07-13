import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

export default function AdminAbout() {
  const [settings, setSettings] = useState({
    id: '',
    company_history: '',
    vision: '',
    mission: '',
    team_image_url: '',
    stat_1_title: '', stat_1_value: '',
    stat_2_title: '', stat_2_value: '',
    stat_3_title: '', stat_3_value: '',
    stat_4_title: '', stat_4_value: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('about_page').select('*').limit(1);
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
          .from('about_page')
          .update({
            company_history: settings.company_history,
            vision: settings.vision,
            mission: settings.mission,
            team_image_url: settings.team_image_url,
            stat_1_title: settings.stat_1_title, stat_1_value: settings.stat_1_value,
            stat_2_title: settings.stat_2_title, stat_2_value: settings.stat_2_value,
            stat_3_title: settings.stat_3_title, stat_3_value: settings.stat_3_value,
            stat_4_title: settings.stat_4_title, stat_4_value: settings.stat_4_value,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('about_page')
          .insert([{
            company_history: settings.company_history,
            vision: settings.vision,
            mission: settings.mission,
            team_image_url: settings.team_image_url,
            stat_1_title: settings.stat_1_title, stat_1_value: settings.stat_1_value,
            stat_2_title: settings.stat_2_title, stat_2_value: settings.stat_2_value,
            stat_3_title: settings.stat_3_title, stat_3_value: settings.stat_3_value,
            stat_4_title: settings.stat_4_title, stat_4_value: settings.stat_4_value
          }]);
        error = insertError;
        fetchSettings();
      }

      if (error) throw error;
      setMessage({ text: 'Konten Tentang Kami berhasil disimpan!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Gagal menyimpan konten. Pastikan script SQL update sudah dijalankan.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Tentang Kami</h2>
        <p className="text-slate-500 mt-2">Atur teks deskripsi perusahaan, visi, misi, dan angka statistik yang muncul di halaman About Us.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-600' : message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Teks Utama */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Profil Perusahaan</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sejarah / Deskripsi Singkat</label>
              <textarea name="company_history" value={settings.company_history || ''} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Creative Box adalah..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Visi</label>
              <textarea name="vision" value={settings.vision || ''} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Misi</label>
              <textarea name="mission" value={settings.mission || ''} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>
          </div>
        </div>

        {/* Gambar Profil */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ImageIcon size={20} className="text-primary" /> Gambar Banner Tentang Kami
          </h3>
          
          <div>
            {settings.team_image_url && (
              <div className="relative inline-block mb-3">
                <img src={settings.team_image_url} alt="Team" className="h-32 object-cover bg-slate-100 p-2 rounded border border-slate-200" />
                <button 
                  type="button" 
                  onClick={() => setSettings({...settings, team_image_url: ''})}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
                  title="Hapus Gambar"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Upload size={16} /> Upload Gambar
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'team_image_url')} />
              </label>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Angka Pencapaian (Stats)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-slate-100 rounded-xl bg-background">
              <label className="block text-sm font-bold text-slate-700 mb-1">Statistik 1</label>
              <div className="space-y-2">
                <input type="text" name="stat_1_title" value={settings.stat_1_title || ''} onChange={handleChange} placeholder="Judul (Cth: Didirikan)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <input type="text" name="stat_1_value" value={settings.stat_1_value || ''} onChange={handleChange} placeholder="Nilai (Cth: 2019)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
            </div>
            
            <div className="p-4 border border-slate-100 rounded-xl bg-background">
              <label className="block text-sm font-bold text-slate-700 mb-1">Statistik 2</label>
              <div className="space-y-2">
                <input type="text" name="stat_2_title" value={settings.stat_2_title || ''} onChange={handleChange} placeholder="Judul (Cth: Klien Puas)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <input type="text" name="stat_2_value" value={settings.stat_2_value || ''} onChange={handleChange} placeholder="Nilai (Cth: 300+)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-background">
              <label className="block text-sm font-bold text-slate-700 mb-1">Statistik 3</label>
              <div className="space-y-2">
                <input type="text" name="stat_3_title" value={settings.stat_3_title || ''} onChange={handleChange} placeholder="Judul (Cth: Proyek Selesai)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <input type="text" name="stat_3_value" value={settings.stat_3_value || ''} onChange={handleChange} placeholder="Nilai (Cth: 100+)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-background">
              <label className="block text-sm font-bold text-slate-700 mb-1">Statistik 4</label>
              <div className="space-y-2">
                <input type="text" name="stat_4_title" value={settings.stat_4_title || ''} onChange={handleChange} placeholder="Judul (Cth: Dukungan Tim)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <input type="text" name="stat_4_value" value={settings.stat_4_value || ''} onChange={handleChange} placeholder="Nilai (Cth: 7/24)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold" />
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
            {saving ? 'Menyimpan...' : 'Simpan Konten'}
          </button>
        </div>

      </form>
    </div>
  );
}
