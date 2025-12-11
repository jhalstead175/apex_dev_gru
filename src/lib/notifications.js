// Email and SMS Notification System for Apex Leads

/**
 * Send email notification for new leads
 * This can be called from Supabase Edge Functions or client-side
 */
export const sendLeadNotificationEmail = async (lead) => {
  const notificationEmail = import.meta.env.VITE_NOTIFICATION_EMAIL || 'dan@apexdevelopmentgroup.com';
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('Resend API key not configured. Skipping email notification.');
    return { success: false, error: 'No API key' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Apex Leads <notifications@apexdevelopmentgroup.com>',
        to: [notificationEmail],
        subject: `${lead.lead_tier === 'HOT' ? '🔥 HOT' : '📋'} New Lead: ${lead.full_name}`,
        html: generateLeadEmailHtml(lead),
      }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Email notification error:', error);
    return { success: false, error };
  }
};

/**
 * Send SMS notification for HOT leads
 * Uses Twilio API
 */
export const sendLeadNotificationSMS = async (lead) => {
  const twilioAccountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  const twilioAuthToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
  const notificationPhone = import.meta.env.VITE_NOTIFICATION_PHONE;

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.warn('Twilio not configured. Skipping SMS notification.');
    return { success: false, error: 'No Twilio config' };
  }

  // Only send SMS for HOT leads
  if (lead.lead_tier !== 'HOT') {
    return { success: false, error: 'Not a hot lead' };
  }

  try {
    const message = `🔥 HOT LEAD ALERT!\n\n${lead.full_name}\n${lead.phone}\n${lead.address}\n\nScore: ${lead.lead_score}/100\nTimeline: ${lead.timeline}\nActive Leaks: ${lead.active_leaks}\n\nView dashboard: ${window.location.origin}/RoofingLeadsDashboard`;

    const credentials = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          To: notificationPhone,
          From: twilioPhoneNumber,
          Body: message,
        }),
      }
    );

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('SMS notification error:', error);
    return { success: false, error };
  }
};

/**
 * Send automated welcome email to lead
 */
export const sendWelcomeEmail = async (lead) => {
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('Resend API key not configured. Skipping welcome email.');
    return { success: false, error: 'No API key' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Apex Development Group <hello@apexdevelopmentgroup.com>',
        to: [lead.email],
        subject: 'Thank You for Your Roofing Assessment Request',
        html: generateWelcomeEmailHtml(lead),
      }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error };
  }
};

/**
 * Schedule follow-up email sequence
 * This would typically be handled by Supabase Edge Functions on a cron job
 */
export const scheduleFollowUpSequence = async (lead) => {
  // This is a placeholder - in production, you'd:
  // 1. Store follow-up schedule in Supabase
  // 2. Use Supabase Edge Functions with cron to send emails
  // 3. Or integrate with email marketing platform (Mailchimp, SendGrid, etc.)

  const sequence = getFollowUpSequence(lead.lead_tier);
  console.log('Follow-up sequence scheduled:', sequence);

  return { success: true, sequence };
};

/**
 * Get follow-up email sequence based on lead tier
 */
const getFollowUpSequence = (tier) => {
  const sequences = {
    HOT: [
      { delay: 0, subject: 'Immediate Follow-Up', template: 'hot_immediate' },
      { delay: 24, subject: 'Checking In', template: 'hot_followup_1' },
      { delay: 72, subject: 'Special Offer', template: 'hot_offer' },
    ],
    WARM: [
      { delay: 24, subject: 'About Your Roof Assessment', template: 'warm_followup_1' },
      { delay: 72, subject: 'Roofing Tips & Free Quote', template: 'warm_tips' },
      { delay: 168, subject: 'Still Interested?', template: 'warm_check_in' },
    ],
    QUALIFIED: [
      { delay: 48, subject: 'Your Roofing Options', template: 'qualified_options' },
      { delay: 168, subject: 'Educational Resources', template: 'qualified_education' },
    ],
    PROSPECT: [
      { delay: 168, subject: 'Roofing Maintenance Tips', template: 'prospect_tips' },
      { delay: 720, subject: 'Seasonal Checkup Reminder', template: 'prospect_seasonal' },
    ],
  };

  return sequences[tier] || sequences.PROSPECT;
};

/**
 * Generate HTML email for lead notification
 */
const generateLeadEmailHtml = (lead) => {
  const tierColors = {
    HOT: '#dc2626',
    WARM: '#f97316',
    QUALIFIED: '#eab308',
    PROSPECT: '#3b82f6',
  };

  const tierColor = tierColors[lead.lead_tier] || '#6b7280';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #0A1A3A; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #B48A3C; margin: 0;">New Lead Received!</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: ${tierColor}; color: white; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 24px;">${lead.lead_tier} LEAD - Score: ${lead.lead_score}/100</h2>
            </div>

            <h3 style="color: #0A1A3A; border-bottom: 2px solid #B48A3C; padding-bottom: 10px;">Contact Information</h3>
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${lead.full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0;"><a href="tel:${lead.phone}" style="color: #3b82f6;">${lead.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #3b82f6;">${lead.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Address:</strong></td>
                <td style="padding: 8px 0;">${lead.address}</td>
              </tr>
            </table>

            <h3 style="color: #0A1A3A; border-bottom: 2px solid #B48A3C; padding-bottom: 10px;">Property Details</h3>
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0;"><strong>Property Type:</strong></td>
                <td style="padding: 8px 0;">${lead.property_type}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Roof Age:</strong></td>
                <td style="padding: 8px 0;">${lead.roof_age} years</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Condition:</strong></td>
                <td style="padding: 8px 0; text-transform: capitalize;">${lead.roof_condition}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Timeline:</strong></td>
                <td style="padding: 8px 0;">${lead.timeline}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Active Leaks:</strong></td>
                <td style="padding: 8px 0; color: ${lead.active_leaks === 'yes' ? '#dc2626' : '#16a34a'}; font-weight: bold;">${lead.active_leaks === 'yes' ? 'YES ⚠️' : 'No'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Visible Damage:</strong></td>
                <td style="padding: 8px 0; text-transform: capitalize;">${lead.visible_damage}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Recent Storm:</strong></td>
                <td style="padding: 8px 0; text-transform: capitalize;">${lead.recent_storm}</td>
              </tr>
            </table>

            ${lead.lead_tier === 'HOT' ? `
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
                <h4 style="color: #dc2626; margin: 0 0 10px 0;">🔥 Priority Action Required</h4>
                <p style="margin: 0;">This is a HOT lead with urgent roofing needs. Contact within 1 hour for best conversion rate.</p>
              </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.vercel.app'}/RoofingLeadsDashboard"
                 style="background-color: #B48A3C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View Full Details in Dashboard
              </a>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
            <p>Apex Development Group | Building Excellence in Pennsylvania</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate HTML email for welcome message to lead
 */
const generateWelcomeEmailHtml = (lead) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #0A1A3A; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #B48A3C; margin: 0 0 10px 0;">Thank You, ${lead.full_name.split(' ')[0]}!</h1>
            <p style="color: white; margin: 0; font-size: 16px;">We've received your roofing assessment request</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #0A1A3A; margin-top: 0;">What Happens Next?</h2>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #0A1A3A; margin-top: 0;">📋 Your Assessment Summary</h3>
              <p style="margin: 10px 0;"><strong>Property:</strong> ${lead.address}</p>
              <p style="margin: 10px 0;"><strong>Roof Age:</strong> ${lead.roof_age} years</p>
              <p style="margin: 10px 0;"><strong>Timeline:</strong> ${lead.timeline}</p>
              <p style="margin: 10px 0;"><strong>Assessment Score:</strong> ${lead.lead_score}/100</p>
            </div>

            <h3 style="color: #0A1A3A;">Our Process:</h3>
            <ol style="line-height: 2;">
              <li><strong>Review (Next 24 Hours):</strong> Our roofing specialists will review your assessment</li>
              <li><strong>Contact:</strong> We'll reach out to schedule a free, no-obligation inspection</li>
              <li><strong>Inspection:</strong> One of our certified inspectors will evaluate your roof</li>
              <li><strong>Detailed Quote:</strong> You'll receive a comprehensive quote with options</li>
              <li><strong>Decision:</strong> Take your time to review and ask questions</li>
            </ol>

            ${lead.lead_tier === 'HOT' ? `
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
                <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚡ Priority Scheduling</h4>
                <p style="margin: 0;">Based on your assessment, we've flagged your property for priority scheduling. Our team will contact you within 24 hours.</p>
              </div>
            ` : ''}

            <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #0A1A3A; margin-top: 0;">💡 Quick Tips While You Wait:</h3>
              <ul style="line-height: 1.8;">
                <li>Document any visible damage with photos</li>
                <li>Check your homeowner's insurance policy</li>
                <li>Clear debris from gutters and roof edges</li>
                <li>Note any interior water stains or leaks</li>
              </ul>
            </div>

            <h3 style="color: #0A1A3A;">Questions?</h3>
            <p>Feel free to reach out:</p>
            <p style="margin: 5px 0;">📞 <a href="tel:+15551234567" style="color: #3b82f6;">(555) 123-4567</a></p>
            <p style="margin: 5px 0;">📧 <a href="mailto:info@apexdevelopmentgroup.com" style="color: #3b82f6;">info@apexdevelopmentgroup.com</a></p>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                <strong>Apex Development Group</strong><br>
                Building Excellence in Pennsylvania Since 1998<br>
                BBB A+ Rated | 500+ Projects Completed | 98% Customer Satisfaction
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default {
  sendLeadNotificationEmail,
  sendLeadNotificationSMS,
  sendWelcomeEmail,
  scheduleFollowUpSequence,
};
