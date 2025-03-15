/*
  # Fix RLS policies for user creation

  1. Changes
    - Update RLS policies to allow user creation during sign up
    - Maintain security while allowing necessary operations

  2. Security
    - Allow authenticated users to manage their own data
    - Allow new user creation during sign up
    - Prevent unauthorized access
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can manage their own data" ON users;
DROP POLICY IF EXISTS "Users can read own username" ON users;

-- Create comprehensive policies for user management
CREATE POLICY "Enable insert for authentication" 
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for authenticated users" 
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" 
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;