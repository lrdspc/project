-- Script de configuração para o novo projeto Supabase
-- Este script cria todas as tabelas e configurações necessárias para o projeto

/*
  Estrutura do banco de dados:
  
  1. Tabelas:
    - clients (clientes)
    - inspections (vistorias)
    - inspection_tiles (telhas das vistorias)
    - nonconformities (não conformidades)
    - inspection_photos (fotos das vistorias)
    - users_profiles (perfis de usuários)
  
  2. Relações:
    - Um cliente pode ter múltiplas vistorias
    - Uma vistoria pode ter múltiplas telhas, não conformidades e fotos
    - Uma não conformidade pode ter múltiplas fotos
    - Um usuário tem um perfil
*/

-- Create users_profiles table (se não existir)
CREATE TABLE IF NOT EXISTS users_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'technician',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

CREATE POLICY "Users can delete clients"
  ON clients
  FOR DELETE
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

CREATE POLICY "Users can delete inspections"
  ON inspections
  FOR DELETE
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

CREATE POLICY "Users can delete inspection_tiles"
  ON inspection_tiles
  FOR DELETE
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

CREATE POLICY "Users can delete nonconformities"
  ON nonconformities
  FOR DELETE
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

CREATE POLICY "Users can delete inspection_photos"
  ON inspection_photos
  FOR DELETE
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

-- Adicionar dados de exemplo (opcional - remova esta seção se não quiser dados de exemplo)
INSERT INTO clients (name, type, address, city, state, zip_code, contact_name, contact_phone, contact_email)
VALUES 
  ('Empresa ABC Ltda', 'corporate', 'Rua Principal, 123', 'São Paulo', 'SP', '01234-567', 'João Silva', '(11) 98765-4321', 'joao@abc.com'),
  ('Condomínio Jardim das Flores', 'residential', 'Av. das Flores, 500', 'Rio de Janeiro', 'RJ', '20000-000', 'Maria Oliveira', '(21) 98888-7777', 'maria@condominios.com'),
  ('Centro Comercial Norte', 'commercial', 'Quadra 5, Lote 10', 'Brasília', 'DF', '70000-000', 'Carlos Santos', '(61) 99999-8888', 'carlos@centronorte.com'); 