# Dan's Lead Generation System Setup Checklist

**Goal:** Get your roofing lead generation system live and capturing qualified leads.

**Time Required:** 2-3 hours for full setup | 30 minutes for basic setup

---

## 🎯 Quick Start (30 Minutes - Minimum Viable System)

This gets you capturing leads immediately. You can add the advanced features later.

### Step 1: Set Up Supabase (Database) - REQUIRED
**Time: 15 minutes**

1. **Go to [supabase.com](https://supabase.com)** and sign up with your email
2. Click **"New Project"**
3. Fill in:
   - Organization: Create new "Apex Development Group"
   - Project name: "Apex Leads"
   - Database password: Make it strong, save it somewhere safe
   - Region: Choose closest to Pennsylvania
4. Click **"Create new project"** and wait 2 minutes
5. Once ready, click **"SQL Editor"** in the left sidebar
6. Click **"New query"**
7. **Copy the entire SQL code from `SUPABASE_SETUP.md`** (starting with "CREATE TABLE leads...")
8. Click **"Run"**
9. Should say "Success. No rows returned"
10. Go to **"Project Settings"** → **"API"**
11. Copy these two values:
    - **Project URL** (looks like: `https://abc123.supabase.co`)
    - **anon public** key (click "reveal" button, long string starting with `eyJ`)
12. Keep these handy for next step

**✅ Success Check:** Go to Table Editor → leads table should exist with 0 rows

---

### Step 2: Add Supabase to Vercel
**Time: 5 minutes**

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **apex_dev_gru** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Add these two variables:

**Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: *paste your Project URL from Supabase*
- Environments: Check all three (Production, Preview, Development)
- Click "Save"

**Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: *paste your anon public key from Supabase*
- Environments: Check all three
- Click "Save"

6. Go to **"Deployments"** tab
7. Click **"Redeploy"** on the latest deployment
8. Wait 2-3 minutes for deployment to finish

**✅ Success Check:** Deployment should show "Ready" with no errors

---

### Step 3: Test Your Lead System
**Time: 10 minutes**

1. Visit your site: `https://your-apex-site.vercel.app/LeadGenPage`
2. Fill out the form with test data:
   - Use your real email to test welcome message
   - For HOT lead test: Choose 20+ years, poor condition, active leaks, immediate timeline
3. Click through both steps and submit
4. Should see results page with your score
5. Check your email for welcome message
6. Go to Supabase dashboard → Table Editor → leads
7. Your test lead should appear!

**✅ Success Check:**
- Form submits without errors
- Results page shows
- Lead appears in Supabase
- Welcome email received (check spam folder)

---

### Step 4: View Your Dashboard
**Time: 2 minutes**

1. Go to: `https://your-apex-site.vercel.app/RoofingLeadsDashboard`
2. Should see your test lead
3. Click on it to see full details
4. Try filtering by tier
5. Try searching
6. Click "Export CSV" button

**✅ Success Check:** Dashboard shows leads and all features work

---

## 🎉 Congratulations! Your basic system is LIVE!

You can now:
- Share `/LeadGenPage` link on social media, ads, emails
- Receive leads in your database
- View them in your dashboard
- Export to CSV for your CRM

**For now, you'll need to check the dashboard manually for new leads.**

To get automatic notifications when leads come in, continue with Phase 2...

---

## 🔥 Phase 2: Email Notifications (30 Minutes - Highly Recommended)

Get instant email alerts when leads submit + send professional welcome emails to customers.

### Step 1: Sign Up for Resend
**Time: 10 minutes**

1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address
4. **Add your domain** (apexdevelopmentgroup.com):
   - Click "Domains" → "Add Domain"
   - Enter: `apexdevelopmentgroup.com`
   - They'll give you DNS records

5. **Add DNS records** (ask your domain host or IT person):
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add the MX, TXT, and CNAME records Resend provides
   - Wait 10-30 minutes for verification

   **OR use Resend's test domain for now:**
   - Skip domain setup, emails will come from `onboarding.resend.dev`
   - Works fine for testing, but custom domain looks more professional

6. **Get your API key:**
   - Click "API Keys" → "Create API Key"
   - Name it "Apex Leads"
   - Copy the key (starts with `re_`)
   - Save it immediately (shown only once!)

**✅ Success Check:** API key copied and saved

---

### Step 2: Add Resend to Vercel
**Time: 5 minutes**

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add these two variables:

**Variable 1:**
- Key: `VITE_RESEND_API_KEY`
- Value: *paste your Resend API key*
- Environments: All three
- Click "Save"

**Variable 2:**
- Key: `VITE_NOTIFICATION_EMAIL`
- Value: `dan@apexdevelopmentgroup.com` (or your preferred email)
- Environments: All three
- Click "Save"

3. Redeploy your site (Deployments → Redeploy)

**✅ Success Check:** Environment variables saved, site redeployed

---

### Step 3: Test Email Notifications
**Time: 5 minutes**

1. Go to `/LeadGenPage` on your live site
2. Submit a new test lead (use different email than before)
3. Within 10 seconds, check your inbox (the one you set as VITE_NOTIFICATION_EMAIL)
4. You should receive:
   - **Lead notification email** with all the lead details
5. Check the lead's email inbox:
   - Should receive **welcome email** from Apex

**✅ Success Check:**
- You got notification email
- Lead got welcome email
- Emails look professional

---

### Step 4: Test HOT Lead Alert
**Time: 2 minutes**

1. Submit another test lead with HOT criteria:
   - Roof age: 20+ years
   - Condition: Poor
   - Active leaks: Yes
   - Timeline: Immediate
2. Check your email - should be marked as HOT with special formatting

**✅ Success Check:** HOT lead email has red banner and priority messaging

---

## 📅 Phase 3: Calendar Booking (15 Minutes - Highly Recommended)

Let leads book inspections directly on your calendar.

### Step 1: Set Up Calendly
**Time: 10 minutes**

1. Go to [calendly.com](https://calendly.com) and sign up
2. Connect your Google/Outlook calendar
3. Click **"Create Event Type"**
4. Fill in:
   - Event name: "Free Roof Inspection"
   - Duration: 60 minutes
   - Location: Ask invitee (they'll provide address)
5. **Set your availability:**
   - When can you do inspections? (e.g., Mon-Fri 8am-5pm)
   - Buffer time between meetings: 30 minutes (drive time)
6. **Add questions to ask:**
   - What is your full property address?
   - Best phone number to reach you?
   - Any special access instructions?
   - Any additional concerns about your roof?
7. Click **"Save"**
8. Copy your scheduling link (looks like: `https://calendly.com/apexdevelopmentgroup/roof-inspection`)

**✅ Success Check:** Event created, link copied

---

### Step 2: Add Calendly to Vercel
**Time: 3 minutes**

1. Vercel → Settings → Environment Variables
2. Add variable:
   - Key: `VITE_CALENDLY_URL`
   - Value: *paste your Calendly link*
   - Environments: All three
3. Redeploy

**✅ Success Check:** Variable saved, redeployed

---

### Step 3: Test Calendar Booking
**Time: 2 minutes**

1. Submit a test lead
2. On results page, click **"Schedule Free Inspection"** button
3. Calendly should open in new window
4. Try booking a test appointment
5. You should get confirmation email
6. Check your calendar - appointment should appear

**✅ Success Check:** Calendar booking works, appointments sync

---

## 📱 Phase 4: SMS Alerts (15 Minutes - Optional but Awesome)

Get text messages for HOT leads so you can call immediately.

### Step 1: Sign Up for Twilio
**Time: 5 minutes**

1. Go to [twilio.com/console](https://www.twilio.com/console)
2. Sign up (you'll get $15 free credit)
3. Verify your phone number
4. **Get a Twilio phone number:**
   - Click "Get a Twilio phone number"
   - Accept the number they suggest (or search for local PA number)
   - This costs $1/month
5. **Copy your credentials:**
   - Account SID: On dashboard (looks like `ACxxxxxx`)
   - Auth Token: On dashboard (click to reveal)
   - Your Twilio phone number: Just created (format: +15551234567)

**✅ Success Check:** Phone number acquired, credentials copied

---

### Step 2: Add Twilio to Vercel
**Time: 3 minutes**

Add these four variables to Vercel:

1. `VITE_TWILIO_ACCOUNT_SID` = Your Account SID
2. `VITE_TWILIO_AUTH_TOKEN` = Your Auth Token
3. `VITE_TWILIO_PHONE_NUMBER` = Your Twilio number (with +1)
4. `VITE_NOTIFICATION_PHONE` = Your cell phone (with +1, e.g., +15551234567)

Redeploy.

**✅ Success Check:** All four variables added, redeployed

---

### Step 3: Test SMS
**Time: 2 minutes**

1. Submit a HOT lead (20+ year roof, poor condition, active leaks, immediate)
2. Within 10 seconds, check your phone
3. Should receive text with lead details and dashboard link

**⚠️ Note:** SMS only sends for HOT leads (score 80+)

**✅ Success Check:** Received SMS with lead details

---

## 📊 Phase 5: Analytics (15 Minutes - Recommended)

Track where leads come from and measure ROI.

### Google Analytics
**Time: 10 minutes**

1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in with Google account
3. Click **"Start measuring"**
4. Account name: "Apex Development Group"
5. Property name: "Apex Website"
6. Time zone: Eastern
7. Create property
8. Choose **"Web"** platform
9. Website URL: Your Vercel URL
10. Stream name: "Apex Website"
11. Create stream
12. Copy your **Measurement ID** (starts with `G-`)
13. Add to Vercel as `VITE_GA_TRACKING_ID`
14. Redeploy

**✅ Success Check:** GA tracking ID added, redeployed

---

### Facebook Pixel (if running Facebook ads)
**Time: 5 minutes**

1. Go to [business.facebook.com](https://business.facebook.com)
2. Click "Events Manager"
3. Click "Connect Data Sources" → "Web"
4. Choose "Facebook Pixel"
5. Name it "Apex Leads"
6. Copy your Pixel ID
7. Add to Vercel as `VITE_FB_PIXEL_ID`
8. Redeploy

**✅ Success Check:** Pixel ID added

---

## 🎊 You're All Set! Now What?

### Daily Actions (First Week)

**Morning (5 minutes):**
1. Check dashboard for new leads: `your-site.vercel.app/RoofingLeadsDashboard`
2. Check your email for overnight leads
3. Call any new HOT leads immediately

**Throughout Day:**
- Respond to SMS alerts within 1 hour
- Update lead status in dashboard after calling
- Schedule inspections

**Evening (5 minutes):**
- Review day's leads
- Follow up on any you missed
- Export CSV if needed for your CRM

---

### Weekly Actions

**Monday (15 minutes):**
- Review last week's stats:
  - How many leads?
  - What was lead quality (HOT/WARM/QUALIFIED)?
  - How many converted to inspections?
  - How many converted to projects?
- Identify patterns (What time do most leads come in? What day?)

---

### Marketing & Traffic

**Now that your system is ready, send people to it:**

1. **Google My Business**
   - Add link to `/LeadGenPage` in your profile
   - Post: "Get your free roof assessment in 2 minutes"

2. **Facebook/Instagram**
   - Share the link with a photo of a completed job
   - Run ads targeting homeowners 40+ in your service area
   - Use: `?utm_source=facebook&utm_medium=social&utm_campaign=fall2024`

3. **Google Ads**
   - Keywords: "roof inspection near me", "roof replacement cost", "roof leak repair"
   - Send to `/LeadGenPage?utm_source=google&utm_medium=cpc&utm_campaign=fall2024`

4. **Email Signature**
   - Add: "Get your free roof assessment: [link]"

5. **Job Site Signs**
   - QR code pointing to `/LeadGenPage?utm_source=jobsite&utm_medium=offline`

6. **Vehicle Wraps**
   - QR code or short URL

---

### Response Time = Money

**Critical Statistics:**
- Call within **1 hour**: 78% close rate 🔥
- Call within **24 hours**: 45% close rate
- Call within **3 days**: 18% close rate
- Call after **1 week**: 7% close rate

**Your HOT lead alerts (email + SMS) help you respond in minutes!**

---

### Lead Follow-Up Script

**For HOT Leads (call within 1 hour):**
```
"Hi [Name], this is Dan from Apex Development Group.
You just filled out a roof assessment on our website,
and I wanted to reach out personally because it looks like
you might have some urgent concerns.

Do you have a minute to talk about your roof?

[Listen to concerns]

I'd love to come take a look - no obligation.
I have openings [today/tomorrow].
Would [time] or [time] work better for you?"
```

**For WARM Leads (call within 24 hours):**
```
"Hi [Name], this is Dan from Apex. You requested a roof
assessment yesterday. I reviewed your information and have
some thoughts I'd like to share.

Do you have a few minutes?

[Discuss findings]

When would be a good time for me to come by and give you
a more detailed assessment? I'm free [day] or [day]."
```

---

### Measuring Success

**Track These Numbers Weekly:**

| Metric | Target |
|--------|--------|
| Form visitors | 50+ |
| Form completions | 30+ (60% conversion) |
| HOT leads | 10+ (33% of completions) |
| Calls made | 25+ (83% of leads) |
| Inspections scheduled | 9+ (30% of completions) |
| Inspections completed | 6+ (70% show rate) |
| Quotes sent | 6 |
| Projects won | 2+ (35% close rate) |

**ROI Calculation:**
- Average project value: $10,000
- 2 projects/week = $20,000/week revenue
- System cost: $0-35/month
- **ROI: Infinite** ♾️

---

## 🆘 Troubleshooting

### "Leads not appearing in Supabase"
1. Check browser console for errors (F12 → Console)
2. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
3. Check Supabase → Table Editor → RLS policies enabled
4. Try submitting a lead, then check Supabase → Logs

### "Not receiving email notifications"
1. Verify VITE_RESEND_API_KEY is correct
2. Check Resend dashboard → Logs
3. Check spam folder
4. Verify VITE_NOTIFICATION_EMAIL is correct
5. If using custom domain, ensure DNS is verified

### "Not receiving SMS"
1. Verify all 4 Twilio variables are correct
2. Verify phone numbers are in +1XXXXXXXXXX format
3. Check Twilio console → Logs
4. Ensure lead is HOT (score 80+)
5. Check Twilio account has credit

### "Calendar not opening"
1. Check VITE_CALENDLY_URL is correct
2. Try right-click → "Open in new tab"
3. Check browser popup blocker settings

### "Dashboard not showing leads"
1. Verify you're logged in
2. Check Supabase has leads in Table Editor
3. Check browser console for errors
4. Try filtering by "All Tiers" and "All Status"

---

## 📞 Quick Reference

**Your URLs:**
- Lead Gen Page: `your-site.vercel.app/LeadGenPage`
- Admin Dashboard: `your-site.vercel.app/RoofingLeadsDashboard`
- Calendly: [your-calendly-link]

**Where to Check for New Leads:**
1. SMS (if HOT lead)
2. Email notifications
3. Dashboard: `your-site.vercel.app/RoofingLeadsDashboard`
4. Supabase: [your-supabase-dashboard]

**Service Dashboards:**
- Supabase: `app.supabase.com`
- Resend: `resend.com/emails`
- Twilio: `console.twilio.com`
- Calendly: `calendly.com/event_types`
- Google Analytics: `analytics.google.com`

---

## ✅ Final Checklist

**Essential (Required):**
- [ ] Supabase set up and configured
- [ ] Environment variables added to Vercel
- [ ] Test lead submitted successfully
- [ ] Dashboard accessible and working

**Highly Recommended:**
- [ ] Resend email notifications working
- [ ] Calendly calendar booking working
- [ ] Test HOT lead sends email
- [ ] Google Analytics tracking

**Optional:**
- [ ] Twilio SMS alerts for HOT leads
- [ ] Facebook Pixel tracking
- [ ] Custom domain for emails
- [ ] Follow-up sequence automation

**Marketing:**
- [ ] Share link on social media
- [ ] Add to Google My Business
- [ ] Update email signature
- [ ] Set up Google Ads campaign
- [ ] Create Facebook ad campaign

---

## 🎯 Success Metrics - First 30 Days

**Week 1 Goals:**
- [ ] 10 leads submitted
- [ ] 5 calls made
- [ ] 2 inspections scheduled
- [ ] 1 quote sent

**Week 2-4 Goals:**
- [ ] 50 total leads
- [ ] 25 calls made
- [ ] 10 inspections scheduled
- [ ] 5 quotes sent
- [ ] 1-2 projects won

**By Day 30:**
- Your lead generation is on autopilot
- You're responding to leads within 1 hour
- You've won your first few projects from the system
- You understand which marketing channels work best

---

## 🚀 You've Got This!

This system will transform how you get roofing leads. You've gone from:

**Before:**
- Manual follow-ups
- Lost leads
- No tracking
- Reactive marketing

**After:**
- Automated lead capture
- Instant notifications
- Full analytics
- Proactive outreach
- Professional customer experience

**Remember:** Speed wins. The faster you respond, the more jobs you close!

Questions? Check the full guide in `LEAD_GENERATION_GUIDE.md`

Good luck! 🎉
