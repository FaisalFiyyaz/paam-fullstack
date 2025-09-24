-- Database initialization script for PAAM FullStack
-- This script sets up the initial database configuration

-- Create database if it doesn't exist
-- (This is handled by Docker, but included for reference)

-- Set up extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ai_provider AS ENUM ('openai', 'anthropic', 'google');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Set up row level security (RLS) policies
-- This will be configured after tables are created by Drizzle

-- Create indexes for better performance
-- These will be created by Drizzle migrations, but we can add custom ones here

-- Insert initial system settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_version', '"1.0.0"', 'Current application version', true),
('maintenance_mode', 'false', 'Whether the application is in maintenance mode', true),
('max_conversations_per_user', '100', 'Maximum number of conversations per user', false),
('max_messages_per_conversation', '1000', 'Maximum number of messages per conversation', false),
('default_ai_model', '"gpt-3.5-turbo"', 'Default AI model for new conversations', true),
('max_tokens_per_request', '4000', 'Maximum tokens per AI request', false)
ON CONFLICT (key) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
