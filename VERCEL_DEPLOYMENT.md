# 🚀 Vercel Deployment Guide for PAAM FullStack

## Step-by-Step Setup Instructions

### **Step 1: Create GitHub Repository**

1. **Go to GitHub.com** and sign in (or create an account)
2. **Click "New repository"** (green button)
3. **Repository settings:**
   - Name: `paam-fullstack` (or your preferred name)
   - Description: `Full-stack Next.js application with AI integration`
   - Make it **Public** (required for free Vercel)
   - **Don't** initialize with README (we already have files)
4. **Click "Create repository"**

### **Step 2: Push Your Code to GitHub**

Run these commands in your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/paam-fullstack.git

# Push your code
git branch -M main
git push -u origin main
```

### **Step 3: Create Vercel Account**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Sign Up"**
3. **Choose "Continue with GitHub"** (recommended)
4. **Authorize Vercel** to access your GitHub account
5. **Complete your profile** setup

### **Step 4: Deploy to Vercel**

1. **In Vercel dashboard, click "New Project"**
2. **Import your GitHub repository:**
   - Find `paam-fullstack` in the list
   - Click "Import"
3. **Configure the project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
4. **Click "Deploy"**

### **Step 5: Set Environment Variables**

After deployment, go to your project settings:

1. **Click on your project** in Vercel dashboard
2. **Go to "Settings" → "Environment Variables"**
3. **Add these variables:**

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
```

4. **Click "Save"** for each variable
5. **Redeploy** your application

### **Step 6: Update Clerk Settings**

1. **Go to your Clerk dashboard**
2. **Navigate to "Domains"**
3. **Add your Vercel domain:**
   - `your-project.vercel.app`
   - `your-project-git-main-your-username.vercel.app`
4. **Update redirect URLs:**
   - After sign in: `https://your-project.vercel.app/dashboard`
   - After sign up: `https://your-project.vercel.app/dashboard`

### **Step 7: Update Supabase Settings**

1. **Go to your Supabase dashboard**
2. **Navigate to "Settings" → "API"**
3. **Add your Vercel domain to allowed origins:**
   - `https://your-project.vercel.app`

## 🎉 **You're Done!**

Your PAAM FullStack application will be live at:
`https://your-project.vercel.app`

## 🔧 **Troubleshooting**

### **Build Errors:**
- Check that all environment variables are set
- Ensure your GitHub repository is public
- Verify all dependencies are in package.json

### **Authentication Issues:**
- Double-check Clerk domain settings
- Verify redirect URLs match your Vercel domain
- Ensure environment variables are correct

### **Database Issues:**
- Check Supabase connection settings
- Verify API keys are correct
- Ensure database is properly seeded

## 📝 **Next Steps**

1. **Custom Domain:** Add your own domain in Vercel settings
2. **Analytics:** Enable Vercel Analytics for insights
3. **Monitoring:** Set up error tracking and performance monitoring
4. **CI/CD:** Every push to main will auto-deploy

## 🆘 **Need Help?**

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Clerk Docs:** [clerk.com/docs](https://clerk.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
