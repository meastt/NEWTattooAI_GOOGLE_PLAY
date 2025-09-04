-- Subscription System Database Schema
-- This file contains the SQL schema for the subscription system tables

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    subscription_status TEXT NOT NULL CHECK (subscription_status IN ('FREE', 'QUICK_SPARK', 'DEEP_DIVE', 'EXPIRED')),
    current_free_credits INTEGER NOT NULL DEFAULT 5,
    current_subscription_credits INTEGER NOT NULL DEFAULT 0,
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    last_credit_reset_date TIMESTAMP WITH TIME ZONE,
    product_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON user_subscriptions(is_active);

-- Subscription Plans Table (for reference)
CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly')),
    credits INTEGER NOT NULL,
    product_id TEXT NOT NULL UNIQUE,
    description TEXT,
    features JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price, period, credits, product_id, description, features) VALUES
('quick-spark', 'Quick Spark', 4.99, 'weekly', 30, 'com.tattooai.quickspark.weekly', 'Perfect for trying out new designs', '["30 AI generations per week", "Unlimited exports & downloads", "Priority support", "Advanced AI models"]'),
('deep-dive', 'Deep Dive', 12.99, 'monthly', 120, 'com.tattooai.deepdive.monthly', 'For serious tattoo enthusiasts', '["120 AI generations per month", "Unlimited exports & downloads", "Priority support", "Advanced AI models", "Early access to new features"]')
ON CONFLICT (id) DO NOTHING;

-- Apple IAP Transactions Table (for tracking purchases)
CREATE TABLE IF NOT EXISTS iap_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    transaction_id TEXT NOT NULL UNIQUE,
    original_transaction_id TEXT,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiration_date TIMESTAMP WITH TIME ZONE,
    is_trial_period BOOLEAN NOT NULL DEFAULT FALSE,
    is_upgraded BOOLEAN NOT NULL DEFAULT FALSE,
    is_renewed BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL CHECK (status IN ('PURCHASED', 'RENEWED', 'CANCELLED', 'EXPIRED', 'REFUNDED')),
    receipt_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for IAP transactions
CREATE INDEX IF NOT EXISTS idx_iap_transactions_user_id ON iap_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_iap_transactions_product_id ON iap_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_iap_transactions_transaction_id ON iap_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_iap_transactions_status ON iap_transactions(status);

-- Credit Usage Log Table (for analytics and debugging)
CREATE TABLE IF NOT EXISTS credit_usage_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    credit_type TEXT NOT NULL CHECK (credit_type IN ('FREE', 'SUBSCRIPTION')),
    action TEXT NOT NULL CHECK (action IN ('GENERATE', 'EXPORT', 'RESET', 'PURCHASE')),
    credits_used INTEGER NOT NULL DEFAULT 1,
    credits_remaining INTEGER NOT NULL,
    subscription_plan TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for credit usage log
CREATE INDEX IF NOT EXISTS idx_credit_usage_user_id ON credit_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created_at ON credit_usage_log(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_usage_action ON credit_usage_log(action);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iap_transactions_updated_at BEFORE UPDATE ON iap_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies (if using Supabase Auth)
-- Uncomment these if you're using Supabase Auth and want to enable RLS

-- ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE iap_transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE credit_usage_log ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
--     FOR SELECT USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
--     FOR UPDATE USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can view their own transactions" ON iap_transactions
--     FOR SELECT USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can view their own credit usage" ON credit_usage_log
--     FOR SELECT USING (auth.uid()::text = user_id);
