# Troubleshooting: Pages Not Loading on Vercel

## Common Issues and Solutions

### 1. Missing Environment Variables (Most Common)

**Symptoms:**
- Pages show blank screen or error
- Console shows "Missing Supabase environment variables"
- Build succeeds but runtime fails

**Solution:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables (make sure they're set for **Production**, **Preview**, and **Development**):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAILS` (optional but recommended)
4. **Redeploy** your project after adding variables

### 2. Check Vercel Build Logs

1. Go to your Vercel project
2. Click on the latest deployment
3. Check the **Build Logs** tab
4. Look for any errors during build or runtime

### 3. Check Browser Console

1. Open your deployed site
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for red error messages
5. Common errors:
   - "Missing Supabase environment variables"
   - "Failed to fetch"
   - Network errors

### 4. Check Network Tab

1. Open Developer Tools (`F12`)
2. Go to **Network** tab
3. Refresh the page
4. Look for failed requests (red status codes)
5. Check if Supabase requests are failing

### 5. Verify Supabase Configuration

1. Check your Supabase project is active
2. Verify your Supabase URL and Anon Key are correct
3. Make sure RLS policies allow necessary operations
4. Test Supabase connection from Supabase dashboard

### 6. Middleware Issues

If middleware is causing issues:
- Check Vercel Function Logs
- Look for middleware errors
- Verify environment variables are accessible in middleware

### 7. Build Configuration

Verify your `package.json` has:
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

## Quick Diagnostic Steps

1. **Check Environment Variables:**
   ```bash
   # In Vercel dashboard, verify all required env vars are set
   ```

2. **Check Build Status:**
   - Go to Vercel dashboard
   - Check if build succeeded
   - Review build logs for errors

3. **Test Locally:**
   ```bash
   npm run build
   npm start
   ```
   If it works locally but not on Vercel, it's likely an environment variable issue.

4. **Check Vercel Function Logs:**
   - Go to Vercel dashboard → Your Project → Functions
   - Check for runtime errors

## Getting Help

If issues persist:
1. Share the error message from browser console
2. Share Vercel build logs
3. Verify all environment variables are set correctly
4. Check Supabase project status

