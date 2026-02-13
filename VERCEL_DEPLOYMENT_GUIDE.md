# Vercel Deployment Guide for Mozini

## Issue Fixed: ERR_TOO_MANY_REDIRECTS

The redirect loop issue has been fixed by:

1. **Created Middleware** (`src/middleware.ts`)
   - Properly handles Supabase auth session refresh
   - Protects admin routes
   - Prevents redirect loops

2. **Updated Auth Flow**
   - Changed from `window.location.href` to `router.push()` + `router.refresh()`
   - This prevents redirect loops in production

3. **Improved Sign-Out**
   - Now uses Next.js router instead of window.location
   - Properly clears session before navigation

## Required Environment Variables in Vercel

Make sure these are set in your Vercel project settings:

### Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to Set Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL (from Supabase dashboard)
   - Environment: Production, Preview, Development (select all)
   
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon/public key (from Supabase dashboard)
   - Environment: Production, Preview, Development (select all)

5. Click "Save"
6. Redeploy your application

## Supabase Configuration

Make sure your Supabase project has the correct redirect URLs configured:

1. Go to Supabase Dashboard
2. Navigate to Authentication > URL Configuration
3. Add these Site URLs:
   - `http://localhost:3000` (for local development)
   - `https://your-domain.vercel.app` (your production URL)
   - `https://mozini.co.ke` (your custom domain)

4. Add these Redirect URLs:
   - `http://localhost:3000/**`
   - `https://your-domain.vercel.app/**`
   - `https://mozini.co.ke/**`

## Deployment Steps

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Fix redirect loop and add middleware"
   git push
   ```

2. Vercel will automatically deploy

3. If the issue persists:
   - Clear your browser cookies for the domain
   - Try in an incognito/private window
   - Check Vercel logs for any errors

## Testing After Deployment

1. Visit your site
2. Try signing in - should work without refresh
3. Try signing out - should work without redirect loop
4. Try accessing admin routes - should redirect to login if not authenticated

## Common Issues

### Still getting redirect loops?
- Clear browser cookies
- Check that environment variables are set correctly in Vercel
- Verify Supabase redirect URLs include your domain

### Auth not working?
- Check Vercel logs for errors
- Verify environment variables are correct
- Check Supabase project is active

### Admin routes not protected?
- The middleware now handles this automatically
- Make sure your user has `role: 'admin'` in the profiles table
