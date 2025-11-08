-- Migration: Add blog comments table
-- Date: 2025-11-08
-- Description: Creates a comments table for blogs with name, email (optional), and message

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON public.blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON public.blog_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_published ON public.blog_comments(is_published) WHERE is_published = true;

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow everyone to read published comments
CREATE POLICY "Allow public to read published comments" ON public.blog_comments
    FOR SELECT USING (is_published = true);

-- Allow everyone to insert comments
CREATE POLICY "Allow public to insert comments" ON public.blog_comments
    FOR INSERT WITH CHECK (true);

-- Allow admins to manage all comments
CREATE POLICY "Allow admins to manage all comments" ON public.blog_comments
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'authenticated' AND 
        auth.jwt() ->> 'email' IN (
            SELECT email FROM public.admins WHERE role = 'admin'
        )
    );

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_comments_updated_at 
    BEFORE UPDATE ON public.blog_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE public.blog_comments IS 'Comments for blog posts with optional name and email fields';
COMMENT ON COLUMN public.blog_comments.blog_id IS 'Reference to the blog post being commented on';
COMMENT ON COLUMN public.blog_comments.name IS 'Name of the commenter (required)';
COMMENT ON COLUMN public.blog_comments.email IS 'Email of the commenter (optional)';
COMMENT ON COLUMN public.blog_comments.message IS 'Comment content (required)';
COMMENT ON COLUMN public.blog_comments.is_approved IS 'Whether the comment has been approved by an admin';
COMMENT ON COLUMN public.blog_comments.is_published IS 'Whether the comment is visible to the public';

-- Insert some example data (optional - can be removed in production)
-- INSERT INTO public.blog_comments (blog_id, name, email, message, is_approved, is_published) 
-- VALUES 
--     (
--         (SELECT id FROM public.blogs LIMIT 1),
--         'Jean Dupont',
--         'jean.dupont@email.com',
--         'Excellent article ! Merci pour ces informations précieuses.',
--         true,
--         true
--     );