/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, subscription service name)
      - `amount` (numeric, subscription cost)
      - `frequency` (text, payment frequency: Weekly/Monthly/Yearly)
      - `first_payment_date` (date, initial payment date)
      - `next_payment` (date, calculated next payment date)
      - `color` (text, UI color for the subscription)
      - `category` (text, subscription category)
      - `note` (text, optional user notes)
      - `reminder_days` (integer, days before payment to remind)
      - `is_active` (boolean, whether subscription is active)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for users to read/write their own subscriptions only
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  frequency text NOT NULL CHECK (frequency IN ('Weekly', 'Monthly', 'Yearly')),
  first_payment_date date NOT NULL,
  next_payment date NOT NULL,
  color text NOT NULL DEFAULT '#6366f1',
  category text NOT NULL DEFAULT 'Diğer',
  note text DEFAULT '',
  reminder_days integer NOT NULL DEFAULT 3 CHECK (reminder_days >= 0 AND reminder_days <= 7),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_next_payment_idx ON subscriptions(next_payment);
CREATE INDEX IF NOT EXISTS subscriptions_is_active_idx ON subscriptions(is_active);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();