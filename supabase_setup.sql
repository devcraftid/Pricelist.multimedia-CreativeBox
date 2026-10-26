-- ==========================================
-- SCRIPT SETUP SUPABASE MULTICAM.ID FULL
-- ==========================================

-- 1. Tabel Pengaturan Situs (Global Settings & Hero)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT,
    wa_number TEXT,
    email TEXT,
    address TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Layanan Kami
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon_or_image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Rental Equipment
CREATE TABLE public.rental_equipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Klien Kami
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel FAQ
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Pesan dari Form Kontak
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Project Update (Portofolio)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    client_name TEXT,
    date_completed DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabel News & Blog
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabel About Page
CREATE TABLE public.about_page (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_history TEXT,
    vision TEXT,
    mission TEXT,
    team_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====== MENGAKTIFKAN RLS ======
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

-- ====== POLICY UNTUK PUBLIK (Bisa baca semuanya kecuali pesan kontak) ======
CREATE POLICY "Public can view site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public can view rental_equipments" ON public.rental_equipments FOR SELECT USING (true);
CREATE POLICY "Public can view clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Public can view faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public can view about_page" ON public.about_page FOR SELECT USING (true);
CREATE POLICY "Public can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- ====== SEED DATA AWAL ======
INSERT INTO public.site_settings (hero_title, hero_subtitle, wa_number, email, address, facebook_url, instagram_url)
VALUES (
    'MULTICAM INDONESIA',
    'Jasa Multimedia dan Live Camera Production Terbaik',
    '6281234567890',
    'info@multicam.id',
    'Jl. Contoh Alamat No. 123, Jakarta',
    'https://facebook.com/multicamid',
    'https://instagram.com/multicamid'
);

INSERT INTO public.services (title, description, order_index, icon_or_image_url) VALUES 
('Seminar / Workshop', 'Layanan dokumentasi dan live streaming untuk kegiatan seminar atau workshop.', 1, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80'),
('Wedding Documentation', 'Abadikan momen spesial pernikahan Anda dengan kualitas kamera terbaik.', 2, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80');

INSERT INTO public.rental_equipments (title, description, order_index, image_url) VALUES 
('Kamera Sony A7S III', 'Kamera mirrorless full-frame dengan kemampuan video 4K.', 1, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'),
('Jimmy Jib Triangle', 'Alat penyangga kamera panjang untuk pergerakan kamera dinamis.', 2, 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=500&q=80');

INSERT INTO public.clients (name, order_index, logo_url) VALUES 
('Klien A', 1, 'https://placehold.co/200x100?text=Klien+A'),
('Klien B', 2, 'https://placehold.co/200x100?text=Klien+B');

INSERT INTO public.faqs (question, answer, order_index) VALUES 
('Apakah bisa sewa harian?', 'Tentu, kami menyediakan paket sewa harian maupun mingguan.', 1),
('Bagaimana cara pembayarannya?', 'Pembayaran bisa dilakukan melalui transfer bank dengan DP 50%.', 2);

INSERT INTO public.projects (title, description, image_url, client_name, date_completed) VALUES
('Live Konser Musik Jakarta', 'Dokumentasi live streaming untuk konser musik berskala nasional.', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80', 'PT Kreatif Event', '2023-12-10'),
('Corporate Gathering 2024', 'Live multicam untuk acara tahunan perusahaan.', 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=500&q=80', 'PT Maju Bersama', '2024-02-15');

INSERT INTO public.blogs (title, slug, content, cover_image_url, author) VALUES
('Tren Kamera Mirrorless untuk Live Streaming 2024', 'tren-kamera-mirrorless-2024', 'Berikut adalah daftar kamera mirrorless terbaik untuk live streaming di tahun 2024...', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', 'Admin Multicam'),
('Pentingnya Dokumentasi Profesional untuk Event Anda', 'pentingnya-dokumentasi-event', 'Dokumentasi video tidak hanya sekedar kenang-kenangan, tapi juga aset untuk promosi...', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', 'Admin Multicam');

INSERT INTO public.about_page (company_history, vision, mission, team_image_url) VALUES
('Multicam Indonesia didirikan pada tahun 2010 berawal dari sebuah tim kecil...', 'Menjadi penyedia jasa multimedia dan live camera production terbaik di Indonesia.', '1. Memberikan kualitas gambar terbaik\n2. Pelayanan cepat dan profesional', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80');
