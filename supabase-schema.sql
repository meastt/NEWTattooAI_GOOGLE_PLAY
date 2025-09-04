-- User Credits Table
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  credits INTEGER NOT NULL DEFAULT 5,
  exports_used INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);

-- Enable Row Level Security
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create a policy for anonymous access (since we're using anonymous users)
CREATE POLICY "Allow all operations for user_credits" ON user_credits
  FOR ALL USING (true);

-- Function to update the last_updated timestamp
CREATE OR REPLACE FUNCTION update_user_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update last_updated
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits_updated_at();

-- Insert some sample data (optional)
INSERT INTO user_credits (user_id, credits, exports_used, is_premium) VALUES 
  ('sample_user_1', 5, 0, false),
  ('sample_user_premium', 999, 0, true)
ON CONFLICT (user_id) DO NOTHING;