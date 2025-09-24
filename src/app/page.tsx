/**
 * Home page component
 * @fileoverview Landing page with hero section and feature highlights
 */

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Feature data for the landing page
 * @description Defines the key features to highlight
 */
const features = [
  {
    title: 'AI Integration',
    description: 'Seamlessly integrate with OpenAI, Claude, and Google AI for powerful conversational experiences.',
    icon: '🤖',
  },
  {
    title: 'Secure Authentication',
    description: 'Built-in authentication with Clerk, featuring JWT tokens and role-based access control.',
    icon: '🔐',
  },
  {
    title: 'Modern UI',
    description: 'Beautiful, responsive interface built with Tailwind CSS and Radix UI components.',
    icon: '🎨',
  },
  {
    title: 'Real-time Database',
    description: 'PostgreSQL database with Drizzle ORM for type-safe database operations.',
    icon: '🗄️',
  },
  {
    title: 'API-First Design',
    description: 'Comprehensive REST API with proper error handling and documentation.',
    icon: '🔌',
  },
  {
    title: 'Docker Ready',
    description: 'Containerized deployment with multi-stage Docker builds for production.',
    icon: '🐳',
  },
]

/**
 * Home page component
 * @description Main landing page with hero section and feature grid
 * @returns JSX element
 */
export default function HomePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard')
    }
  }, [user, isLoaded, router])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl gradient-text">
              PAAM FullStack
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive full-stack Next.js application with AI integration, 
              modern authentication, and beautiful UI components. Built for developers 
              who want to ship fast and scale efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to build modern applications
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our full-stack template includes all the essential features and 
              integrations you need to build production-ready applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-muted/50">
        <div className="container">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing 
              applications with our full-stack template.
            </p>
            <Button asChild size="lg">
              <Link href="/sign-up">
                Start Building Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Built with ❤️ using Next.js, TypeScript, and modern web technologies.
            </p>
            <p className="mt-2">
              © 2024 PAAM FullStack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
