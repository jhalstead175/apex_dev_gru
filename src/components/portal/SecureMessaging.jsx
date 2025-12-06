import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MessageSquare, Send, User, Shield, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function SecureMessaging({ project, user }) {
  const [messageText, setMessageText] = React.useState('');
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', project.id],
    queryFn: async () => {
      const allMessages = await base44.entities.Message.list('-created_date');
      return allMessages.filter(m => m.project_id === project.id);
    },
    initialData: [],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const message = await base44.entities.Message.create(messageData);
      
      // Route the message using AI
      await base44.functions.invoke('messageRouting', {
        action: 'route_message',
        data: {
          messageId: message.data.id,
          messageText: messageData.message_text,
          projectId: project.id
        }
      });
      
      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', project.id] });
      setMessageText('');
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    sendMessageMutation.mutate({
      project_id: project.id,
      sender_name: user.full_name,
      sender_email: user.email,
      message_text: messageText,
      is_from_client: true,
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      billing: 'bg-green-100 text-green-700',
      technical: 'bg-blue-100 text-blue-700',
      scheduling: 'bg-purple-100 text-purple-700',
      issue: 'bg-red-100 text-red-700',
      general: 'bg-slate-100 text-slate-700'
    };
    return colors[category] || colors.general;
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: 'bg-slate-100 text-slate-600',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[urgency] || colors.low;
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Secure Messaging
        </CardTitle>
        <p className="text-sm text-slate-600 mt-1">
          Messages are automatically routed to the appropriate team
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Messages List */}
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Start a conversation with our team
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.is_from_client ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.is_from_client ? 'bg-blue-100' : 'bg-emerald-100'
                  }`}
                >
                  {message.is_from_client ? (
                    <User className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Shield className="w-5 h-5 text-emerald-600" />
                  )}
                </div>

                <div className={`flex-1 ${message.is_from_client ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!message.is_from_client && (
                      <span className="font-medium text-sm text-slate-700">
                        {message.sender_name}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {format(new Date(message.created_date), 'MMM d, h:mm a')}
                    </span>
                    
                    {/* Routing badges for client messages */}
                    {message.is_from_client && message.assigned_team && (
                      <>
                        <Badge className={`text-xs ${getCategoryColor(message.category)}`}>
                          {message.category}
                        </Badge>
                        <Badge className={`text-xs ${getUrgencyColor(message.urgency)}`}>
                          {message.urgency}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <ArrowRight className="w-3 h-3" />
                          <span className="capitalize">{message.assigned_team?.replace('_', ' ')}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div
                    className={`inline-block p-4 rounded-2xl ${
                      message.is_from_client
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                  </div>
                  
                  {/* Routing summary for client */}
                  {message.is_from_client && message.routing_summary && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      Your message has been routed to our {message.assigned_team?.replace('_', ' ')} team
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-3">
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here... (Our AI will route it to the right team)"
            className="resize-none"
            rows={3}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="w-full bg-[#10b981] hover:bg-[#059669]"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendMessageMutation.isPending ? 'Sending & Routing...' : 'Send Message'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}