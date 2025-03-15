/*
  # Add username and budget initialization fields

  1. Changes
    - Add username column to users table
    - Add is_initialized column to budgets table
    - Update existing constraints and policies

  2. Security
    - Maintain existing RLS policies
    - Add NOT NULL constraint for username
*/

-- Add username column to users table
ALTER TABLE users ADD COLUMN username text NOT NULL;

-- Add is_initialized column to budgets table
ALTER TABLE budgets ADD COLUMN is_initialized boolean DEFAULT false;

-- Update RLS policies to include new fields
CREATE POLICY "Users can read own username"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);