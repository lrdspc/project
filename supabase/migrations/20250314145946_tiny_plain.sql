/*
  # Esquema inicial do banco de dados

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `contact_name` (text)
      - `contact_phone` (text)
      - `contact_email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `inspections`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `status` (text)
      - `inspection_date` (date)
      - `building_type` (text)
      - `construction_year` (integer)
      - `roof_area` (numeric)
      - `last_maintenance` (text)
      - `main_issue` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `inspection_tiles`
      - `id` (uuid, primary key)
      - `inspection_id` (uuid, foreign key)
      - `line` (text)
      - `thickness` (text)
      - `dimensions` (text)
      - `quantity` (integer)
      - `area` (numeric)

    - `nonconformities`
      - `id` (uuid, primary key)
      - `inspection_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `notes` (text)
      - `created_at` (timestamp)

    - `inspection_photos`
      - `id` (uuid, primary key)
      - `inspection_id` (uuid, foreign key)
      - `nonconformity_id` (uuid, foreign key, nullable)
      - `category` (text)
      - `caption` (text)
      - `photo_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS em todas as tabelas
    - Políticas de acesso para usuários autenticados
*/

-- Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  contact_name text,
  contact_phone text,
  contact_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inspections table
CREATE TABLE inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  inspection_date date NOT NULL,
  building_type text NOT NULL,
  construction_year integer,
  roof_area numeric NOT NULL,
  last_maintenance text,
  main_issue text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inspection_tiles table
CREATE TABLE inspection_tiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE,
  line text NOT NULL,
  thickness text NOT NULL,
  dimensions text NOT NULL,
  quantity integer NOT NULL,
  area numeric NOT NULL
);

-- Create nonconformities table
CREATE TABLE nonconformities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create inspection_photos table
CREATE TABLE inspection_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE,
  nonconformity_id uuid REFERENCES nonconformities(id) ON DELETE SET NULL,
  category text NOT NULL,
  caption text NOT NULL,
  photo_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonconformities ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all inspections"
  ON inspections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inspections"
  ON inspections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inspections"
  ON inspections
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all inspection_tiles"
  ON inspection_tiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inspection_tiles"
  ON inspection_tiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inspection_tiles"
  ON inspection_tiles
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all nonconformities"
  ON nonconformities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert nonconformities"
  ON nonconformities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update nonconformities"
  ON nonconformities
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all inspection_photos"
  ON inspection_photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inspection_photos"
  ON inspection_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inspection_photos"
  ON inspection_photos
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX clients_name_idx ON clients(name);
CREATE INDEX inspections_client_id_idx ON inspections(client_id);
CREATE INDEX inspections_status_idx ON inspections(status);
CREATE INDEX inspection_tiles_inspection_id_idx ON inspection_tiles(inspection_id);
CREATE INDEX nonconformities_inspection_id_idx ON nonconformities(inspection_id);
CREATE INDEX inspection_photos_inspection_id_idx ON inspection_photos(inspection_id);
CREATE INDEX inspection_photos_nonconformity_id_idx ON inspection_photos(nonconformity_id);