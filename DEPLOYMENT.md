# Netlify Deployment Guide for PAAM FullStack

## 🚀 Deployment Steps

### 1. Prepare Your Repository
- Ensure all code is committed to your Git repository
- Push your code to GitHub, GitLab, or Bitbucket

### 2. Environment Variables Setup
You'll need to set these environment variables in Netlify:

#### Required Environment Variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NODE_ENV=production
```

### 3. Netlify Deployment Options

#### Option A: Connect via Netlify Dashboard
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your Git provider
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: 18

#### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from your project directory
netlify deploy --prod --dir=out
```

### 4. Build Configuration
The project is configured for static export with:
- `output: 'export'` in next.config.js
- Static file generation
- Optimized for Netlify hosting

### 5. Domain Configuration
- Netlify will provide a random subdomain
- You can configure a custom domain in Netlify dashboard
- Update `NEXT_PUBLIC_APP_URL` with your final domain

### 6. Post-Deployment Checklist
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Check API endpoints
- [ ] Test dashboard functionality
- [ ] Verify environment variables

## 🔧 Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version (use 18)
2. **Environment Variables**: Ensure all required vars are set
3. **Authentication**: Verify Clerk keys are production keys
4. **Database**: Check Supabase connection strings

### Build Commands:
```bash
# Local build test
npm run build
npm run export

# Check build output
ls -la out/
```

## 📝 Notes
- This is a static export deployment
- API routes won't work (use Vercel for full-stack)
- Database operations use client-side Supabase
- Authentication handled by Clerk
