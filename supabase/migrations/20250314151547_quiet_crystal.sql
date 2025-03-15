/*
  # Fix users_profiles RLS policies

  1. Changes
    - Add INSERT policy to allow new users to create their profile
    - Ensure proper RLS setup for user profile management

  2. Security
    - Users can only create their own profile
    - Users can only read and update their own profile
    - Maintains data isolation between users
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users_profiles'
  ) THEN
    DROP POLICY IF EXISTS "Users can read own profile" ON users_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
  END IF;
END $$;

-- Create comprehensive policies
CREATE POLICY "Users can read own profile"
  ON users_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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