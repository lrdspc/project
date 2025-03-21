-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
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

-- Criar tabela de inspeções
CREATE TABLE IF NOT EXISTS inspections (
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

-- Criar tabela de telhas de inspeção
CREATE TABLE IF NOT EXISTS inspection_tiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE,
  line text NOT NULL,
  thickness text NOT NULL,
  dimensions text NOT NULL,
  quantity integer NOT NULL,
  area numeric NOT NULL
);

-- Criar tabela de não conformidades
CREATE TABLE IF NOT EXISTS nonconformities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de fotos de inspeção
CREATE TABLE IF NOT EXISTS inspection_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE,
  nonconformity_id uuid REFERENCES nonconformities(id) ON DELETE SET NULL,
  category text NOT NULL,
  caption text NOT NULL,
  photo_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS users_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'technician',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonconformities ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas para clientes
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

-- Criar políticas para inspeções
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

-- Criar políticas para telhas de inspeção
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

-- Criar políticas para não conformidades
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

-- Criar políticas para fotos de inspeção
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

-- Criar políticas para perfis de usuários
CREATE POLICY "Users can read own profile"
  ON users_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    NOT EXISTS (
      SELECT 1 FROM users_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile"
  ON users_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON users_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Criar índices
CREATE INDEX clients_name_idx ON clients(name);
CREATE INDEX inspections_client_id_idx ON inspections(client_id);
CREATE INDEX inspections_status_idx ON inspections(status);
CREATE INDEX inspection_tiles_inspection_id_idx ON inspection_tiles(inspection_id);
CREATE INDEX nonconformities_inspection_id_idx ON nonconformities(inspection_id);
CREATE INDEX inspection_photos_inspection_id_idx ON inspection_photos(inspection_id);
CREATE INDEX inspection_photos_nonconformity_id_idx ON inspection_photos(nonconformity_id);
CREATE INDEX users_profiles_user_id_idx ON users_profiles(user_id);

-- Criar função para atualização automática do timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualização automática do timestamp
CREATE TRIGGER update_users_profiles_updated_at
  BEFORE UPDATE ON users_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 