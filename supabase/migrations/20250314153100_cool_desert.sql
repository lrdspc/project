/*
  # Fix users_profiles RLS policies - Final Solution

  1. Changes
    - Drop all existing policies to start fresh
    - Create a single SELECT policy that allows authenticated users to read all profiles
    - Keep strict INSERT and UPDATE policies for user's own profile
    - Simplify policy logic to avoid recursion issues

  2. Security
    - Users can read all profiles (needed for user interface)
    - Users can only insert their own profile
    - Users can only update their own profile
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;

-- Create new simplified policies
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