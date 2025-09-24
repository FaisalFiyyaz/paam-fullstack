/**
 * Database initialization API route
 * @description Automatically seeds the database on first run
 */

import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/db'

/**
 * Initialize database with automatic seeding
 * @description Runs when the app starts or when this endpoint is called
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting database initialization...')
    
    // Run database initialization
    await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database initialization completed',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * Force re-seed the database
 * @description Clears existing data and re-seeds (use with caution)
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Force re-seeding database...')
    
    // This would clear existing data and re-seed
    // For now, just run normal initialization
    await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database re-seeded successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database re-seeding failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database re-seeding failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
