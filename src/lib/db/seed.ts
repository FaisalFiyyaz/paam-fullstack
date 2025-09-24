/**
 * Database seeding utility
 * Automatically seeds the database with sample data on first run
 */

import { createClient } from '@supabase/supabase-js'

// Create Supabase client for seeding
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration for seeding')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Check if database needs seeding
 * @returns Promise<boolean> - True if database is empty and needs seeding
 */
export async function needsSeeding(): Promise<boolean> {
  try {
    // Check if we have any users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (usersError) {
      console.error('Error checking users:', usersError)
      return false
    }

    // If no users exist, we need seeding
    return users.length === 0
  } catch (error) {
    console.error('Error checking if database needs seeding:', error)
    return false
  }
}

/**
 * Seed the database with sample data
 * @returns Promise<boolean> - True if seeding was successful
 */
export async function seedDatabase(): Promise<boolean> {
  try {
    console.log('🌱 Seeding database with sample data...')

    // Insert system settings (only if they don't exist)
    const { error: settingsError } = await supabase
      .from('system_settings')
      .insert([
        {
          key: 'app_name',
          value: 'PAAM FullStack',
          description: 'Application name',
          is_public: true
        },
        {
          key: 'app_version',
          value: '1.0.0',
          description: 'Application version',
          is_public: true
        },
        {
          key: 'maintenance_mode',
          value: false,
          description: 'Maintenance mode flag',
          is_public: true
        },
        {
          key: 'max_conversations_per_user',
          value: 100,
          description: 'Maximum conversations per user',
          is_public: false
        },
        {
          key: 'max_messages_per_conversation',
          value: 1000,
          description: 'Maximum messages per conversation',
          is_public: false
        },
        {
          key: 'default_ai_provider',
          value: 'openai',
          description: 'Default AI provider for new conversations',
          is_public: true
        },
        {
          key: 'supported_ai_providers',
          value: ['openai', 'anthropic', 'google'],
          description: 'List of supported AI providers',
          is_public: true
        },
        {
          key: 'default_ai_model',
          value: 'gpt-4',
          description: 'Default AI model for new conversations',
          is_public: true
        },
        {
          key: 'max_tokens_per_request',
          value: 4000,
          description: 'Maximum tokens per AI request',
          is_public: false
        },
        {
          key: 'rate_limit_per_hour',
          value: 100,
          description: 'Rate limit per user per hour',
          is_public: false
        }
      ])

    if (settingsError) {
      console.log('System settings already exist, skipping...')
    }

    // Insert sample users (only if they don't exist)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          clerk_id: 'user_2abc123def456ghi',
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          display_name: 'John Doe',
          bio: 'Full-stack developer passionate about AI and modern web technologies.',
          profile_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'user',
          subscription_tier: 'free',
          preferences: {
            theme: 'dark',
            language: 'en',
            timezone: 'America/New_York',
            emailNotifications: true,
            pushNotifications: true
          },
          is_active: true,
          last_login_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          clerk_id: 'user_2xyz789uvw012rst',
          email: 'jane.smith@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          display_name: 'Jane Smith',
          bio: 'AI researcher and machine learning engineer with expertise in NLP.',
          profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          role: 'user',
          subscription_tier: 'premium',
          preferences: {
            theme: 'light',
            language: 'en',
            timezone: 'Europe/London',
            emailNotifications: true,
            pushNotifications: false
          },
          is_active: true,
          last_login_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          clerk_id: 'user_2admin456super789',
          email: 'admin@paam.com',
          first_name: 'Admin',
          last_name: 'User',
          display_name: 'PAAM Admin',
          bio: 'System administrator for PAAM FullStack platform.',
          profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: 'admin',
          subscription_tier: 'enterprise',
          preferences: {
            theme: 'system',
            language: 'en',
            timezone: 'UTC',
            emailNotifications: true,
            pushNotifications: true
          },
          is_active: true,
          last_login_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ])
      .select('id')

    if (usersError) {
      console.log('Users already exist, skipping...')
    }

    // Insert sample AI conversations (only if they don't exist)
    const { error: conversationsError } = await supabase
      .from('ai_conversations')
      .insert([
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'React and Next.js Best Practices',
          provider: 'openai',
          model: 'gpt-4',
          system_prompt: 'You are a senior React developer with expertise in Next.js. Help me understand best practices for building scalable applications.',
          total_tokens: 1250,
          total_cost: 25,
          is_active: true
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440002',
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Database Design for E-commerce',
          provider: 'openai',
          model: 'gpt-4',
          system_prompt: 'You are a database architect. Help me design a scalable database schema for an e-commerce platform.',
          total_tokens: 2100,
          total_cost: 42,
          is_active: true
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440003',
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Machine Learning Model Evaluation',
          provider: 'anthropic',
          model: 'claude-3-sonnet',
          system_prompt: 'You are a machine learning expert. Help me understand how to properly evaluate ML models and avoid common pitfalls.',
          total_tokens: 1800,
          total_cost: 36,
          is_active: true
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440004',
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'API Security Best Practices',
          provider: 'google',
          model: 'gemini-pro',
          system_prompt: 'You are a cybersecurity expert. Help me understand API security best practices and common vulnerabilities.',
          total_tokens: 950,
          total_cost: 19,
          is_active: true
        }
      ])

    if (conversationsError) {
      console.log('Conversations already exist, skipping...')
    }

    // Insert sample AI messages (only if they don't exist)
    const { error: messagesError } = await supabase
      .from('ai_messages')
      .insert([
        {
          id: '770e8400-e29b-41d4-a716-446655440001',
          conversation_id: '660e8400-e29b-41d4-a716-446655440001',
          role: 'user',
          content: 'What are the best practices for state management in Next.js applications?',
          tokens: 25,
          cost: 1,
          metadata: {
            model: 'gpt-4',
            temperature: 0.7,
            max_tokens: 1000
          }
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440002',
          conversation_id: '660e8400-e29b-41d4-a716-446655440001',
          role: 'assistant',
          content: `For state management in Next.js applications, here are the key best practices:

1. **Server State vs Client State**: Use React Query or SWR for server state, and useState/useReducer for client state.

2. **Context API**: Use React Context for global state that doesn't change frequently (theme, user preferences).

3. **Zustand**: For complex client state, consider Zustand as a lightweight alternative to Redux.

4. **URL State**: Use URL search params for shareable state (filters, pagination).

5. **Local Storage**: Persist non-sensitive data like user preferences.

The key is to choose the right tool for the right job rather than using one solution for everything.`,
          tokens: 180,
          cost: 4,
          metadata: {
            model: 'gpt-4',
            temperature: 0.7,
            finish_reason: 'stop'
          }
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440003',
          conversation_id: '660e8400-e29b-41d4-a716-446655440001',
          role: 'user',
          content: 'How do I handle authentication state in Next.js?',
          tokens: 20,
          cost: 1,
          metadata: {
            model: 'gpt-4',
            temperature: 0.7,
            max_tokens: 1000
          }
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440004',
          conversation_id: '660e8400-e29b-41d4-a716-446655440001',
          role: 'assistant',
          content: `For authentication state in Next.js, here's the recommended approach:

1. **Use Auth Providers**: Integrate with providers like Clerk, Auth0, or NextAuth.js for production apps.

2. **Server Components**: Fetch user data in Server Components when possible for better security.

3. **Middleware**: Use Next.js middleware to protect routes and redirect unauthenticated users.

4. **Context Pattern**: Create an AuthContext to share user state across components.

5. **Session Management**: Handle token refresh and logout properly.

Example with Clerk:
\`\`\`jsx
import { useUser } from "@clerk/nextjs";

export default function Profile() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Hello {user.firstName}!</div>;
}
\`\`\``,
          tokens: 220,
          cost: 4,
          metadata: {
            model: 'gpt-4',
            temperature: 0.7,
            finish_reason: 'stop'
          }
        }
      ])

    if (messagesError) {
      console.log('Messages already exist, skipping...')
    }

    // Insert sample API keys (only if they don't exist)
    const { error: apiKeysError } = await supabase
      .from('api_keys')
      .insert([
        {
          id: '880e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          service: 'openai',
          key_name: 'OpenAI Production Key',
          encrypted_key: 'encrypted_openai_key_12345',
          is_active: true,
          last_used_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440002',
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          service: 'anthropic',
          key_name: 'Claude API Key',
          encrypted_key: 'encrypted_anthropic_key_67890',
          is_active: true,
          last_used_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440003',
          user_id: '550e8400-e29b-41d4-a716-446655440003',
          service: 'google',
          key_name: 'Gemini API Key',
          encrypted_key: 'encrypted_google_key_abcdef',
          is_active: true,
          last_used_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ])

    if (apiKeysError) {
      console.log('API keys already exist, skipping...')
    }

    // Insert sample activity logs (only if they don't exist)
    const { error: activityLogsError } = await supabase
      .from('user_activity_logs')
      .insert([
        {
          id: '990e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          action: 'conversation_created',
          resource: 'ai_conversation',
          resource_id: '660e8400-e29b-41d4-a716-446655440001',
          metadata: {
            provider: 'openai',
            model: 'gpt-4'
          },
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          id: '990e8400-e29b-41d4-a716-446655440002',
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          action: 'message_sent',
          resource: 'ai_message',
          resource_id: '770e8400-e29b-41d4-a716-446655440001',
          metadata: {
            tokens: 25,
            cost: 1
          },
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          id: '990e8400-e29b-41d4-a716-446655440003',
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          action: 'api_key_added',
          resource: 'api_key',
          resource_id: '880e8400-e29b-41d4-a716-446655440002',
          metadata: {
            service: 'anthropic',
            key_name: 'Claude API Key'
          },
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '990e8400-e29b-41d4-a716-446655440004',
          user_id: '550e8400-e29b-41d4-a716-446655440003',
          action: 'admin_login',
          resource: 'user',
          resource_id: '550e8400-e29b-41d4-a716-446655440003',
          metadata: {
            role: 'admin',
            ip_whitelist: true
          },
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        }
      ])

    if (activityLogsError) {
      console.log('Activity logs already exist, skipping...')
    }

    console.log('✅ Database seeded successfully!')
    console.log('📊 Added: 3 users, 4 conversations, 4 messages, 3 API keys, 4 activity logs, 10 settings')
    return true

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return false
  }
}

/**
 * Initialize database with seeding if needed
 * @returns Promise<boolean> - True if initialization was successful
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Check if database needs seeding
    const needsSeedingData = await needsSeeding()
    
    if (needsSeedingData) {
      console.log('🌱 Database is empty, seeding with sample data...')
      return await seedDatabase()
    } else {
      console.log('✅ Database already has data, skipping seeding')
      return true
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    return false
  }
}
