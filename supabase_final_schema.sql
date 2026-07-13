-- ==========================================
-- SCRIPT SETUP FINAL: MULTICAM.ID DATABASE
-- (Bisa dijalankan ulang berkali-kali tanpa error)
-- ==========================================

-- 1. Buat Tabel-tabel Dasar Jika Belum Ada
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT,
    wa_number TEXT,
    email TEXT,
    address TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    primary_color TEXT DEFAULT '#f5a623',
    secondary_color TEXT DEFAULT '#1b253b',
    bg_color TEXT DEFAULT '#f8fafc',
    text_color TEXT DEFAULT '#0f172a',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon_or_image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rental_equipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    client_name TEXT,
    date_completed DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.about_page (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_history TEXT,
    vision TEXT,
    mission TEXT,
    team_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tambah Kolom Baru Untuk CMS (Abaikan jika sudah ada)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='logo_url') THEN
        ALTER TABLE public.site_settings ADD COLUMN logo_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='hero_image_url') THEN
        ALTER TABLE public.site_settings ADD COLUMN hero_image_url TEXT;
    END IF;
END $$;

-- 3. Hapus Semua Data Bawaan Lama (Reset ke Kosong)
DELETE FROM public.services;
DELETE FROM public.rental_equipments;
DELETE FROM public.clients;
DELETE FROM public.faqs;
DELETE FROM public.projects;
DELETE FROM public.blogs;
DELETE FROM public.about_page;

-- 4. Reset site_settings menjadi kosong (Hanya 1 Baris)
DELETE FROM public.site_settings;
INSERT INTO public.site_settings (id, hero_title, hero_subtitle, wa_number, email, address, facebook_url, instagram_url, logo_url, hero_image_url)
VALUES (
    gen_random_uuid(), 
    'Website Sedang Maintenance', 
    '', '', '', '', '', '', '', ''
);

-- 5. Aktifkan RLS dan Kebijakan Publik (Baca Saja)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view rental_equipments" ON public.rental_equipments;
CREATE POLICY "Public can view rental_equipments" ON public.rental_equipments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view clients" ON public.clients;
CREATE POLICY "Public can view clients" ON public.clients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view faqs" ON public.faqs;
CREATE POLICY "Public can view faqs" ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view blogs" ON public.blogs;
CREATE POLICY "Public can view blogs" ON public.blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view about_page" ON public.about_page;
CREATE POLICY "Public can view about_page" ON public.about_page FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);


-- 6. SETUP BUCKET STORAGE (public_assets)
INSERT INTO storage.buckets (id, name, public)
VALUES ('public_assets', 'public_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Drop policy lama agar tidak error conflict saat dibuat ulang
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

-- Berikan akses Publik untuk BACA gambar
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public_assets' );

-- Berikan akses Admin (Authenticated) untuk CRUD gambar
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'public_assets' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'public_assets' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING ( bucket_id = 'public_assets' AND auth.role() = 'authenticated' );
