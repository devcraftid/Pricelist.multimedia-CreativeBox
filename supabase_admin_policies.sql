-- Berikan akses CRUD (Create, Read, Update, Delete) kepada Admin (Authenticated users)

-- 1. site_settings
DROP POLICY IF EXISTS "Admin can update site_settings" ON public.site_settings;
CREATE POLICY "Admin can update site_settings" ON public.site_settings 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can insert site_settings" ON public.site_settings;
CREATE POLICY "Admin can insert site_settings" ON public.site_settings 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 2. services
DROP POLICY IF EXISTS "Admin can insert services" ON public.services;
CREATE POLICY "Admin can insert services" ON public.services 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update services" ON public.services;
CREATE POLICY "Admin can update services" ON public.services 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete services" ON public.services;
CREATE POLICY "Admin can delete services" ON public.services 
FOR DELETE USING (auth.role() = 'authenticated');

-- 3. rental_equipments
DROP POLICY IF EXISTS "Admin can insert rental_equipments" ON public.rental_equipments;
CREATE POLICY "Admin can insert rental_equipments" ON public.rental_equipments 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update rental_equipments" ON public.rental_equipments;
CREATE POLICY "Admin can update rental_equipments" ON public.rental_equipments 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete rental_equipments" ON public.rental_equipments;
CREATE POLICY "Admin can delete rental_equipments" ON public.rental_equipments 
FOR DELETE USING (auth.role() = 'authenticated');

-- 4. clients
DROP POLICY IF EXISTS "Admin can insert clients" ON public.clients;
CREATE POLICY "Admin can insert clients" ON public.clients 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update clients" ON public.clients;
CREATE POLICY "Admin can update clients" ON public.clients 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete clients" ON public.clients;
CREATE POLICY "Admin can delete clients" ON public.clients 
FOR DELETE USING (auth.role() = 'authenticated');

-- 5. faqs
DROP POLICY IF EXISTS "Admin can insert faqs" ON public.faqs;
CREATE POLICY "Admin can insert faqs" ON public.faqs 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update faqs" ON public.faqs;
CREATE POLICY "Admin can update faqs" ON public.faqs 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete faqs" ON public.faqs;
CREATE POLICY "Admin can delete faqs" ON public.faqs 
FOR DELETE USING (auth.role() = 'authenticated');

-- 6. contact_messages (Delete only, insert is for public)
DROP POLICY IF EXISTS "Admin can delete contact_messages" ON public.contact_messages;
CREATE POLICY "Admin can delete contact_messages" ON public.contact_messages 
FOR DELETE USING (auth.role() = 'authenticated');

-- 7. projects
DROP POLICY IF EXISTS "Admin can insert projects" ON public.projects;
CREATE POLICY "Admin can insert projects" ON public.projects 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update projects" ON public.projects;
CREATE POLICY "Admin can update projects" ON public.projects 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete projects" ON public.projects;
CREATE POLICY "Admin can delete projects" ON public.projects 
FOR DELETE USING (auth.role() = 'authenticated');

-- 8. blogs
DROP POLICY IF EXISTS "Admin can insert blogs" ON public.blogs;
CREATE POLICY "Admin can insert blogs" ON public.blogs 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update blogs" ON public.blogs;
CREATE POLICY "Admin can update blogs" ON public.blogs 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete blogs" ON public.blogs;
CREATE POLICY "Admin can delete blogs" ON public.blogs 
FOR DELETE USING (auth.role() = 'authenticated');

-- 9. about_page
DROP POLICY IF EXISTS "Admin can update about_page" ON public.about_page;
CREATE POLICY "Admin can update about_page" ON public.about_page 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can insert about_page" ON public.about_page;
CREATE POLICY "Admin can insert about_page" ON public.about_page 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
