/*
  # Create posts table

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `category` (text, not null) - Main category (e.g., "personne", "objet", "animal")
      - `sub_category` (text, not null) - Subcategory (e.g., "Enfant", "Téléphone", "Chien")
      - `location_name` (text, not null) - City name
      - `image_url` (text) - Optional image URL
      - `status` (text, not null) - 'lost' or 'found'
      - `date_time_lost_or_found` (timestamptz) - Optional date and time
      - `contact_name` (text, not null)
      - `contact_phone` (text, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `posts` table
    - Add policy for public read access
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  sub_category text NOT NULL,
  location_name text NOT NULL,
  image_url text,
  status text NOT NULL CHECK (status IN ('lost', 'found')),
  date_time_lost_or_found timestamptz,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Posts are viewable by everyone" 
  ON posts 
  FOR SELECT 
  USING (true);

-- Create policy for public insert access
CREATE POLICY "Anyone can create posts" 
  ON posts 
  FOR INSERT 
  WITH CHECK (true);