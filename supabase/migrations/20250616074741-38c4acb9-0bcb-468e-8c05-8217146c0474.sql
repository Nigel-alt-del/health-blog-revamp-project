
-- Enable Row Level Security on the post_save_logs table
ALTER TABLE public.post_save_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert logs
-- This allows the system to log post save attempts
CREATE POLICY "Allow authenticated users to insert logs" ON public.post_save_logs
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow reading logs (for admin purposes)
-- For now, allowing authenticated users to read their own logs or all logs if needed for debugging
-- You can restrict this further to admin-only access later if needed
CREATE POLICY "Allow authenticated users to read logs" ON public.post_save_logs
  FOR SELECT 
  TO authenticated
  USING (true);

-- Prevent updates and deletes to maintain log integrity
-- No policies for UPDATE or DELETE means they are denied by default
