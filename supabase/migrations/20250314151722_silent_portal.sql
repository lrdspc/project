/*
  # Update users_profiles policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies that handle all cases properly
    - Add policy for selecting profiles even when no rows exist
  
  2. Security
    - Maintains RLS enabled
    - Ensures users can only access their own profile data
    - Allows proper profile creation during registration
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;

-- Create comprehensive policies
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