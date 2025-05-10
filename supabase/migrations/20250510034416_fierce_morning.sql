/*
  # Add Broadcast System Tables

  1. New Tables
    - `broadcasts` - Stores admin broadcast messages
    - `broadcast_deliveries` - Tracks message delivery status
  
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create broadcasts table
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create broadcast_deliveries table
CREATE TABLE IF NOT EXISTS broadcast_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id UUID REFERENCES broadcasts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(broadcast_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_deliveries ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies for broadcasts
CREATE POLICY "Admins can manage broadcasts"
  ON broadcasts FOR ALL
  USING (is_admin());

CREATE POLICY "Published broadcasts are viewable by everyone"
  ON broadcasts FOR SELECT
  USING (status = 'published');

-- Set up RLS policies for broadcast_deliveries
CREATE POLICY "Admins can view all deliveries"
  ON broadcast_deliveries FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can view their own deliveries"
  ON broadcast_deliveries FOR SELECT
  USING (auth.uid() = user_id);

-- Create updated_at trigger for broadcasts
CREATE TRIGGER update_broadcasts_updated_at
  BEFORE UPDATE ON broadcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();