/**
 * Database initializer component
 * @description Automatically initializes database with seeding on app startup
 */

'use client'

import { useEffect, useState } from 'react'

/**
 * Database initializer component
 * @description Runs database initialization when the app starts
 * @returns JSX element
 */
export default function DatabaseInitializer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip database initialization for static export
    console.log('📦 Static export mode - skipping database initialization')
    setIsInitialized(true)
    setIsLoading(false)
  }, [])

  // This component doesn't render anything visible
  return null
}
