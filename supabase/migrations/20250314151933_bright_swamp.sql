/*
  # Fix users_profiles policies

  1. Changes
    - Drop existing policies that are causing infinite recursion
    - Create new simplified policies for users_profiles table
    - Ensure policies are non-recursive and efficient

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