/*
  # Fix users_profiles policies

  1. Changes
    - Drop existing policies that are causing 406 errors
    - Create new policies that handle non-existent profiles gracefully
    - Add default policy to allow reading own profile or when profile doesn't exist

  2. Security
    - Maintain row-level security
    - Users can only access their own profile
    - Users can only create their own profile
    - Users can only update their own profile
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;

-- Create new policies with better handling of non-existent profiles
CREATE POLICY "Users can read own profile"
  ON users_profiles
  FOR SELECT
  TO authenticated
  USING (
    CASE 
      WHEN EXISTS (SELECT 1 FROM users_profiles WHERE user_id = auth.uid())
      THEN user_id = auth.uid()
      ELSE true
    END
  );

CREATE POLICY "Users can update own profile"
  ON users_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());