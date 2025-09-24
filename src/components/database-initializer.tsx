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
    const initializeDatabase = async () => {
      try {
        // Call the initialization API
        const response = await fetch('/api/init', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const result = await response.json()

        if (result.success) {
          console.log('✅ Database initialization completed:', result.message)
          setIsInitialized(true)
        } else {
          console.warn('⚠️ Database initialization had issues:', result.message)
          setIsInitialized(false)
        }
      } catch (error) {
        console.error('❌ Database initialization failed:', error)
        setIsInitialized(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Only run initialization once
    if (!isInitialized && isLoading) {
      initializeDatabase()
    }
  }, [isInitialized, isLoading])

  // This component doesn't render anything visible
  return null
}
