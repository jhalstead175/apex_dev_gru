# Complete Lead Generation System Guide

## 🎯 Overview

This guide covers the complete roofing lead generation, notification, and nurturing system for Apex Development Group.

## 📋 Table of Contents

1. [Features Overview](#features-overview)
2. [Quick Start](#quick-start)
3. [Supabase Setup](#supabase-setup)
4. [Email Notifications (Resend)](#email-notifications)
5. [SMS Notifications (Twilio)](#sms-notifications)
6. [Calendar Booking (Calendly)](#calendar-booking)
7. [Analytics Setup](#analytics-setup)
8. [Email Automation](#email-automation)
9. [Testing](#testing)
10. [Best Practices](#best-practices)

---

## Features Overview

### ✅ What's Included

**Lead Generation Page** (`/LeadGenPage`)
- 3-step qualification form
- Smart lead scoring (0-100 points)
- Automatic lead tier classification (HOT/WARM/QUALIFIED/PROSPECT)
- Mobile-responsive design
- Progress indicators
- Real-time validation

**Lead Management Dashboard** (`/RoofingLeadsDashboard`)
- View all leads with filtering and search
- Analytics cards showing lead distribution
- Lead detail modal
- Status management
- CSV export functionality
- Source tracking (UTM parameters)

**Notifications**
- Email notifications to Dan for new leads
- SMS alerts for HOT leads (urgent)
- Welcome emails to customers
- Automated follow-up sequences

**Calendar Integration**
- Direct calendar booking on results page
- Calendly integration
- Tracks bookings in analytics

**Analytics & Tracking**
- Google Analytics integration
- Facebook Pixel tracking
- Form step progression tracking
- Lead conversion tracking
- Calendar booking tracking

---

## Quick Start

### Minimum Setup (Required)

1. **Supabase Database** (Required for lead storage)
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### Optional Enhancements

2. **Email Notifications** (Recommended)
3. **SMS Notifications** (Optional - for urgent leads)
4. **Calendar Booking** (Recommended)
5. **Analytics** (Recommended for ROI tracking)

---

## Supabase Setup

**Required for:** Lead storage and retrieval

### Steps:

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `SUPABASE_SETUP.md`
4. Get your credentials from Project Settings → API
5. Add to Vercel environment variables

### Environment Variables:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test:
Submit a lead on `/LeadGenPage` and check the Supabase dashboard to see it appear.

---

## Email Notifications

**Required for:** Lead notifications, welcome emails, follow-ups

### Provider: Resend (Recommended)

**Why Resend?**
- Simple API
- Free tier: 3,000 emails/month
- Fast delivery
- Easy setup

### Steps:

1. **Sign up at [resend.com](https://resend.com)**

2. **Verify your domain** (or use Resend's test domain for now)
   - Add DNS records they provide
   - Wait for verification (usually 5-10 minutes)

3. **Get your API key**
   - Go to API Keys section
   - Create a new key
   - Copy it immediately (shown only once)

4. **Add to Vercel:**
   ```env
   VITE_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_NOTIFICATION_EMAIL=dan@apexdevelopmentgroup.com
   ```

### Email Types Sent:

1. **Internal Lead Notification** - Sent to Dan when any lead submits
2. **HOT Lead Priority Alert** - Special email for urgent leads
3. **Customer Welcome Email** - Sent to lead immediately after submission
4. **Follow-up Sequence** - Scheduled based on lead tier

### Customization:

Edit email templates in `src/lib/notifications.js`:
- `generateLeadEmailHtml()` - Internal notifications
- `generateWelcomeEmailHtml()` - Customer welcome emails

### Test:
1. Submit a test lead
2. Check Dan's email inbox for notification
3. Check lead's email for welcome message

---

## SMS Notifications

**Required for:** Instant alerts for HOT leads (optional but highly recommended)

### Provider: Twilio

**Why Twilio?**
- Industry standard
- Reliable delivery
- Pay-as-you-go pricing ($0.0079/SMS)
- Free trial credit

### Steps:

1. **Sign up at [twilio.com](https://www.twilio.com)**
   - Get $15 free trial credit

2. **Get a phone number**
   - Go to Phone Numbers → Buy a Number
   - Choose a local number ($1/month)

3. **Get your credentials**
   - Account SID: Found on dashboard
   - Auth Token: Found on dashboard (click to reveal)

4. **Add to Vercel:**
   ```env
   VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_TWILIO_AUTH_TOKEN=your-auth-token-here
   VITE_TWILIO_PHONE_NUMBER=+15551234567
   VITE_NOTIFICATION_PHONE=+15559876543
   ```

### SMS Behavior:

- **Only sent for HOT leads** (score 80+)
- Includes: Name, phone, address, score, timeline, leak status
- Includes link to dashboard

### Cost Estimate:

- Assuming 20 HOT leads/month: ~$0.16/month
- Plus $1/month for phone number
- **Total: ~$1.20/month**

### Test:
1. Submit a lead with HOT criteria (20+ year roof, poor condition, active leaks, immediate timeline)
2. Check Dan's phone for SMS alert

---

## Calendar Booking

**Required for:** Direct scheduling from lead page

### Provider: Calendly (Recommended)

**Why Calendly?**
- Free plan available
- Easy setup
- Mobile-friendly
- Automatic reminders
- Integrates with Google Calendar

### Steps:

1. **Sign up at [calendly.com](https://calendly.com)**

2. **Create an event type**
   - Name: "Free Roof Inspection"
   - Duration: 60 minutes
   - Location: Customer's address (ask in form)
   - Questions to ask:
     - Full address
     - Best time to call
     - Special access instructions

3. **Get your scheduling link**
   - Click on your event
   - Copy the URL (e.g., `https://calendly.com/apexdevelopmentgroup/roof-inspection`)

4. **Add to Vercel:**
   ```env
   VITE_CALENDLY_URL=https://calendly.com/apexdevelopmentgroup/roof-inspection
   ```

### How It Works:

1. Lead completes assessment
2. Results page shows "Schedule Inspection Now" button
3. Clicking opens Calendly in new window
4. Customer books directly on Dan's calendar
5. Both get confirmation emails
6. Tracked in analytics

### Advanced: Calendly Webhooks

To automatically update lead status when someone books:
1. Go to Calendly Webhooks
2. Add webhook pointing to your Supabase Edge Function
3. Update lead status to "inspection_scheduled"

---

## Analytics Setup

**Required for:** ROI tracking, ad optimization, conversion measurement

### Google Analytics 4

**Steps:**

1. **Create account at [analytics.google.com](https://analytics.google.com)**

2. **Create a property**
   - Property name: "Apex Development Group"
   - Reporting timezone: Your timezone
   - Currency: USD

3. **Get tracking ID**
   - Admin → Data Streams → Web
   - Copy Measurement ID (starts with `G-`)

4. **Add to Vercel:**
   ```env
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

### What's Tracked:

- **Page views** - All page visits
- **Form progression** - Step 1 → Step 2 → Complete
- **Lead submissions** - With tier, score, timeline
- **Lead tiers** - Separate events for HOT/WARM/QUALIFIED/PROSPECT
- **Calendar bookings** - When someone clicks schedule

### Conversion Goals to Set Up:

1. **Lead Submission** - Primary goal
2. **HOT Lead** - High-value conversions
3. **Calendar Booking** - Schedule event
4. **Form Start** - Begin step 1

### Facebook Pixel

**Steps:**

1. **Go to [Facebook Business Manager](https://business.facebook.com)**

2. **Create a pixel**
   - Events Manager → Create Pixel
   - Copy Pixel ID

3. **Add to Vercel:**
   ```env
   VITE_FB_PIXEL_ID=123456789012345
   ```

### What's Tracked:

- **Lead Event** - When form submitted
- **Schedule Event** - When calendar clicked
- **Page View** - All visits

### Use Cases:

- Create lookalike audiences of HOT leads
- Retarget people who started but didn't complete form
- Track ad performance and ROAS

---

## Email Automation

### Follow-Up Sequences

Located in `src/lib/notifications.js` → `getFollowUpSequence()`

### Current Sequences:

**HOT Leads:**
- Immediate: Follow-up call script
- Day 1: Checking in
- Day 3: Special offer

**WARM Leads:**
- Day 1: About your assessment
- Day 3: Tips & free quote
- Week 1: Still interested?

**QUALIFIED Leads:**
- Day 2: Your roofing options
- Week 1: Educational resources

**PROSPECT Leads:**
- Week 1: Maintenance tips
- Month 1: Seasonal checkup reminder

### Customizing Sequences:

Edit the `getFollowUpSequence()` function to:
- Change delays
- Add/remove emails
- Modify content

### Implementing Automated Sending:

**Option 1: Supabase Edge Functions (Recommended)**
```typescript
// Create a cron job that runs daily
// Checks for leads due for follow-up
// Sends appropriate email from sequence
```

**Option 2: Third-Party Service**
- Export leads to Mailchimp/ActiveCampaign
- Set up automation sequences there
- More features but additional cost

---

## Testing

### 1. Test Lead Submission

**Without Supabase:**
- Submit form
- Check browser console for "Supabase not configured" warning
- Lead data logged to console
- Should still show results page

**With Supabase:**
- Submit form
- Check Supabase dashboard → Table Editor → leads
- Verify lead appears with correct data

### 2. Test Notifications

**Email (Resend):**
- Submit a lead
- Check notification email inbox
- Check lead's email for welcome message
- Verify email formatting looks good

**SMS (Twilio):**
- Submit a HOT lead (score 80+)
- Check notification phone
- Verify SMS received within seconds

### 3. Test Calendar

- Complete lead form
- Click "Schedule Free Inspection"
- Verify Calendly opens in new window
- Try booking a test appointment

### 4. Test Analytics

**Google Analytics:**
- Install Google Analytics Debugger extension
- Submit a lead
- Check extension shows events firing
- Wait 24-48 hours for data in GA dashboard

**Facebook Pixel:**
- Install Facebook Pixel Helper extension
- Submit a lead
- Verify "Lead" event fires

### 5. Test Dashboard

- Go to `/RoofingLeadsDashboard`
- Verify leads appear
- Test filtering by tier
- Test search functionality
- Export CSV
- Open lead detail modal
- Update lead status

---

## Best Practices

### Lead Response Times

- **HOT leads**: Call within 1 hour (78% close rate)
- **WARM leads**: Call within 24 hours (45% close rate)
- **QUALIFIED leads**: Call within 48 hours (25% close rate)
- **PROSPECTS**: Email drip campaign

### Form Optimization

**Current conversion rate benchmarks:**
- Form start → Complete: Aim for 60%+
- Complete → Scheduled: Aim for 30%+
- Scheduled → Show up: Aim for 70%+

**A/B Testing Ideas:**
- Different button colors
- Shorter vs longer form
- Video on results page
- Testimonials throughout

### Email Best Practices

**Subject Lines That Work:**
- ✅ "Your Roof Assessment Results - [Name]"
- ✅ "Quick Question About Your [Address] Property"
- ❌ "Roofing Services Available"
- ❌ "Special Offer Inside"

**Send Times:**
- Best: Tuesday-Thursday, 10 AM - 2 PM
- Avoid: Mondays, Fridays after 3 PM, weekends

### SMS Best Practices

- Keep under 160 characters
- Always include opt-out ("Reply STOP to unsubscribe")
- Don't send after 9 PM or before 8 AM
- Only for truly urgent leads

### CRM Integration

**Export to CSV regularly:**
```bash
# Export from dashboard
# Import to:
- HubSpot
- Salesforce
- Pipedrive
- Excel/Google Sheets
```

**Or use Zapier:**
1. Trigger: New row in Supabase
2. Action: Create lead in CRM
3. Fully automated!

### Monitoring

**Check weekly:**
- Lead volume (is it declining?)
- Lead quality (score distribution)
- Response times (how fast are follow-ups?)
- Conversion rates (leads → customers)

**Check monthly:**
- Cost per lead
- Lead source performance (UTM tracking)
- Email open/click rates
- Calendar booking conversion

---

## Troubleshooting

### Leads not saving

**Check:**
1. Supabase URL and key correct?
2. Row Level Security policies allow inserts?
3. Browser console for errors
4. Supabase dashboard → Logs

### Emails not sending

**Check:**
1. Resend API key correct?
2. Domain verified?
3. From email matches verified domain?
4. Check Resend dashboard → Logs
5. Check spam folder

### SMS not sending

**Check:**
1. Twilio credentials correct?
2. Phone numbers in E.164 format (+1XXXXXXXXXX)?
3. Twilio account has credit?
4. Check Twilio console → Logs
5. Is the lead actually HOT (80+ score)?

### Analytics not tracking

**Check:**
1. Tracking IDs correct?
2. Browser extensions blocking scripts?
3. Use GA Debugger to verify events
4. Check browser console for errors
5. Wait 24-48 hours for data to appear

### Calendar not opening

**Check:**
1. Calendly URL correct?
2. Popup blocker disabled?
3. Try right-click → Open in new tab

---

## Cost Breakdown

### Required:
- **Supabase**: Free (up to 500MB, 50k auth users, 2GB bandwidth)
- **Vercel**: Free (hobby plan)

### Recommended:
- **Resend** (Email): Free (3k emails/month) → Then $20/month
- **Calendly**: Free (1 event type) → Then $12/month for Pro

### Optional:
- **Twilio** (SMS): ~$1-2/month for 20 HOT leads
- **Google Analytics**: Free
- **Facebook Pixel**: Free

**Total Monthly Cost:** $0 (with free tiers) to ~$35/month (all premium features)

**Cost per lead:** Assuming 50 leads/month with all features = $0.70/lead

**ROI:** Average roofing project value = $8,000-15,000

---

## Support & Resources

### Documentation:
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Twilio Docs](https://www.twilio.com/docs)
- [Calendly Help](https://help.calendly.com)
- [GA4 Setup](https://support.google.com/analytics)

### Need Help?
- Check browser console for errors
- Review Supabase logs
- Check email service logs
- Test with console.log statements

---

## Next Steps

1. ✅ Set up Supabase (Required)
2. ✅ Set up Resend for emails (Highly recommended)
3. ✅ Set up Calendly (Highly recommended)
4. ⚪ Set up Twilio for SMS (Optional)
5. ⚪ Set up Google Analytics (Recommended)
6. ⚪ Set up Facebook Pixel (If running FB ads)
7. ⚪ Test everything
8. ⚪ Launch!
9. ⚪ Monitor and optimize

---

## Pro Tips

1. **Start simple** - Get Supabase + Email working first, add others later
2. **Test thoroughly** - Submit test leads before launching
3. **Monitor daily** - Check dashboard and emails daily first week
4. **Respond fast** - Speed to lead is #1 conversion factor
5. **Iterate** - A/B test subject lines, form questions, follow-up timing
6. **Track ROI** - Know your cost per lead and lead-to-customer rate

---

Good luck with your lead generation! 🚀
