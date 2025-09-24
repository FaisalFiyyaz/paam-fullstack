/**
 * Root layout component
 * @fileoverview Main layout wrapper with Clerk provider and global styles
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import DatabaseInitializer from '@/components/database-initializer'
import './globals.css'

/**
 * Inter font configuration
 * @description Google Fonts Inter for consistent typography
 */
const inter = Inter({ subsets: ['latin'] })

/**
 * Application metadata
 * @description SEO and app configuration
 */
export const metadata: Metadata = {
  title: {
    default: 'PAAM FullStack - AI-Powered Application',
    template: '%s | PAAM FullStack'
  },
  description: 'A comprehensive full-stack Next.js application with AI integration, authentication, and modern UI components.',
  keywords: ['Next.js', 'React', 'TypeScript', 'AI', 'Authentication', 'Full-stack'],
  authors: [{ name: 'PAAM Team' }],
  creator: 'PAAM Development Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'PAAM FullStack - AI-Powered Application',
    description: 'A comprehensive full-stack Next.js application with AI integration, authentication, and modern UI components.',
    siteName: 'PAAM FullStack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAAM FullStack - AI-Powered Application',
    description: 'A comprehensive full-stack Next.js application with AI integration, authentication, and modern UI components.',
    creator: '@paamdev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

/**
 * Root layout component
 * @description Wraps the entire application with providers and global styles
 * @param children - Child components to render
 * @returns JSX element
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
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
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <DatabaseInitializer />
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
