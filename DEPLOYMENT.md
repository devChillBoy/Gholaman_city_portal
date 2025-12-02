# Vercel Deployment Guide

This guide will help you deploy the Gholaman City Portal to Vercel.

## Prerequisites

1. A Vercel account ([sign up here](https://vercel.com/signup))
2. A Supabase project with migrations applied
3. Your Supabase credentials (URL and Anon Key)

## Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js 14
5. Configure environment variables (see Step 3)
6. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

### Required Environment Variables

1. **SUPABASE_URL**
   - Value: Your Supabase project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - Scope: Production, Preview, Development

2. **SUPABASE_ANON_KEY**
   - Value: Your Supabase anonymous key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Scope: Production, Preview, Development
   - ⚠️ This is used server-side

3. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Same as SUPABASE_URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - Scope: Production, Preview, Development
   - ⚠️ This is exposed to the browser

4. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Same as SUPABASE_ANON_KEY
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Scope: Production, Preview, Development
   - ⚠️ This is exposed to the browser

5. **NEXT_PUBLIC_ADMIN_EMAILS**
   - Value: Comma-separated list of admin email addresses
   - Example: `admin@gholaman.ir,manager@gholaman.ir`
   - Scope: Production, Preview, Development
   - ⚠️ This is exposed to the browser

### How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the appropriate scope:
   - **Production**: Used in production deployments
   - **Preview**: Used in preview deployments (pull requests)
   - **Development**: Used in local development with `vercel dev`

## Step 4: Verify Supabase Migrations

Make sure all Supabase migrations are applied:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migrations in order:
   - `supabase/migrations/001_rls_policies.sql`
   - `supabase/migrations/002_indexes.sql`
   - `supabase/migrations/003_request_stats_rpc.sql`
   - `supabase/migrations/004_rls_diagnostic.sql` (if exists)

## Step 5: Test Your Deployment

After deployment:

1. Visit your Vercel deployment URL
2. Test the following:
   - ✅ Homepage loads correctly
   - ✅ Services pages are accessible
   - ✅ News page displays correctly
   - ✅ Employee login works
   - ✅ Admin panel is accessible (for admin users)
   - ✅ Request tracking works

## Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `portal.gholaman.ir`)
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (usually 24-48 hours)

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct build script: `"build": "next build"`

### Environment Variables Not Working

- Make sure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### Supabase Connection Issues

- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check Supabase project is active
- Ensure RLS policies allow necessary operations

### Middleware Issues

- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
- Check middleware.ts is in the root directory
- Review Vercel function logs for middleware errors

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to your main branch
- **Preview**: Pull requests and other branches

You can configure this in **Settings** → **Git**

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Documentation](https://supabase.com/docs)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Verify all environment variables are correctly set
4. Check Next.js build output locally: `npm run build`

