/**
 * Health check API endpoint
 * @fileoverview Provides system health status and database connectivity
 */

import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db'
import type { ApiResponse } from '@/types'

/**
 * Health check response interface
 * @interface HealthCheckResponse
 */
interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  database: boolean
  environment: string
  version: string
}

/**
 * GET /api/health
 * @description Returns system health status
 * @returns Promise<NextResponse<ApiResponse<HealthCheckResponse>>>
 */
export async function GET(): Promise<NextResponse<ApiResponse<HealthCheckResponse>>> {
  try {
    const startTime = Date.now()
    
    // Check database connectivity
    const isDatabaseHealthy = await checkDatabaseHealth()
    
    const response: HealthCheckResponse = {
      status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: isDatabaseHealthy,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    }

    const apiResponse: ApiResponse<HealthCheckResponse> = {
      success: true,
      data: response,
      metadata: {
        total: 1,
        page: 1,
        limit: 1,
      },
    }

    return NextResponse.json(apiResponse, {
      status: isDatabaseHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    const apiResponse: ApiResponse<HealthCheckResponse> = {
      success: false,
      error: 'Health check failed',
    }

    return NextResponse.json(apiResponse, { status: 503 })
  }
}
