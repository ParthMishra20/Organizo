/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Clerk user ID
      - `email` (text, unique)
      - `created_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `description` (text)
      - `date` (date)
      - `priority` (enum: low, medium, high)
      - `completed` (boolean)
      - `created_at` (timestamp)

    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (enum: spend, receive, invest)
      - `amount` (numeric)
      - `description` (text)
      - `date` (date)
      - `tag` (enum: travel, food, light snacks, wants)
      - `created_at` (timestamp)

    - `budgets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `current_budget` (numeric)
      - `monthly_income` (numeric)
      - `last_updated` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE transaction_type AS ENUM ('spend', 'receive', 'invest');
CREATE TYPE transaction_tag AS ENUM ('travel', 'food', 'light snacks', 'wants');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  date date NOT NULL,
  priority priority_level NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  date date NOT NULL,
  tag transaction_tag,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  current_budget numeric(10,2) NOT NULL DEFAULT 0,
  monthly_income numeric(10,2) NOT NULL DEFAULT 0,
  last_updated date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own data"
  ON users
  FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can manage their own tasks"
  ON tasks
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budget"
  ON budgets
  FOR ALL
  USING (auth.uid() = user_id);