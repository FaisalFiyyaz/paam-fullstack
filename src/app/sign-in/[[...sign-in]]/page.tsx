/**
 * Sign-in page component
 * @fileoverview User login page with Clerk authentication
 */

import { SignIn } from '@clerk/nextjs'

/**
 * Generate static params for dynamic routes
 * @description Required for static export
 * @returns Promise<Array<{ 'sign-in': string[] }>>
 */
export async function generateStaticParams() {
  return [
    { 'sign-in': [] },
    { 'sign-in': ['sign-in'] }
  ]
}

/**
 * Sign-in page component
 * @description Handles user authentication with Clerk
 * @returns JSX element
 */
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your PAAM FullStack account
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              card: 'bg-card border-border',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'border-border hover:bg-accent',
              socialButtonsBlockButtonText: 'text-foreground',
              formFieldInput: 'border-input bg-background',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
          }}
        />
      </div>
    </div>
  )
}
