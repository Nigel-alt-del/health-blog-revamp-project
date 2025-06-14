
-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Create more permissive policies that allow unauthenticated uploads
CREATE POLICY "Anyone can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can update blog images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can delete blog images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');
