import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify user authentication
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, user_email } = await req.json();

    if (action === 'trigger_onboarding') {
      // Create default onboarding tasks for new user
      const defaultTasks = [
        {
          user_email: user_email,
          task_name: "Complete Your Profile",
          task_description: "Add your contact information and project details",
          task_order: 1,
          task_type: "setup",
          required: true
        },
        {
          user_email: user_email,
          task_name: "Review Project Timeline",
          task_description: "Familiarize yourself with your project milestones and schedule",
          task_order: 2,
          task_type: "tutorial",
          required: true
        },
        {
          user_email: user_email,
          task_name: "Upload Project Documents",
          task_description: "Share any existing documents, photos, or permits for your project",
          task_order: 3,
          task_type: "action",
          required: false
        },
        {
          user_email: user_email,
          task_name: "Set Communication Preferences",
          task_description: "Choose how you'd like to receive updates (email, SMS, portal)",
          task_order: 4,
          task_type: "setup",
          required: true
        },
        {
          user_email: user_email,
          task_name: "Schedule Initial Consultation",
          task_description: "Book your first meeting with your assigned project manager",
          task_order: 5,
          task_type: "action",
          required: true
        }
      ];

      // Create tasks using service role
      for (const task of defaultTasks) {
        await base44.asServiceRole.entities.OnboardingTask.create(task);
      }

      // Send welcome email series
      const welcomeEmail = `
Hi ${user.full_name},

Welcome to Apex Development Group! We're thrilled to have you as a client.

Your project is important to us, and we've prepared a step-by-step onboarding checklist to help you get started. You can access it anytime in your Client Portal.

Here's what you can expect:

1. Complete Your Profile - Help us understand your project needs
2. Review Your Project Timeline - See key milestones and dates
3. Upload Documents - Share any relevant files with our team
4. Set Communication Preferences - Choose how you want to stay updated
5. Schedule Your Consultation - Meet with your dedicated project manager

Our team will reach out within 24 hours to schedule your initial consultation.

In the meantime, if you have any questions, don't hesitate to reach out!

Best regards,
The Apex Development Group Team

Built on Trust. Rewarded by Results.
      `;

      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'Apex Development Group',
        to: user_email,
        subject: 'Welcome to Apex Development Group! 🏗️',
        body: welcomeEmail
      });

      // Schedule follow-up emails (Day 3 reminder)
      const day3Email = `
Hi ${user.full_name},

Just checking in to see how you're progressing with your onboarding checklist!

If you haven't had a chance to complete the setup steps, now's a great time. Your project manager is eager to get started and help you bring your project to life.

Quick reminders:
✓ Complete your profile
✓ Review your project timeline
✓ Schedule your initial consultation

Need help? Just reply to this email.

Best,
Apex Development Group Team
      `;

      // Note: In production, this would use a scheduled job
      // For now, this is a placeholder for follow-up logic
      
      return Response.json({
        success: true,
        message: 'Onboarding initiated successfully',
        tasks_created: defaultTasks.length
      });
    }

    if (action === 'send_progress_update') {
      // Get user's onboarding tasks
      const tasks = await base44.asServiceRole.entities.OnboardingTask.filter({
        user_email: user_email
      });

      const completedTasks = tasks.filter(t => t.completed).length;
      const totalTasks = tasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      if (progress === 100) {
        // Send completion email
        const completionEmail = `
Hi there,

Congratulations! You've completed all onboarding tasks! 🎉

Your project manager has been notified and will reach out to you within 24 hours to discuss next steps.

We're excited to start working on your project!

Thank you for choosing Apex Development Group.

Best regards,
Apex Team
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'Apex Development Group',
          to: user_email,
          subject: 'Onboarding Complete! 🎉',
          body: completionEmail
        });

        // Notify project manager
        if (user.role === 'client') {
          const managerEmail = `
New Client Onboarding Complete:

Client: ${user.full_name}
Email: ${user_email}
Progress: 100% complete

Action Required: Schedule initial project consultation within 24 hours.

View client details in the dashboard.
          `;

          await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'Apex System',
            to: 'managers@apexcg.com',
            subject: `[ACTION REQUIRED] Client Onboarding Complete - ${user.full_name}`,
            body: managerEmail
          });
        }
      }

      return Response.json({
        success: true,
        progress: progress,
        completed: completedTasks,
        total: totalTasks
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Onboarding error:', error);
    return Response.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
});