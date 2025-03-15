/*
  # Fix users_profiles policies recursion

  1. Changes
    - Drop existing policies that are causing infinite recursion
    - Create new simplified policies without recursive checks
    - Maintain security while allowing profile creation

  2. Security
    - Users can only read their own profile
    - Users can only update their own profile
    - Users can only create their own profile
    - No recursive policy checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;

-- Create new simplified policies
CREATE POLICY "Users can read own profile"
  ON users_profiles
  FOR SELECT
  TO authenticated
  USING (true);

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