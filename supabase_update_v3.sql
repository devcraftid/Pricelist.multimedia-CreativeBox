-- ==========================================
-- SCRIPT UPDATE V3: CMS DINAMIS & STORAGE
-- ==========================================

-- 1. Tambah Kolom Logo dan Hero Banner di site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- 2. Hapus (Kosongkan) Data Bawaan / Dummy Lama
-- Agar halaman publik tampil kosong seperti yang direquest
DELETE FROM public.services;
DELETE FROM public.rental_equipments;
DELETE FROM public.clients;
DELETE FROM public.faqs;
DELETE FROM public.projects;
DELETE FROM public.blogs;

-- 3. Kosongkan Data Pengaturan Situs
-- Kita biarkan 1 baris ID, tapi isinya kita reset menjadi kosong
UPDATE public.site_settings 
SET 
    hero_title = 'Judul Hero Belum Diatur',
    hero_subtitle = '',
    wa_number = '',
    email = '',
    address = '',
    facebook_url = '',
    instagram_url = '',
    logo_url = '',
    hero_image_url = '';

-- Pastikan jika tabel site_settings kosong, kita insert 1 baris kosong
INSERT INTO public.site_settings (id, hero_title)
SELECT gen_random_uuid(), 'Website Sedang Maintenance'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);


-- ==========================================
-- SETUP BUCKET STORAGE (public_assets)
-- ==========================================

-- Buat bucket baru bernama 'public_assets' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('public_assets', 'public_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Berikan akses Publik untuk BACA (Melihat) gambar
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public_assets' );

-- Berikan akses Admin (Authenticated) untuk UPLOAD gambar
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'public_assets' AND auth.role() = 'authenticated' );

-- Berikan akses Admin (Authenticated) untuk UPDATE gambar
CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'public_assets' AND auth.role() = 'authenticated' );

-- Berikan akses Admin (Authenticated) untuk DELETE gambar
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING ( bucket_id = 'public_assets' AND auth.role() = 'authenticated' );
