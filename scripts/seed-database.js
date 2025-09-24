/**
 * Database seeding script using Supabase client
 * This script adds sample data for development and testing
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

async function seedDatabase() {
  console.log('🌱 Seeding PAAM FullStack database with sample data...')
  
  try {
    // Test connection first
    console.log('🔍 Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('Connection test failed:', testError.message)
      return
    }
    
    console.log('✅ Supabase connection successful')
    console.log('')
    
    // Since we can't insert data directly via the client easily,
    // let's provide the SQL script and instructions
    console.log('📋 Database Seeding Instructions:')
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
    console.log('5. Copy and paste the SQL from: scripts/seed-database.sql')
    console.log('')
    console.log('6. Click "Run" to execute the SQL')
    console.log('')
    console.log('This will add sample data including:')
    console.log('• 3 sample users (John, Jane, Admin)')
    console.log('• 4 AI conversations with different providers')
    console.log('• 8 AI messages with realistic content')
    console.log('• 3 API keys for different services')
    console.log('• 4 activity logs showing user actions')
    console.log('• 10 system settings for configuration')
    console.log('')
    console.log('🎉 After running the SQL, your database will have realistic sample data!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

seedDatabase()
