import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, data } = await req.json();

        // Analyze leads and send follow-ups
        if (action === 'process_followups') {
            const leads = await base44.asServiceRole.entities.Lead.list();
            const now = new Date();
            const followUpResults = [];

            for (const lead of leads) {
                // Skip closed leads
                if (lead.stage === 'closed_won' || lead.stage === 'closed_lost') {
                    continue;
                }

                const lastContact = lead.last_contact_date ? new Date(lead.last_contact_date) : new Date(lead.created_date);
                const daysSinceContact = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));

                let shouldFollowUp = false;
                let followUpType = '';
                let urgency = 'normal';

                // Follow-up logic based on stage and inactivity
                if (lead.stage === 'new_lead' && daysSinceContact >= 2) {
                    shouldFollowUp = true;
                    followUpType = 'initial_contact';
                    urgency = 'high';
                } else if (lead.stage === 'contacted' && daysSinceContact >= 3) {
                    shouldFollowUp = true;
                    followUpType = 'quote_reminder';
                } else if (lead.stage === 'quote_sent' && daysSinceContact >= 5) {
                    shouldFollowUp = true;
                    followUpType = 'quote_followup';
                    urgency = 'high';
                } else if (lead.stage === 'negotiation' && daysSinceContact >= 4) {
                    shouldFollowUp = true;
                    followUpType = 'negotiation_nudge';
                    urgency = 'high';
                }

                if (shouldFollowUp && lead.email) {
                    const emailContent = generateFollowUpEmail(lead, followUpType);
                    
                    try {
                        await base44.asServiceRole.integrations.Core.SendEmail({
                            from_name: 'Aegis Spec Group',
                            to: lead.email,
                            subject: emailContent.subject,
                            body: emailContent.body
                        });

                        // Update last contact date
                        await base44.asServiceRole.entities.Lead.update(lead.id, {
                            last_contact_date: now.toISOString().split('T')[0]
                        });

                        followUpResults.push({
                            leadId: lead.id,
                            clientName: lead.client_name,
                            followUpType,
                            urgency,
                            status: 'sent'
                        });
                    } catch (error) {
                        followUpResults.push({
                            leadId: lead.id,
                            clientName: lead.client_name,
                            followUpType,
                            urgency,
                            status: 'failed',
                            error: error.message
                        });
                    }
                }
            }

            return Response.json({
                success: true,
                followUpsSent: followUpResults.length,
                results: followUpResults
            });
        }

        // Get sales insights and recommendations
        if (action === 'get_sales_insights') {
            const leads = await base44.asServiceRole.entities.Lead.list();
            const projects = await base44.asServiceRole.entities.Project.list();
            const quotes = await base44.asServiceRole.entities.Quote.list();

            const now = new Date();
            const insights = {
                urgentLeads: [],
                stagnantLeads: [],
                highValueLeads: [],
                conversionMetrics: {},
                recommendations: []
            };

            // Analyze each lead
            for (const lead of leads) {
                if (lead.stage === 'closed_won' || lead.stage === 'closed_lost') {
                    continue;
                }

                const lastContact = lead.last_contact_date ? new Date(lead.last_contact_date) : new Date(lead.created_date);
                const daysSinceContact = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));
                const createdDate = new Date(lead.created_date);
                const daysInPipeline = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

                // Identify urgent leads (high value + no recent contact)
                if (lead.quote_value >= 25000 && daysSinceContact >= 3) {
                    insights.urgentLeads.push({
                        id: lead.id,
                        clientName: lead.client_name,
                        quoteValue: lead.quote_value,
                        daysSinceContact,
                        stage: lead.stage,
                        recommendation: `High-value lead ($${lead.quote_value.toLocaleString()}) - Immediate personal follow-up recommended`
                    });
                }

                // Identify stagnant leads (stuck in stage too long)
                const stageThresholds = {
                    new_lead: 3,
                    contacted: 7,
                    quote_sent: 10,
                    negotiation: 7
                };

                if (daysInPipeline > stageThresholds[lead.stage]) {
                    insights.stagnantLeads.push({
                        id: lead.id,
                        clientName: lead.client_name,
                        stage: lead.stage,
                        daysInPipeline,
                        quoteValue: lead.quote_value,
                        recommendation: `Stuck in ${lead.stage} for ${daysInPipeline} days. Consider: ${getStageRecommendation(lead.stage, daysInPipeline)}`
                    });
                }

                // Identify high-value leads needing attention
                if (lead.quote_value >= 30000) {
                    insights.highValueLeads.push({
                        id: lead.id,
                        clientName: lead.client_name,
                        quoteValue: lead.quote_value,
                        stage: lead.stage,
                        daysSinceContact,
                        priority: daysSinceContact > 3 ? 'urgent' : 'normal'
                    });
                }
            }

            // Calculate conversion metrics
            const stageCounts = leads.reduce((acc, lead) => {
                acc[lead.stage] = (acc[lead.stage] || 0) + 1;
                return acc;
            }, {});

            insights.conversionMetrics = {
                totalLeads: leads.length,
                byStage: stageCounts,
                conversionRate: stageCounts.new_lead > 0 
                    ? ((stageCounts.closed_won || 0) / stageCounts.new_lead * 100).toFixed(1) + '%'
                    : '0%',
                averageQuoteValue: leads.reduce((sum, l) => sum + (l.quote_value || 0), 0) / leads.length || 0
            };

            // Generate recommendations
            insights.recommendations = generateSalesRecommendations(leads, insights);

            return Response.json({
                success: true,
                insights
            });
        }

        // Manual follow-up trigger for specific lead
        if (action === 'send_followup') {
            const { leadId, followUpType } = data;

            const leads = await base44.asServiceRole.entities.Lead.list();
            const lead = leads.find(l => l.id === leadId);

            if (!lead) {
                return Response.json({ error: 'Lead not found' }, { status: 404 });
            }

            if (!lead.email) {
                return Response.json({ error: 'Lead has no email address' }, { status: 400 });
            }

            const emailContent = generateFollowUpEmail(lead, followUpType || 'general_followup');

            await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: 'Aegis Spec Group',
                to: lead.email,
                subject: emailContent.subject,
                body: emailContent.body
            });

            // Update last contact date
            await base44.asServiceRole.entities.Lead.update(lead.id, {
                last_contact_date: new Date().toISOString().split('T')[0]
            });

            return Response.json({
                success: true,
                message: 'Follow-up email sent successfully',
                leadName: lead.client_name
            });
        }

        return Response.json({ 
            error: 'Invalid action. Use: process_followups, get_sales_insights, or send_followup' 
        }, { status: 400 });

    } catch (error) {
        return Response.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
});

// Helper function to generate follow-up emails
function generateFollowUpEmail(lead, followUpType) {
    const templates = {
        initial_contact: {
            subject: `${lead.client_name}, Let's Discuss Your Roofing Project`,
            body: `Dear ${lead.client_name},

Thank you for your interest in Aegis Spec Group! I wanted to personally reach out regarding your property at ${lead.address}.

We specialize in providing data-driven roofing solutions with transparent pricing and expert consultation. Our team would love to discuss your specific needs and provide you with a comprehensive assessment.

Key Benefits of Working with Aegis:
• Free professional property assessment
• Transparent, detailed specifications
• Insurance claim assistance
• 5-year workmanship warranty
• Premium materials and certified crews

Would you be available for a brief 15-minute call this week to discuss your project? I can answer any questions and schedule an inspection at your convenience.

Best regards,
Aegis Spec Group Sales Team

P.S. ${lead.quote_value ? `Based on your initial inquiry, we estimate your project in the $${Math.round(lead.quote_value * 0.9).toLocaleString()} - $${Math.round(lead.quote_value * 1.1).toLocaleString()} range.` : 'We can provide a detailed quote within 24 hours of your property inspection.'}

---
Schedule Your Free Assessment: [Book Now]
Questions? Reply to this email or call us at (555) 123-4567`
        },
        quote_reminder: {
            subject: `Ready to Provide Your Custom Roofing Quote - ${lead.client_name}`,
            body: `Dear ${lead.client_name},

Following up on our recent conversation about your roofing project at ${lead.address}.

We're ready to provide you with a detailed, AI-powered quote that includes:
✓ Comprehensive cost breakdown
✓ Material specifications and options
✓ Project timeline estimate
✓ Warranty information
✓ Financing options

Our quotes are:
• Transparent and detailed
• Valid for 30 days
• No obligation to proceed
• Include expert recommendations

To generate your custom quote, we just need a few more details about your roof specifications. This takes less than 5 minutes online, or we can schedule a quick property inspection.

Get Your Quote: [Quote Generator Link]

Questions about the process? I'm here to help!

Best regards,
Aegis Spec Group Team

---
Call us: (555) 123-4567 | Email: sales@aegisspecgroup.com`
        },
        quote_followup: {
            subject: `Questions About Your Aegis Quote? - ${lead.client_name}`,
            body: `Dear ${lead.client_name},

I wanted to follow up on the quote we provided for your roofing project at ${lead.address}.

${lead.quote_value ? `Your estimated project investment: $${lead.quote_value.toLocaleString()}` : ''}

Do you have any questions about:
• The scope of work?
• Material options and upgrades?
• Project timeline?
• Financing options?
• Our warranty coverage?

We're committed to making sure you feel confident in your decision. Many of our clients appreciate:

1. Free On-Site Consultation: We can visit your property to review the quote in detail
2. Material Samples: See and feel the quality of our materials
3. Reference Projects: View similar completed projects in your area
4. Flexible Scheduling: We work around your timeline

What would be most helpful for you right now?

I'm here to answer any questions and help you move forward with confidence.

Best regards,
Aegis Spec Group Sales Team

P.S. Remember, your quote is valid for 30 days, and we're currently booking projects ${getSeasonalUrgency()}.

---
Reply to this email | Call (555) 123-4567 | Schedule a Meeting: [Calendar Link]`
        },
        negotiation_nudge: {
            subject: `Let's Finalize Your Roofing Project - ${lead.client_name}`,
            body: `Dear ${lead.client_name},

I hope this email finds you well! I wanted to touch base regarding your roofing project at ${lead.address}.

I know making a decision on a significant investment like this takes time. Is there anything I can help clarify or any concerns I can address?

Special Considerations for You:
• We can adjust the project timeline to fit your schedule
• Flexible payment terms available
• Potential financing options
• Can phase the work if needed

Many clients find it helpful to:
✓ Walk through the property together to discuss specific concerns
✓ Review material samples and warranties in person
✓ Discuss any budget considerations openly
✓ Understand the step-by-step process

${lead.quote_value && lead.quote_value >= 25000 ? '\n🎁 For projects over $25,000, we include a complimentary 3-year maintenance program ($1,200 value).\n' : ''}

What's the best way I can help you move forward? Would a brief call or in-person meeting be helpful?

Looking forward to working with you!

Best regards,
Aegis Spec Group Team

---
Direct Line: (555) 123-4567 | Email Response Preferred
Book a Meeting: [Calendar Link]`
        },
        general_followup: {
            subject: `Checking In - Your Aegis Roofing Project`,
            body: `Dear ${lead.client_name},

I wanted to check in with you regarding your roofing project at ${lead.address}.

I'm here to help answer any questions or address any concerns you might have. Whether it's about pricing, materials, timeline, or anything else - I'm just a phone call or email away.

Is there anything I can help you with today?

Best regards,
Aegis Spec Group Team

---
Reply to this email or call (555) 123-4567`
        }
    };

    return templates[followUpType] || templates.general_followup;
}

// Helper function for stage-specific recommendations
function getStageRecommendation(stage, daysInPipeline) {
    const recommendations = {
        new_lead: 'Make initial contact via phone. Send personalized email with value proposition.',
        contacted: 'Send quote. Offer free property inspection. Highlight success stories.',
        quote_sent: 'Follow up with phone call. Address objections. Offer in-person meeting to review quote.',
        negotiation: 'Discuss flexible terms. Escalate to senior sales. Consider limited-time incentive.'
    };
    return recommendations[stage] || 'Re-engage with value-added information or special offer.';
}

// Helper function to get seasonal urgency
function getSeasonalUrgency() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return 'for spring and summer (our busy season)';
    if (month >= 6 && month <= 8) return 'through the summer months';
    if (month >= 9 && month <= 10) return 'before winter weather arrives';
    return 'for the upcoming season';
}

// Generate actionable sales recommendations
function generateSalesRecommendations(leads, insights) {
    const recommendations = [];

    if (insights.urgentLeads.length > 0) {
        recommendations.push({
            priority: 'high',
            category: 'High-Value Leads',
            action: `${insights.urgentLeads.length} high-value leads need immediate attention. These represent potential revenue of $${insights.urgentLeads.reduce((sum, l) => sum + l.quoteValue, 0).toLocaleString()}.`,
            suggestion: 'Schedule personal calls today. Prioritize face-to-face meetings.'
        });
    }

    if (insights.stagnantLeads.length > 5) {
        recommendations.push({
            priority: 'medium',
            category: 'Pipeline Velocity',
            action: `${insights.stagnantLeads.length} leads are stagnant in the pipeline.`,
            suggestion: 'Review and re-engage with fresh approach. Consider offering limited-time incentive.'
        });
    }

    const newLeadsCount = leads.filter(l => l.stage === 'new_lead').length;
    if (newLeadsCount > 10) {
        recommendations.push({
            priority: 'high',
            category: 'Lead Response',
            action: `${newLeadsCount} new leads waiting for initial contact.`,
            suggestion: 'Increase outreach capacity. Consider automated initial response followed by personal call within 24 hours.'
        });
    }

    const quoteSentCount = leads.filter(l => l.stage === 'quote_sent').length;
    if (quoteSentCount > 15) {
        recommendations.push({
            priority: 'medium',
            category: 'Quote Conversion',
            action: `${quoteSentCount} quotes pending decision.`,
            suggestion: 'Implement systematic follow-up. Schedule quote review meetings. Address common objections proactively.'
        });
    }

    return recommendations;
}