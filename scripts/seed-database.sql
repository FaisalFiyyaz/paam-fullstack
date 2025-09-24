-- PAAM FullStack Database Seeding Script
-- This script adds sample data for development and testing

-- Insert sample system settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', '"PAAM FullStack"', 'Application name', true),
('app_version', '"1.0.0"', 'Application version', true),
('maintenance_mode', 'false', 'Maintenance mode flag', true),
('max_conversations_per_user', '100', 'Maximum conversations per user', false),
('max_messages_per_conversation', '1000', 'Maximum messages per conversation', false),
('default_ai_provider', '"openai"', 'Default AI provider for new conversations', true),
('supported_ai_providers', '["openai", "anthropic", "google"]', 'List of supported AI providers', true),
('default_ai_model', '"gpt-4"', 'Default AI model for new conversations', true),
('max_tokens_per_request', '4000', 'Maximum tokens per AI request', false),
('rate_limit_per_hour', '100', 'Rate limit per user per hour', false)
ON CONFLICT (key) DO NOTHING;

-- Insert sample users (these would normally be created through Clerk authentication)
-- Note: These are sample users for development - in production, users are created via Clerk
INSERT INTO users (
    id,
    clerk_id,
    email,
    first_name,
    last_name,
    display_name,
    bio,
    profile_image_url,
    role,
    subscription_tier,
    preferences,
    is_active,
    last_login_at,
    created_at,
    updated_at
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'user_2abc123def456ghi',
    'john.doe@example.com',
    'John',
    'Doe',
    'John Doe',
    'Full-stack developer passionate about AI and modern web technologies.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'user',
    'free',
    '{"theme": "dark", "language": "en", "timezone": "America/New_York", "emailNotifications": true, "pushNotifications": true}',
    true,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '2 hours'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'user_2xyz789uvw012rst',
    'jane.smith@example.com',
    'Jane',
    'Smith',
    'Jane Smith',
    'AI researcher and machine learning engineer with expertise in NLP.',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'user',
    'premium',
    '{"theme": "light", "language": "en", "timezone": "Europe/London", "emailNotifications": true, "pushNotifications": false}',
    true,
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '1 hour'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'user_2admin456super789',
    'admin@paam.com',
    'Admin',
    'User',
    'PAAM Admin',
    'System administrator for PAAM FullStack platform.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'admin',
    'enterprise',
    '{"theme": "system", "language": "en", "timezone": "UTC", "emailNotifications": true, "pushNotifications": true}',
    true,
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '30 minutes'
)
ON CONFLICT (clerk_id) DO NOTHING;

-- Insert sample AI conversations
INSERT INTO ai_conversations (
    id,
    user_id,
    title,
    provider,
    model,
    system_prompt,
    total_tokens,
    total_cost,
    is_active,
    created_at,
    updated_at
) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'React and Next.js Best Practices',
    'openai',
    'gpt-4',
    'You are a senior React developer with expertise in Next.js. Help me understand best practices for building scalable applications.',
    1250,
    25,
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 hours'
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Database Design for E-commerce',
    'openai',
    'gpt-4',
    'You are a database architect. Help me design a scalable database schema for an e-commerce platform.',
    2100,
    42,
    true,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 hour'
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    'Machine Learning Model Evaluation',
    'anthropic',
    'claude-3-sonnet',
    'You are a machine learning expert. Help me understand how to properly evaluate ML models and avoid common pitfalls.',
    1800,
    36,
    true,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '4 hours'
),
(
    '660e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440002',
    'API Security Best Practices',
    'google',
    'gemini-pro',
    'You are a cybersecurity expert. Help me understand API security best practices and common vulnerabilities.',
    950,
    19,
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '6 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample AI messages
INSERT INTO ai_messages (
    id,
    conversation_id,
    role,
    content,
    tokens,
    cost,
    metadata,
    created_at,
    updated_at
) VALUES
-- Messages for React conversation
(
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'user',
    'What are the best practices for state management in Next.js applications?',
    25,
    1,
    '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 1000}',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440001',
    'assistant',
    'For state management in Next.js applications, here are the key best practices:

1. **Server State vs Client State**: Use React Query or SWR for server state, and useState/useReducer for client state.

2. **Context API**: Use React Context for global state that doesn''t change frequently (theme, user preferences).

3. **Zustand**: For complex client state, consider Zustand as a lightweight alternative to Redux.

4. **URL State**: Use URL search params for shareable state (filters, pagination).

5. **Local Storage**: Persist non-sensitive data like user preferences.

The key is to choose the right tool for the right job rather than using one solution for everything.',
    180,
    4,
    '{"model": "gpt-4", "temperature": 0.7, "finish_reason": "stop"}',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440001',
    'user',
    'How do I handle authentication state in Next.js?',
    20,
    1,
    '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 1000}',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    '770e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440001',
    'assistant',
    'For authentication state in Next.js, here''s the recommended approach:

1. **Use Auth Providers**: Integrate with providers like Clerk, Auth0, or NextAuth.js for production apps.

2. **Server Components**: Fetch user data in Server Components when possible for better security.

3. **Middleware**: Use Next.js middleware to protect routes and redirect unauthenticated users.

4. **Context Pattern**: Create an AuthContext to share user state across components.

5. **Session Management**: Handle token refresh and logout properly.

Example with Clerk:
```jsx
import { useUser } from "@clerk/nextjs";

export default function Profile() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Hello {user.firstName}!</div>;
}
```',
    220,
    4,
    '{"model": "gpt-4", "temperature": 0.7, "finish_reason": "stop"}',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),

-- Messages for Database conversation
(
    '770e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440002',
    'user',
    'I need to design a database for an e-commerce platform. What tables should I include?',
    30,
    1,
    '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 1500}',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
(
    '770e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440002',
    'assistant',
    'For an e-commerce platform, here are the essential tables you should include:

## Core Tables:
1. **users** - Customer information
2. **products** - Product catalog
3. **categories** - Product categories
4. **orders** - Customer orders
5. **order_items** - Individual items in orders
6. **inventory** - Stock levels
7. **payments** - Payment transactions

## Additional Tables:
8. **addresses** - Customer shipping/billing addresses
9. **reviews** - Product reviews
10. **coupons** - Discount codes
11. **shipping_methods** - Delivery options
12. **taxes** - Tax calculations

## Key Relationships:
- Users can have multiple orders
- Orders contain multiple order_items
- Products belong to categories
- Order_items reference products and orders

## Indexes to Consider:
- Product name/category for search
- User email for authentication
- Order date for reporting
- Product SKU for inventory management

Would you like me to elaborate on any specific table structure?',
    280,
    6,
    '{"model": "gpt-4", "temperature": 0.7, "finish_reason": "stop"}',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),

-- Messages for ML conversation
(
    '770e8400-e29b-41d4-a716-446655440007',
    '660e8400-e29b-41d4-a716-446655440003',
    'user',
    'What metrics should I use to evaluate my machine learning model?',
    25,
    1,
    '{"model": "claude-3-sonnet", "temperature": 0.7, "max_tokens": 1200}',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
),
(
    '770e8400-e29b-41d4-a716-446655440008',
    '660e8400-e29b-41d4-a716-446655440003',
    'assistant',
    'The metrics you choose depend on your problem type and business goals:

## Classification Metrics:
- **Accuracy**: Overall correctness (be careful with imbalanced datasets)
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **ROC-AUC**: Area under the ROC curve
- **Confusion Matrix**: Detailed breakdown of predictions

## Regression Metrics:
- **RMSE**: Root Mean Square Error
- **MAE**: Mean Absolute Error
- **R²**: Coefficient of determination
- **MAPE**: Mean Absolute Percentage Error

## Key Considerations:
1. **Business Context**: What matters most to your users?
2. **Data Imbalance**: Use precision/recall for skewed datasets
3. **Threshold Selection**: Choose optimal decision boundaries
4. **Cross-Validation**: Use k-fold CV for robust evaluation
5. **Holdout Testing**: Reserve 20% for final evaluation

Remember: No single metric tells the whole story. Use multiple metrics and always consider your business objectives.',
    240,
    5,
    '{"model": "claude-3-sonnet", "temperature": 0.7, "finish_reason": "stop"}',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample API keys (encrypted examples)
INSERT INTO api_keys (
    id,
    user_id,
    service,
    key_name,
    encrypted_key,
    is_active,
    last_used_at,
    created_at,
    updated_at
) VALUES
(
    '880e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'openai',
    'OpenAI Production Key',
    'encrypted_openai_key_12345',
    true,
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '1 hour'
),
(
    '880e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'anthropic',
    'Claude API Key',
    'encrypted_anthropic_key_67890',
    true,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 hours'
),
(
    '880e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'google',
    'Gemini API Key',
    'encrypted_google_key_abcdef',
    true,
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample user activity logs
INSERT INTO user_activity_logs (
    id,
    user_id,
    action,
    resource,
    resource_id,
    metadata,
    ip_address,
    user_agent,
    created_at
) VALUES
(
    '990e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'conversation_created',
    'ai_conversation',
    '660e8400-e29b-41d4-a716-446655440001',
    '{"provider": "openai", "model": "gpt-4"}',
    '192.168.1.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    NOW() - INTERVAL '2 days'
),
(
    '990e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'message_sent',
    'ai_message',
    '770e8400-e29b-41d4-a716-446655440001',
    '{"tokens": 25, "cost": 1}',
    '192.168.1.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    NOW() - INTERVAL '2 days'
),
(
    '990e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    'api_key_added',
    'api_key',
    '880e8400-e29b-41d4-a716-446655440002',
    '{"service": "anthropic", "key_name": "Claude API Key"}',
    '192.168.1.101',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    NOW() - INTERVAL '3 days'
),
(
    '990e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440003',
    'admin_login',
    'user',
    '550e8400-e29b-41d4-a716-446655440003',
    '{"role": "admin", "ip_whitelist": true}',
    '192.168.1.102',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    NOW() - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

-- Display summary of seeded data
SELECT 
    'Database seeding completed successfully!' as status,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM ai_conversations) as total_conversations,
    (SELECT COUNT(*) FROM ai_messages) as total_messages,
    (SELECT COUNT(*) FROM api_keys) as total_api_keys,
    (SELECT COUNT(*) FROM user_activity_logs) as total_activity_logs,
    (SELECT COUNT(*) FROM system_settings) as total_settings;
