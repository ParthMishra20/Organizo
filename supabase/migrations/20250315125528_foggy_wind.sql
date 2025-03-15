/*
  # Fix Authentication and RLS Issues

  1. Changes
    - Drop and recreate RLS policies with proper permissions
    - Add policy for public user creation
    - Ensure proper authentication flow

  2. Security
    - Allow unauthenticated users to create accounts
    - Allow authenticated users to manage their own data
    - Maintain data isolation between users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;

-- Create new policies with proper permissions
CREATE POLICY "Allow public user creation"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;