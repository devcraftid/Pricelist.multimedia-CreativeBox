-- ==========================================
-- SCRIPT UPDATE v4: MULTICAM.ID DATABASE
-- (Menambahkan kolom map_embed_url & tabel advantages)
-- ==========================================

-- 1. Tambah Kolom Baru Untuk Map di site_settings
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='map_embed_url') THEN
        ALTER TABLE public.site_settings ADD COLUMN map_embed_url TEXT;
    END IF;
END $$;

-- 2. Buat Tabel Baru: advantages (Keunggulan Kami)
CREATE TABLE IF NOT EXISTS public.advantages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Aktifkan RLS dan Kebijakan Publik (Baca Saja) untuk advantages
ALTER TABLE public.advantages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view advantages" ON public.advantages;
CREATE POLICY "Public can view advantages" ON public.advantages FOR SELECT USING (true);

-- 4. Tambah kolom untuk teks stats di about_page jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='about_page' AND column_name='stat_1_title') THEN
        ALTER TABLE public.about_page ADD COLUMN stat_1_title TEXT;
        ALTER TABLE public.about_page ADD COLUMN stat_1_value TEXT;
        ALTER TABLE public.about_page ADD COLUMN stat_2_title TEXT;
        ALTER TABLE public.about_page ADD COLUMN stat_2_value TEXT;
        ALTER TABLE public.about_page ADD COLUMN stat_3_title TEXT;
        ALTER TABLE public.about_page ADD COLUMN stat_3_value TEXT;
        ALTER TABLE public.about_page ADD COLUMN stat_4_title TEXT;
        ALTER TABLE public.about_page ADD COLUMN stat_4_value TEXT;
    END IF;
END $$;

-- Pastikan tabel about_page minimal punya 1 baris
INSERT INTO public.about_page (
    id, 
    company_history, 
    vision, 
    mission,
    stat_1_title, stat_1_value,
    stat_2_title, stat_2_value,
    stat_3_title, stat_3_value,
    stat_4_title, stat_4_value
)
SELECT 
    gen_random_uuid(), 
    'Creative Box adalah penyedia layanan dokumentasi terkemuka...', 
    'Menjadi penyedia layanan dokumentasi terbaik...', 
    'Memberikan pelayanan profesional dan berkualitas...',
    'Didirikan', '2019',
    'Klien Puas', '300+',
    'Proyek Selesai', '100+',
    'Dukungan Tim', '7/24'
WHERE NOT EXISTS (SELECT 1 FROM public.about_page);
