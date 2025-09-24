/**
 * Global type definitions for the PAAM FullStack application
 * @fileoverview Centralized type definitions for better type safety and consistency
 */

// import { User } from '@clerk/nextjs/server'

/**
 * User profile interface extending Clerk's User type
 * @interface UserProfile
 */
export interface UserProfile {
  /** User's preferred display name */
  displayName?: string
  /** User's bio or description */
  bio?: string
  /** User's profile image URL */
  profileImageUrl?: string
  /** User's role in the system */
  role: UserRole
  /** User's subscription tier */
  subscriptionTier: SubscriptionTier
  /** User's preferences */
  preferences: UserPreferences
}

/**
 * User roles in the system
 * @enum {string}
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  PREMIUM = 'premium'
}

/**
 * Subscription tiers available
 * @enum {string}
 */
export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

/**
 * User preferences interface
 * @interface UserPreferences
 */
export interface UserPreferences {
  /** User's theme preference */
  theme: 'light' | 'dark' | 'system'
  /** User's language preference */
  language: string
  /** User's timezone */
  timezone: string
  /** Email notification preferences */
  emailNotifications: boolean
  /** Push notification preferences */
  pushNotifications: boolean
}

/**
 * AI Provider types
 * @enum {string}
 */
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google'
}

/**
 * AI Model configuration
 * @interface AIModel
 */
export interface AIModel {
  /** Model identifier */
  id: string
  /** Model name */
  name: string
  /** AI provider */
  provider: AIProvider
  /** Model description */
  description: string
  /** Maximum tokens for this model */
  maxTokens: number
  /** Cost per token */
  costPerToken: number
  /** Whether model is available */
  isAvailable: boolean
}

/**
 * API Response wrapper
 * @interface ApiResponse
 * @template T - The data type being returned
 */
export interface ApiResponse<T = any> {
  /** Whether the request was successful */
  success: boolean
  /** Response data */
  data?: T
  /** Error message if request failed */
  error?: string
  /** Additional metadata */
  metadata?: {
    /** Total count for paginated responses */
    total?: number
    /** Current page for paginated responses */
    page?: number
    /** Items per page for paginated responses */
    limit?: number
  }
}

/**
 * Pagination parameters
 * @interface PaginationParams
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page: number
  /** Items per page */
  limit: number
  /** Sort field */
  sortBy?: string
  /** Sort direction */
  sortOrder?: 'asc' | 'desc'
}

/**
 * Database entity with common fields
 * @interface BaseEntity
 */
export interface BaseEntity {
  /** Unique identifier */
  id: string
  /** Creation timestamp */
  createdAt: Date
  /** Last update timestamp */
  updatedAt: Date
  /** Soft delete flag */
  deletedAt?: Date
}

/**
 * CORS configuration
 * @interface CorsConfig
 */
export interface CorsConfig {
  /** Allowed origins */
  origins: string[]
  /** Allowed methods */
  methods: string[]
  /** Allowed headers */
  headers: string[]
  /** Whether credentials are allowed */
  credentials: boolean
}
