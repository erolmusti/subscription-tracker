/*
  # Create push tokens table

  1. New Tables
    - `push_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `token` (text, FCM/APNS push token)
      - `platform` (text, device platform: ios/android/web)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

  2. Security
    - Enable RLS on `push_tokens` table
    - Add policy for users to manage their own push tokens only
*/

-- Create push_tokens table
CREATE TABLE IF NOT EXISTS push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, token, platform)
);

-- Enable Row Level Security
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own push tokens"
  ON push_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push tokens"
  ON push_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push tokens"
  ON push_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own push tokens"
  ON push_tokens
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS push_tokens_user_id_idx ON push_tokens(user_id);
CREATE INDEX IF NOT EXISTS push_tokens_token_idx ON push_tokens(token);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_push_tokens_updated_at
  BEFORE UPDATE ON push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();