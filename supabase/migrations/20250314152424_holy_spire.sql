/*
  # Fix users_profiles policies

  1. Changes
    - Drop existing policies that are causing infinite recursion
    - Create new simplified policies with proper access control
    - Ensure policies don't create recursive checks
  
  2. Security
    - Users can read their own profile
    - Users can update their own profile
    - Users can insert their own profile
    - All operations are properly scoped to the authenticated user
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
  USING (user_id = auth.uid());

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