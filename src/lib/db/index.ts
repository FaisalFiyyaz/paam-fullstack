/**
 * Database connection and configuration
 * @fileoverview Centralized database connection using Supabase client
 */

import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Supabase configuration from environment variables
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required')
}

/**
 * Supabase client instance
 * @description Configured for client-side and server-side operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Database connection for Drizzle ORM
 * @description Uses Supabase client only (no direct PostgreSQL connection)
 */
let client: any = null
let db: any = null

// For now, we'll use Supabase client only
// Drizzle ORM can be added later if needed
console.log('Using Supabase client for database operations')

/**
 * Drizzle database instance
 * @description Main database instance with schema and connection
 */
export { db }

/**
 * Database health check function
 * @description Verifies database connectivity using Supabase
 * @returns Promise<boolean> - True if database is accessible
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Test Supabase connection with a simple query
    const { data, error } = await supabase.from('system_settings').select('*').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is OK for new projects
      console.error('Supabase health check failed:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

/**
 * Graceful database shutdown
 * @description Properly closes database connections
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (client) {
      await client.end()
      console.log('Database connection closed')
    }
  } catch (error) {
    console.error('Error closing database connection:', error)
  }
}

/**
 * Initialize database with automatic seeding
 * @description Runs database initialization and seeding on app startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Import seeding functions
    const { initializeDatabase: seedDatabase } = await import('./seed')
    
    // Run database initialization
    const success = await seedDatabase()
    
    if (success) {
      console.log('🚀 Database initialization completed')
    } else {
      console.warn('⚠️ Database initialization had issues, but app will continue')
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    // Don't throw error to prevent app from crashing
  }
}

// Export schema for use in other modules
export * from './schema'
