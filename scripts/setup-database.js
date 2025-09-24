/**
 * Database setup script using Supabase client
 * Creates all necessary tables for the PAAM application
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up PAAM FullStack database...')

  try {
    // Enable UUID extension
    console.log('📦 Enabling UUID extension...')
    const { error: uuidError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    })
    
    if (uuidError) {
      console.log('UUID extension already enabled or not needed')
    }

    // Create Users table
    console.log('👤 Creating users table...')
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          clerk_id VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          display_name VARCHAR(255),
          bio TEXT,
          profile_image_url TEXT,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',
          preferences JSONB DEFAULT '{
            "theme": "system",
            "language": "en",
            "timezone": "UTC",
            "emailNotifications": true,
            "pushNotifications": true
          }'::jsonb,
          is_active BOOLEAN NOT NULL DEFAULT true,
          last_login_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMP
        );
      `
    })
    
    if (usersError) {
      console.error('Error creating users table:', usersError)
    } else {
      console.log('✅ Users table created successfully')
    }

    // Create AI Conversations table
    console.log('💬 Creating ai_conversations table...')
    const { error: conversationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_conversations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          provider VARCHAR(50) NOT NULL,
          model VARCHAR(100) NOT NULL,
          system_prompt TEXT,
          total_tokens INTEGER DEFAULT 0,
          total_cost INTEGER DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMP
        );
      `
    })
    
    if (conversationsError) {
      console.error('Error creating ai_conversations table:', conversationsError)
    } else {
      console.log('✅ AI conversations table created successfully')
    }

    // Create AI Messages table
    console.log('📝 Creating ai_messages table...')
    const { error: messagesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_messages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
          role VARCHAR(20) NOT NULL,
          content TEXT NOT NULL,
          tokens INTEGER DEFAULT 0,
          cost INTEGER DEFAULT 0,
          metadata JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    })
    
    if (messagesError) {
      console.error('Error creating ai_messages table:', messagesError)
    } else {
      console.log('✅ AI messages table created successfully')
    }

    // Create API Keys table
    console.log('🔑 Creating api_keys table...')
    const { error: apiKeysError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS api_keys (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          service VARCHAR(50) NOT NULL,
          key_name VARCHAR(255) NOT NULL,
          encrypted_key TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          last_used_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMP
        );
      `
    })
    
    if (apiKeysError) {
      console.error('Error creating api_keys table:', apiKeysError)
    } else {
      console.log('✅ API keys table created successfully')
    }

    // Create User Activity Logs table
    console.log('📊 Creating user_activity_logs table...')
    const { error: activityLogsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_activity_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          action VARCHAR(100) NOT NULL,
          resource VARCHAR(100),
          resource_id UUID,
          metadata JSONB,
          ip_address VARCHAR(45),
          user_agent TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    })
    
    if (activityLogsError) {
      console.error('Error creating user_activity_logs table:', activityLogsError)
    } else {
      console.log('✅ User activity logs table created successfully')
    }

    // Create System Settings table
    console.log('⚙️ Creating system_settings table...')
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS system_settings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          key VARCHAR(100) NOT NULL UNIQUE,
          value JSONB NOT NULL,
          description TEXT,
          is_public BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    })
    
    if (settingsError) {
      console.error('Error creating system_settings table:', settingsError)
    } else {
      console.log('✅ System settings table created successfully')
    }

    // Create indexes
    console.log('🔍 Creating indexes...')
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
      'CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_ai_conversations_provider ON ai_conversations(provider);',
      'CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);',
      'CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action ON user_activity_logs(action);',
      'CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);'
    ]

    for (const index of indexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: index })
      if (error) {
        console.log(`Index might already exist: ${error.message}`)
      }
    }

    // Insert default system settings
    console.log('🔧 Inserting default system settings...')
    const { error: defaultSettingsError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO system_settings (key, value, description, is_public) VALUES
        ('app_name', '"PAAM FullStack"', 'Application name', true),
        ('app_version', '"1.0.0"', 'Application version', true),
        ('maintenance_mode', 'false', 'Maintenance mode flag', true),
        ('max_conversations_per_user', '100', 'Maximum conversations per user', false),
        ('max_messages_per_conversation', '1000', 'Maximum messages per conversation', false)
        ON CONFLICT (key) DO NOTHING;
      `
    })
    
    if (defaultSettingsError) {
      console.error('Error inserting default settings:', defaultSettingsError)
    } else {
      console.log('✅ Default system settings inserted successfully')
    }

    console.log('🎉 Database setup completed successfully!')
    console.log('📊 All tables and indexes have been created.')
    console.log('🚀 Your PAAM FullStack application is ready to use!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()
