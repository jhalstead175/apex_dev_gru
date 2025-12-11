// Analytics and Conversion Tracking

/**
 * Track lead submission to Google Analytics
 */
export const trackLeadSubmission = (lead) => {
  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (!gaTrackingId) {
    console.log('GA not configured');
    return;
  }

  // Google Analytics 4 event
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      lead_tier: lead.lead_tier,
      lead_score: lead.lead_score,
      timeline: lead.timeline,
      roof_condition: lead.roof_condition,
      value: getLeadValue(lead.lead_tier),
      currency: 'USD',
    });

    // Custom event for lead tier
    window.gtag('event', `lead_${lead.lead_tier.toLowerCase()}`, {
      score: lead.lead_score,
      timeline: lead.timeline,
    });
  }
};

/**
 * Track to Facebook Pixel
 */
export const trackFacebookLead = (lead) => {
  const fbPixelId = import.meta.env.VITE_FB_PIXEL_ID;

  if (!fbPixelId) {
    console.log('FB Pixel not configured');
    return;
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: 'Roofing Lead',
      content_category: lead.lead_tier,
      value: getLeadValue(lead.lead_tier),
      currency: 'USD',
      status: lead.timeline,
    });
  }
};

/**
 * Track page view
 */
export const trackPageView = (pagePath) => {
  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (!gaTrackingId) return;

  if (typeof window.gtag === 'function') {
    window.gtag('config', gaTrackingId, {
      page_path: pagePath,
    });
  }
};

/**
 * Track form step progression
 */
export const trackFormStep = (step) => {
  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (!gaTrackingId) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'form_progress', {
      form_name: 'roofing_lead_gen',
      form_step: step,
    });
  }
};

/**
 * Track calendar booking click
 */
export const trackCalendarBooking = () => {
  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (!gaTrackingId) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'schedule_inspection', {
      event_category: 'engagement',
      event_label: 'calendly_booking',
    });
  }

  // Facebook Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Schedule', {
      content_name: 'Roof Inspection',
    });
  }
};

/**
 * Get estimated value for lead tier
 * Used for ROI tracking in analytics
 */
const getLeadValue = (tier) => {
  const values = {
    HOT: 500,
    WARM: 300,
    QUALIFIED: 150,
    PROSPECT: 50,
  };
  return values[tier] || 0;
};

/**
 * Initialize Google Analytics
 * Call this in your app initialization
 */
export const initGoogleAnalytics = () => {
  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (!gaTrackingId) {
    console.log('Google Analytics not configured');
    return;
  }

  // Check if gtag script already exists
  if (document.querySelector(`script[src*="googletagmanager.com"]`)) {
    return;
  }

  // Add gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaTrackingId);

  console.log('Google Analytics initialized');
};

/**
 * Initialize Facebook Pixel
 * Call this in your app initialization
 */
export const initFacebookPixel = () => {
  const fbPixelId = import.meta.env.VITE_FB_PIXEL_ID;

  if (!fbPixelId) {
    console.log('Facebook Pixel not configured');
    return;
  }

  // Check if fbq already exists
  if (window.fbq) {
    return;
  }

  // Initialize Facebook Pixel
  !(function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  })(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', fbPixelId);
  window.fbq('track', 'PageView');

  console.log('Facebook Pixel initialized');
};

/**
 * Initialize all analytics
 */
export const initAnalytics = () => {
  initGoogleAnalytics();
  initFacebookPixel();
};

export default {
  trackLeadSubmission,
  trackFacebookLead,
  trackPageView,
  trackFormStep,
  trackCalendarBooking,
  initAnalytics,
  initGoogleAnalytics,
  initFacebookPixel,
};
