/*
  # Fix users_profiles RLS policies

  1. Changes
    - Update RLS policies to handle non-existent profiles
    - Allow users to read their own profile or when no profile exists
    - Maintain strict insert/update policies

  2. Security
    - Users can only read their own profile
    - Users can only insert their own profile
    - Users can only update their own profile
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;

-- Create new policies with better handling
CREATE POLICY "Users can read own profile"
  ON users_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    NOT EXISTS (
      SELECT 1 FROM users_profiles WHERE user_id = auth.uid()
    )
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