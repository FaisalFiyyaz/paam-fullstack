/**
 * Sign-up page component
 * @fileoverview User registration page with Clerk authentication
 */

import { SignUp } from '@clerk/nextjs'

/**
 * Generate static params for dynamic routes
 * @description Required for static export
 * @returns Promise<Array<{ 'sign-up': string[] }>>
 */
export async function generateStaticParams() {
  return [
    { 'sign-up': [] },
    { 'sign-up': ['sign-up'] }
  ]
}

/**
 * Sign-up page component
 * @description Handles user registration with Clerk
 * @returns JSX element
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-2">
            Join PAAM FullStack and start building amazing applications
          </p>
        </div>
        <SignUp 
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
