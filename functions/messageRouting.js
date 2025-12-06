import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, data } = await req.json();

        // Analyze and route client messages
        if (action === 'route_message') {
            const { messageId, messageText, projectId } = data;

            // Use AI to categorize and determine routing
            const routingAnalysis = await base44.integrations.Core.InvokeLLM({
                prompt: `You are an intelligent message routing system for Apex Development Group, a roofing and building envelope company.

Analyze this client message and determine:
1. The category/topic of the message
2. The urgency level
3. Which team/agent should handle it
4. A brief summary for internal routing

Message: "${messageText}"

Categories:
- billing: Payment questions, invoices, pricing
- technical: Roofing specs, materials, construction questions
- scheduling: Timeline, dates, appointments
- issue: Problems, complaints, urgent repairs
- general: General inquiries, status updates

Teams:
- sales: For pre-project, quotes, new inquiries
- project_manager: For active project coordination, timeline
- billing: For payment and invoice questions
- technical: For construction/material questions
- support: For general support

Urgency:
- low: General questions, non-time-sensitive
- medium: Standard requests requiring response within 24hrs
- high: Issues requiring prompt attention
- urgent: Emergency repairs, critical problems`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        category: {
                            type: "string",
                            enum: ["billing", "technical", "scheduling", "issue", "general"]
                        },
                        urgency: {
                            type: "string",
                            enum: ["low", "medium", "high", "urgent"]
                        },
                        assigned_team: {
                            type: "string",
                            enum: ["sales", "project_manager", "billing", "technical", "support"]
                        },
                        summary: {
                            type: "string"
                        },
                        suggested_response: {
                            type: "string"
                        },
                        requires_escalation: {
                            type: "boolean"
                        }
                    }
                }
            });

            // Update message with routing info
            await base44.asServiceRole.entities.Message.update(messageId, {
                category: routingAnalysis.category,
                urgency: routingAnalysis.urgency,
                assigned_team: routingAnalysis.assigned_team,
                routing_summary: routingAnalysis.summary,
            });

            // Get project details for notification
            const projects = await base44.asServiceRole.entities.Project.list();
            const project = projects.find(p => p.id === projectId);

            // Send notification to appropriate team
            const teamEmails = {
                sales: 'sales@aegisspecgroup.com',
                project_manager: 'pm@aegisspecgroup.com',
                billing: 'billing@aegisspecgroup.com',
                technical: 'technical@aegisspecgroup.com',
                support: 'support@aegisspecgroup.com'
            };

            const urgencyEmojis = {
                low: '📝',
                medium: '⏰',
                high: '⚠️',
                urgent: '🚨'
            };

            await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: 'Apex Development Group Message Routing System',
                to: teamEmails[routingAnalysis.assigned_team],
                subject: `${urgencyEmojis[routingAnalysis.urgency]} New Client Message - ${routingAnalysis.category.toUpperCase()} [${routingAnalysis.urgency.toUpperCase()}]`,
                body: `New client message requires ${routingAnalysis.assigned_team} attention:

Project: ${project?.project_name || 'Unknown'}
Client: ${project?.client_name || 'Unknown'}

Category: ${routingAnalysis.category}
Urgency: ${routingAnalysis.urgency}
${routingAnalysis.requires_escalation ? '⚠️ REQUIRES ESCALATION\n' : ''}

Summary: ${routingAnalysis.summary}

Original Message:
"${messageText}"

---
Suggested Response:
${routingAnalysis.suggested_response}

---
View in portal: [Link to client message]
Respond via secure messaging system.`
            });

            return Response.json({
                success: true,
                routing: {
                    category: routingAnalysis.category,
                    urgency: routingAnalysis.urgency,
                    assigned_team: routingAnalysis.assigned_team,
                    summary: routingAnalysis.summary,
                    requires_escalation: routingAnalysis.requires_escalation
                }
            });
        }

        // Batch process unrouted messages
        if (action === 'process_unrouted_messages') {
            const messages = await base44.asServiceRole.entities.Message.list('-created_date');
            const unroutedMessages = messages.filter(m => 
                m.is_from_client && 
                !m.assigned_team &&
                new Date(m.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            );

            const routedResults = [];

            for (const message of unroutedMessages.slice(0, 10)) { // Process max 10 at once
                try {
                    const response = await base44.functions.invoke('messageRouting', {
                        action: 'route_message',
                        data: {
                            messageId: message.id,
                            messageText: message.message_text,
                            projectId: message.project_id
                        }
                    });

                    routedResults.push({
                        messageId: message.id,
                        status: 'routed',
                        routing: response.data.routing
                    });
                } catch (error) {
                    routedResults.push({
                        messageId: message.id,
                        status: 'failed',
                        error: error.message
                    });
                }
            }

            return Response.json({
                success: true,
                processedCount: routedResults.length,
                results: routedResults
            });
        }

        return Response.json({ 
            error: 'Invalid action. Use: route_message or process_unrouted_messages' 
        }, { status: 400 });

    } catch (error) {
        return Response.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
});