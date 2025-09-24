/**
 * Create database tables using Supabase client
 * This script uses the Supabase REST API to create tables
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

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🚀 Creating database tables using Supabase...')
  
  try {
    // Test connection first
    console.log('🔍 Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('pg_tables')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.log('Connection test result:', testError.message)
    } else {
      console.log('✅ Supabase connection successful')
    }

    // Since we can't create tables directly via the client,
    // let's provide the SQL script and instructions
    console.log('')
    console.log('📋 Database Setup Instructions:')
    console.log('================================')
    console.log('')
    console.log('1. Go to your Supabase Dashboard:')
    console.log('   https://supabase.com/dashboard')
    console.log('')
    console.log('2. Select your project')
    console.log('')
    console.log('3. Go to SQL Editor (in the left sidebar)')
    console.log('')
    console.log('4. Click "New Query"')
    console.log('')
    console.log('5. Copy and paste the following SQL:')
    console.log('')
    console.log('-- PAAM FullStack Database Schema')
    console.log('-- Enable UUID extension')
    console.log('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    console.log('')
    console.log('-- Users table')
    console.log('CREATE TABLE IF NOT EXISTS users (')
    console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
    console.log('  clerk_id VARCHAR(255) NOT NULL UNIQUE,')
    console.log('  email VARCHAR(255) NOT NULL UNIQUE,')
    console.log('  first_name VARCHAR(100),')
    console.log('  last_name VARCHAR(100),')
    console.log('  display_name VARCHAR(255),')
    console.log('  bio TEXT,')
    console.log('  profile_image_url TEXT,')
    console.log('  role VARCHAR(50) NOT NULL DEFAULT \'user\',')
    console.log('  subscription_tier VARCHAR(50) NOT NULL DEFAULT \'free\',')
    console.log('  preferences JSONB DEFAULT \'{"theme": "system", "language": "en", "timezone": "UTC", "emailNotifications": true, "pushNotifications": true}\'::jsonb,')
    console.log('  is_active BOOLEAN NOT NULL DEFAULT true,')
    console.log('  last_login_at TIMESTAMP,')
    console.log('  created_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  deleted_at TIMESTAMP')
    console.log(');')
    console.log('')
    console.log('-- AI Conversations table')
    console.log('CREATE TABLE IF NOT EXISTS ai_conversations (')
    console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
    console.log('  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,')
    console.log('  title VARCHAR(255) NOT NULL,')
    console.log('  provider VARCHAR(50) NOT NULL,')
    console.log('  model VARCHAR(100) NOT NULL,')
    console.log('  system_prompt TEXT,')
    console.log('  total_tokens INTEGER DEFAULT 0,')
    console.log('  total_cost INTEGER DEFAULT 0,')
    console.log('  is_active BOOLEAN NOT NULL DEFAULT true,')
    console.log('  created_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  deleted_at TIMESTAMP')
    console.log(');')
    console.log('')
    console.log('-- AI Messages table')
    console.log('CREATE TABLE IF NOT EXISTS ai_messages (')
    console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
    console.log('  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,')
    console.log('  role VARCHAR(20) NOT NULL,')
    console.log('  content TEXT NOT NULL,')
    console.log('  tokens INTEGER DEFAULT 0,')
    console.log('  cost INTEGER DEFAULT 0,')
    console.log('  metadata JSONB,')
    console.log('  created_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  updated_at TIMESTAMP NOT NULL DEFAULT NOW()')
    console.log(');')
    console.log('')
    console.log('-- API Keys table')
    console.log('CREATE TABLE IF NOT EXISTS api_keys (')
    console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
    console.log('  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,')
    console.log('  service VARCHAR(50) NOT NULL,')
    console.log('  key_name VARCHAR(255) NOT NULL,')
    console.log('  encrypted_key TEXT NOT NULL,')
    console.log('  is_active BOOLEAN NOT NULL DEFAULT true,')
    console.log('  last_used_at TIMESTAMP,')
    console.log('  created_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  deleted_at TIMESTAMP')
    console.log(');')
    console.log('')
    console.log('-- User Activity Logs table')
    console.log('CREATE TABLE IF NOT EXISTS user_activity_logs (')
    console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
    console.log('  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,')
    console.log('  action VARCHAR(100) NOT NULL,')
    console.log('  resource VARCHAR(100),')
    console.log('  resource_id UUID,')
    console.log('  metadata JSONB,')
    console.log('  ip_address VARCHAR(45),')
    console.log('  user_agent TEXT,')
    console.log('  created_at TIMESTAMP NOT NULL DEFAULT NOW()')
    console.log(');')
    console.log('')
    console.log('-- System Settings table')
    console.log('CREATE TABLE IF NOT EXISTS system_settings (')
    console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
    console.log('  key VARCHAR(100) NOT NULL UNIQUE,')
    console.log('  value JSONB NOT NULL,')
    console.log('  description TEXT,')
    console.log('  is_public BOOLEAN NOT NULL DEFAULT false,')
    console.log('  created_at TIMESTAMP NOT NULL DEFAULT NOW(),')
    console.log('  updated_at TIMESTAMP NOT NULL DEFAULT NOW()')
    console.log(');')
    console.log('')
    console.log('6. Click "Run" to execute the SQL')
    console.log('')
    console.log('7. Verify tables are created in the Table Editor')
    console.log('')
    console.log('🎉 Your database will be ready!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createTables()
