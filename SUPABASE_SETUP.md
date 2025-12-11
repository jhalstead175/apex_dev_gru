# Supabase Setup Guide for Apex Lead Generation

This guide will help you set up Supabase for the roofing lead generation system.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Name it "Apex Development Group Leads"
4. Choose a database password (save this securely)
5. Select a region closest to your users
6. Wait for the project to be created (~2 minutes)

## 2. Create the Database Tables

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Contact Information
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,

  -- Property & Roof Information
  property_type TEXT NOT NULL,
  roof_age TEXT NOT NULL,
  roof_condition TEXT NOT NULL,
  visible_damage TEXT NOT NULL,
  recent_storm TEXT NOT NULL,
  active_leaks TEXT NOT NULL,
  timeline TEXT NOT NULL,
  has_quotes TEXT NOT NULL,
  has_budget TEXT NOT NULL,

  -- Lead Scoring
  lead_score INTEGER NOT NULL,
  lead_tier TEXT NOT NULL, -- HOT, WARM, QUALIFIED, PROSPECT

  -- Lead Management
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
  assigned_to TEXT,
  notes TEXT,
  contacted_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,

  -- Source Tracking
  source TEXT DEFAULT 'website',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT
);

-- Create index for faster queries
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX leads_lead_tier_idx ON leads (lead_tier);
CREATE INDEX leads_status_idx ON leads (status);
CREATE INDEX leads_lead_score_idx ON leads (lead_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for the lead gen form)
CREATE POLICY "Allow public inserts" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all leads
CREATE POLICY "Allow authenticated reads" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update leads
CREATE POLICY "Allow authenticated updates" ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a view for analytics
CREATE VIEW lead_analytics AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE lead_tier = 'HOT') as hot_leads,
  COUNT(*) FILTER (WHERE lead_tier = 'WARM') as warm_leads,
  COUNT(*) FILTER (WHERE lead_tier = 'QUALIFIED') as qualified_leads,
  COUNT(*) FILTER (WHERE lead_tier = 'PROSPECT') as prospect_leads,
  AVG(lead_score) as avg_score,
  COUNT(*) FILTER (WHERE status = 'converted') as conversions
FROM leads
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 3. Set Up Email Notifications (Optional)

To get email notifications for HOT leads, you'll need to set up a Supabase Edge Function:

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Create the edge function:

```bash
supabase functions new send-lead-notification
```

5. Update the function code in `supabase/functions/send-lead-notification/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { lead } = await req.json()

  // Only send email for HOT leads
  if (lead.lead_tier !== 'HOT') {
    return new Response(JSON.stringify({ message: 'Not a hot lead' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'notifications@apexdevelopmentgroup.com',
      to: ['dan@apexdevelopmentgroup.com'],
      subject: `🔥 HOT Lead Alert: ${lead.full_name}`,
      html: `
        <h2>New HOT Lead Received!</h2>
        <p><strong>Score:</strong> ${lead.lead_score}/100</p>
        <p><strong>Name:</strong> ${lead.full_name}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Address:</strong> ${lead.address}</p>
        <p><strong>Timeline:</strong> ${lead.timeline}</p>
        <p><strong>Roof Condition:</strong> ${lead.roof_condition}</p>
        <p><strong>Active Leaks:</strong> ${lead.active_leaks}</p>
        <hr>
        <p>View all leads in your dashboard: https://your-domain.vercel.app/RoofingLeadsDashboard</p>
      `,
    }),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

6. Deploy: `supabase functions deploy send-lead-notification`
7. Set the Resend API key: `supabase secrets set RESEND_API_KEY=your-key`

## 4. Get Your API Keys

1. Go to Project Settings → API
2. Copy your Project URL
3. Copy your `anon` public key

## 5. Configure Your .env File

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_NOTIFICATION_EMAIL=dan@apexdevelopmentgroup.com
```

## 6. Set Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_NOTIFICATION_EMAIL`

## 7. Test Your Setup

1. Visit `/LeadGenPage` on your deployed site
2. Fill out and submit the form
3. Check your Supabase dashboard to see the lead appear in the `leads` table
4. If you set up notifications, check your email for HOT leads

## Troubleshooting

- **No data appearing**: Check your Row Level Security policies
- **401 errors**: Verify your API keys are correct
- **CORS errors**: Supabase should handle CORS automatically, but check your project settings
- **Email not sending**: Verify your Edge Function is deployed and secrets are set

## Next Steps

- Set up automated follow-up emails
- Create a Zapier integration to push leads to your CRM
- Add SMS notifications for urgent leads
- Set up Google Analytics events for lead submissions
