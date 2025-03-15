/*
  # Add username and budget initialization fields

  1. Changes
    - Add username column to users table with temporary NULL constraint
    - Add is_initialized column to budgets table
    - Update existing constraints and policies

  2. Security
    - Maintain existing RLS policies
    - Add policy for username access
*/

-- Add username column initially allowing NULL
ALTER TABLE users ADD COLUMN username text;

-- Add is_initialized column to budgets table
ALTER TABLE budgets ADD COLUMN is_initialized boolean DEFAULT false;

-- Update any existing users to have a default username based on their email
UPDATE users 
SET username = SPLIT_PART(email, '@', 1)
WHERE username IS NULL;

-- Now make username NOT NULL after setting defaults
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Update RLS policies to include new fields
CREATE POLICY "Users can read own username"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Add unique constraint on username
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);