import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, data } = await req.json();

        // Handle milestone completion notification
        if (action === 'milestone_completed') {
            const { milestoneId, projectId } = data;

            // Get milestone and project details
            const milestones = await base44.entities.Milestone.list();
            const milestone = milestones.find(m => m.id === milestoneId);
            
            const projects = await base44.entities.Project.list();
            const project = projects.find(p => p.id === projectId);

            if (!milestone || !project) {
                return Response.json({ error: 'Milestone or Project not found' }, { status: 404 });
            }

            // Get client email from project creator
            const clientEmail = project.created_by;

            // Create message in system
            await base44.entities.Message.create({
                project_id: projectId,
                sender_name: 'Apex Development Group',
                sender_email: 'notifications@aegisspecgroup.com',
                message_text: `Great news! We've completed the "${milestone.milestone_name}" milestone for your project. ${milestone.notes || 'Our team will proceed with the next phase shortly.'}`,
                is_from_client: false,
            });

            // Send email notification
            await base44.integrations.Core.SendEmail({
                from_name: 'Apex Development Group',
                to: clientEmail,
                subject: `✅ Milestone Completed: ${milestone.milestone_name}`,
                body: `Dear ${project.client_name},

We're pleased to inform you that we've successfully completed the "${milestone.milestone_name}" milestone for your project at ${project.address}.

Project Progress: ${project.progress_percentage}%

${milestone.notes ? `Details: ${milestone.notes}` : ''}

What's Next:
Our team will now proceed with the next phase of your project. You can view the complete timeline and all project details in your secure client portal.

If you have any questions, please don't hesitate to reach out through the portal messaging system or reply to this email.

Best regards,
Apex Development Group Team

---
View your project portal: [Client Portal Link]`
            });

            return Response.json({ 
                success: true, 
                message: 'Milestone completion notification sent',
                milestone: milestone.milestone_name 
            });
        }

        // Handle project health status change notification
        if (action === 'project_health_change') {
            const { projectId, previousStatus, newStatus, reason } = data;

            // Get project details
            const projects = await base44.entities.Project.list();
            const project = projects.find(p => p.id === projectId);

            if (!project) {
                return Response.json({ error: 'Project not found' }, { status: 404 });
            }

            // Only send notifications for at-risk or delayed statuses
            if (newStatus !== 'at_risk' && newStatus !== 'delayed') {
                return Response.json({ 
                    success: true, 
                    message: 'No notification needed for this status' 
                });
            }

            const clientEmail = project.created_by;

            const statusLabels = {
                at_risk: 'At Risk',
                delayed: 'Delayed'
            };

            const statusEmojis = {
                at_risk: '⚠️',
                delayed: '🔔'
            };

            // Create message in system
            await base44.entities.Message.create({
                project_id: projectId,
                sender_name: 'Apex Development Group',
                sender_email: 'notifications@aegisspecgroup.com',
                message_text: `${statusEmojis[newStatus]} Project Status Update: Your project has been flagged as "${statusLabels[newStatus]}". ${reason || 'Our team is working to address this and will keep you informed of progress.'}`,
                is_from_client: false,
            });

            // Generate revised timeline suggestion
            const milestones = await base44.entities.Milestone.list();
            const projectMilestones = milestones
                .filter(m => m.project_id === projectId && m.status !== 'completed')
                .sort((a, b) => a.milestone_order - b.milestone_order);

            let timelineInfo = '';
            if (projectMilestones.length > 0) {
                timelineInfo = '\n\nUpcoming Milestones:\n';
                projectMilestones.slice(0, 3).forEach(m => {
                    timelineInfo += `- ${m.milestone_name}${m.due_date ? ` (Expected: ${new Date(m.due_date).toLocaleDateString()})` : ''}\n`;
                });
            }

            // Send email notification
            await base44.integrations.Core.SendEmail({
                from_name: 'Apex Development Group',
                to: clientEmail,
                subject: `${statusEmojis[newStatus]} Project Status Update: ${project.project_name}`,
                body: `Dear ${project.client_name},

We want to keep you informed about your project at ${project.address}.

Status Update: ${statusLabels[newStatus]}

${reason || 'We have identified some factors that may impact the project timeline.'}

Current Project Status:
- Progress: ${project.progress_percentage}%
- Contract Value: $${project.contract_value?.toLocaleString()}
- Original Completion: ${project.estimated_completion ? new Date(project.estimated_completion).toLocaleDateString() : 'TBD'}
${timelineInfo}

What We're Doing:
Our project management team is actively working to address this situation. We are committed to transparency and will keep you updated on all developments. 

Your Next Steps:
1. Log into your client portal for real-time updates
2. Review the detailed project timeline
3. Reach out via portal messaging with any questions or concerns

We appreciate your patience and understanding as we work to deliver the quality you expect from Apex Development Group.

Best regards,
Apex Development Group Project Management Team

---
Need to discuss? Reply to this email or message us through your secure portal.`
            });

            return Response.json({ 
                success: true, 
                message: 'Project health change notification sent',
                status: newStatus 
            });
        }

        // Handle batch notification check (can be called on schedule)
        if (action === 'check_notifications') {
            const notifications = [];

            // Check for recently completed milestones (last 24 hours)
            const milestones = await base44.asServiceRole.entities.Milestone.list();
            const recentlyCompleted = milestones.filter(m => {
                if (m.status !== 'completed' || !m.completion_date) return false;
                const completionDate = new Date(m.completion_date);
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return completionDate > yesterday;
            });

            for (const milestone of recentlyCompleted) {
                // Check if notification was already sent by looking for recent messages
                const messages = await base44.asServiceRole.entities.Message.list();
                const alreadyNotified = messages.some(msg => 
                    msg.project_id === milestone.project_id &&
                    msg.message_text.includes(milestone.milestone_name) &&
                    !msg.is_from_client &&
                    new Date(msg.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                );

                if (!alreadyNotified) {
                    notifications.push({
                        type: 'milestone_completed',
                        milestoneId: milestone.id,
                        projectId: milestone.project_id
                    });
                }
            }

            return Response.json({ 
                success: true, 
                pendingNotifications: notifications.length,
                notifications 
            });
        }

        return Response.json({ 
            error: 'Invalid action. Use: milestone_completed, project_health_change, or check_notifications' 
        }, { status: 400 });

    } catch (error) {
        return Response.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
});