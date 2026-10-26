-- Mengizinkan pengunjung publik (tanpa login) untuk mengirim pesan via Form Kontak
DROP POLICY IF EXISTS "Public can insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact_messages" ON public.contact_messages 
FOR INSERT WITH CHECK (true);

-- Mengizinkan Admin untuk melihat daftar pesan
DROP POLICY IF EXISTS "Admin can view contact_messages" ON public.contact_messages;
CREATE POLICY "Admin can view contact_messages" ON public.contact_messages 
FOR SELECT USING (auth.role() = 'authenticated');
