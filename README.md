# PAAM FullStack - Comprehensive Next.js Application

A production-ready full-stack Next.js 14 application with modern authentication, AI integration, and beautiful UI components. Built with TypeScript, Tailwind CSS, and comprehensive documentation.

## 🚀 Features

### Core Technologies
- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** with custom design system
- **Radix UI** components for accessible UI primitives
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** database with Supabase integration

### Authentication & Security
- **Clerk** authentication with JWT tokens
- **Role-based access control** (Admin, User, Moderator, Premium)
- **CORS** configuration for API security
- **Middleware** for route protection
- **Environment variable** security

### AI Integration
- **OpenAI GPT** models (GPT-4, GPT-3.5 Turbo)
- **Anthropic Claude** integration (ready for implementation)
- **Google AI** integration (ready for implementation)
- **Conversation management** with message history
- **Token usage tracking** and cost estimation
- **Multiple AI providers** support

### Database & API
- **PostgreSQL** with comprehensive schema
- **Drizzle ORM** for type-safe queries
- **RESTful API** with proper error handling
- **Database migrations** and schema management
- **User activity logging** and audit trails
- **API key management** for third-party services

### UI/UX
- **Responsive design** with mobile-first approach
- **Dark/Light theme** support
- **Modern component library** with consistent styling
- **Interactive chat interface** for AI conversations
- **Dashboard** with user statistics and analytics
- **Real-time updates** and smooth animations

### Development & Deployment
- **Docker** containerization with multi-stage builds
- **Docker Compose** for local development
- **ESLint & Prettier** for code quality
- **Comprehensive documentation** with JSDoc comments
- **TypeScript** strict mode configuration
- **Hot reload** for development

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **Docker** and Docker Compose (optional)
- **PostgreSQL** database (or use Docker)
- **Clerk** account for authentication
- **OpenAI** API key for AI features

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PAAM-FullStack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/paam_db
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker Compose
docker compose up db -d

# Run database migrations
npm run db:migrate
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb paam_db

# Run migrations
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🐳 Docker Development

### Quick Start with Docker

```bash
# Start all services
docker compose up --build

# Start only the application
docker compose up app

# Start with database
docker compose up app db redis
```

### Production Build

```bash
# Build production image
docker build -t paam-fullstack .

# Run production container
docker run -p 3000:3000 --env-file .env.local paam-fullstack
```

## 📚 API Documentation

### Authentication Endpoints

- `GET /api/health` - System health check
- `POST /api/ai/chat` - Create AI chat completion
- `GET /api/ai/chat` - Get chat conversations

### AI Chat API

#### Send Message
```bash
POST /api/ai/chat
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "message": "Hello, how are you?",
  "conversationId": "optional-conversation-id",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

#### Get Conversations
```bash
GET /api/ai/chat?page=1&limit=10
Authorization: Bearer <jwt-token>
```

## 🗄️ Database Schema

### Core Tables

- **users** - User profiles and preferences
- **ai_conversations** - AI chat conversations
- **ai_messages** - Individual chat messages
- **api_keys** - Encrypted API keys for services
- **user_activity_logs** - User action audit trail
- **system_settings** - Application configuration

### Relationships

- Users have many conversations
- Conversations have many messages
- Users have many API keys
- Users have many activity logs

## 🎨 UI Components

### Available Components

- **Button** - Multiple variants and sizes
- **Input** - Form input with validation
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Toast** - Notification system
- **Avatar** - User profile images

### Styling System

- **CSS Variables** for theming
- **Tailwind CSS** for utility classes
- **Responsive design** with mobile-first approach
- **Dark mode** support
- **Custom animations** and transitions

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio

# Documentation
npm run docs:generate # Generate TypeDoc documentation

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Production

```bash
# Build production image
docker build -t paam-fullstack:latest .

# Run with environment file
docker run -d \
  --name paam-fullstack \
  -p 3000:3000 \
  --env-file .env.production \
  paam-fullstack:latest
```

### Environment Variables for Production

Ensure all required environment variables are set:

- Clerk authentication keys
- Database connection string
- AI API keys
- CORS allowed origins
- Application URL

## 📖 Documentation

### Code Documentation

All functions and components include comprehensive JSDoc comments:

```typescript
/**
 * Creates a new AI chat completion
 * @description Handles sending user messages and receiving AI responses
 * @param request - Chat completion request parameters
 * @returns Promise<ChatCompletionResponse>
 */
export async function createChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse>
```

### Generate Documentation

```bash
npm run docs:generate
```

Documentation will be generated in the `docs/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Add JSDoc comments for all functions
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` directory
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

- [ ] Anthropic Claude integration
- [ ] Google AI integration
- [ ] Real-time chat with WebSockets
- [ ] File upload and processing
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app with React Native
- [ ] Advanced AI model fine-tuning

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
