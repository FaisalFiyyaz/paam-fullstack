/**
 * Database schema definitions using Drizzle ORM
 * @fileoverview Defines all database tables and relationships for the PAAM application
 */

import { pgTable, text, timestamp, uuid, boolean, integer, jsonb, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Users table - stores user profile information
 * @description Extends Clerk authentication with additional user data
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  displayName: varchar('display_name', { length: 255 }),
  bio: text('bio'),
  profileImageUrl: text('profile_image_url'),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).notNull().default('free'),
  preferences: jsonb('preferences').$type<{
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
  }>().default({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: true
  }),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at')
})

/**
 * AI Conversations table - stores chat conversations with AI
 * @description Tracks user interactions with different AI providers
 */
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // 'openai', 'anthropic', 'google'
  model: varchar('model', { length: 100 }).notNull(),
  systemPrompt: text('system_prompt'),
  totalTokens: integer('total_tokens').default(0),
  totalCost: integer('total_cost').default(0), // in cents
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at')
})

/**
 * AI Messages table - stores individual messages in conversations
 * @description Stores both user messages and AI responses
 */
export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // 'user', 'assistant', 'system'
  content: text('content').notNull(),
  tokens: integer('tokens').default(0),
  cost: integer('cost').default(0), // in cents
  metadata: jsonb('metadata').$type<{
    model?: string
    temperature?: number
    maxTokens?: number
    finishReason?: string
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

/**
 * API Keys table - stores user's API keys for different services
 * @description Securely stores encrypted API keys for third-party services
 */
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  service: varchar('service', { length: 50 }).notNull(), // 'openai', 'anthropic', 'google'
  keyName: varchar('key_name', { length: 255 }).notNull(),
  encryptedKey: text('encrypted_key').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at')
})

/**
 * User Activity Logs table - tracks user actions
 * @description Audit trail for user activities and system events
 */
export const userActivityLogs = pgTable('user_activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

/**
 * System Settings table - stores application configuration
 * @description Global settings and feature flags
 */
export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(aiConversations),
  apiKeys: many(apiKeys),
  activityLogs: many(userActivityLogs)
}))

export const aiConversationsRelations = relations(aiConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id]
  }),
  messages: many(aiMessages)
}))

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id]
  })
}))

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id]
  })
}))

export const userActivityLogsRelations = relations(userActivityLogs, ({ one }) => ({
  user: one(users, {
    fields: [userActivityLogs.userId],
    references: [users.id]
  })
}))

// Export types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type AIConversation = typeof aiConversations.$inferSelect
export type NewAIConversation = typeof aiConversations.$inferInsert
export type AIMessage = typeof aiMessages.$inferSelect
export type NewAIMessage = typeof aiMessages.$inferInsert
export type APIKey = typeof apiKeys.$inferSelect
export type NewAPIKey = typeof apiKeys.$inferInsert
export type UserActivityLog = typeof userActivityLogs.$inferSelect
export type NewUserActivityLog = typeof userActivityLogs.$inferInsert
export type SystemSetting = typeof systemSettings.$inferSelect
export type NewSystemSetting = typeof systemSettings.$inferInsert
