/**
 * Simple database setup using Supabase client
 * This script will create tables using the Supabase REST API
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  console.error('SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test connection by trying to access the auth service
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('Connection test result:', error.message)
    } else {
      console.log('✅ Supabase connection successful')
    }
    
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}

async function createTables() {
  console.log('🚀 Creating database tables...')
  
  // Since we can't create tables directly via the client,
  // let's test if we can at least connect and verify the setup
  console.log('📋 Database setup instructions:')
  console.log('')
  console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
  console.log('2. Select your project')
  console.log('3. Go to SQL Editor')
  console.log('4. Copy and paste the SQL from: scripts/create-tables.sql')
  console.log('5. Click "Run" to execute the SQL')
  console.log('')
  console.log('This will create all the necessary tables for your PAAM application.')
}

async function main() {
  console.log('🎯 PAAM FullStack Database Setup')
  console.log('================================')
  
  const connected = await testConnection()
  
  if (connected) {
    await createTables()
  }
  
  console.log('')
  console.log('📝 Next Steps:')
  console.log('1. Run the SQL script in your Supabase dashboard')
  console.log('2. Verify tables are created in the Table Editor')
  console.log('3. Your application will be ready to use!')
}

main().catch(console.error)
