# Supabase Edge Function Setup Guide

## Prerequisites
1. You need a Supabase account and project
2. You need a Resend account for sending emails
3. Supabase CLI installed locally

## Step 1: Install Supabase CLI
If you haven't already, install the Supabase CLI:

```bash
npm install -g supabase
```

## Step 2: Login to Supabase
```bash
supabase login
```

## Step 3: Link Your Project
Replace `YOUR_PROJECT_REF` with your actual Supabase project reference:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Step 4: Set Up Environment Variables

### In Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Navigate to Settings > Edge Functions
3. Add the following environment variable:
   - Key: `RESEND_API_KEY`
   - Value: Your Resend API key (get it from https://resend.com/api-keys)

### In Your Local .env File:
Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Deploy the Edge Function
Run this command from your project root:

```bash
supabase functions deploy send-email
```

## Step 6: Test the Function
After deployment, you can test the function:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "privacyConsent": true
  }'
```

## Step 7: Verify Email Setup
1. Make sure your Resend account is verified
2. Verify that `no-reply@elviradc.com` is added as a verified sender in Resend
3. Test sending an email through the Resend dashboard first

## Troubleshooting

### Function Not Found Error
- Make sure you've deployed the function: `supabase functions deploy send-email`
- Check that your project is linked correctly: `supabase projects list`

### Email Not Sending
- Verify your Resend API key is correct
- Check that your sender email (`no-reply@elviradc.com`) is verified in Resend
- Look at the function logs: `supabase functions logs send-email`

### CORS Issues
- The function includes CORS headers, but make sure your domain is allowed
- Check browser console for specific CORS errors

## Alternative: Manual Deployment via Supabase Dashboard

If CLI deployment doesn't work, you can also:

1. Go to your Supabase project dashboard
2. Navigate to Edge Functions
3. Click "Create Function"
4. Name it `send-email`
5. Copy the content from `supabase/functions/send-email/index.ts`
6. Add the CORS helper by creating a shared file or including it inline

## Quick Commands Summary

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project (replace with your project ref)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy send-email

# View logs
supabase functions logs send-email
```

Once deployed, your contact form should work properly and send emails to info@elviradc.com.