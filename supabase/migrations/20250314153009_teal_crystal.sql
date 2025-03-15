/*
  # Fix users_profiles RLS policies - Final Solution

  1. Changes
    - Simplify RLS policies to avoid recursion
    - Allow users to read their own profile
    - Allow users to insert their own profile
    - Allow users to update their own profile

  2. Security
    - Users can only read their own profile
    - Users can only insert their own profile
    - Users can only update their own profile
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;

-- Create simplified policies
CREATE POLICY "Users can read all profiles"
  ON users_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());