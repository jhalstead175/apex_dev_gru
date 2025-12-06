import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PenTool, Image as ImageIcon, Calendar, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PostComposer({ selectedDate, generatedIdeas }) {
  const [postContent, setPostContent] = useState('');
  const [platform, setPlatform] = useState('all');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [imageUrl, setImageUrl] = useState('');
  
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (postData) => base44.entities.SocialPost.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
      toast.success('Post scheduled successfully!');
      setPostContent('');
      setImageUrl('');
    },
  });

  const handleSchedulePost = () => {
    if (!postContent.trim()) {
      toast.error('Please enter post content');
      return;
    }

    const scheduledDateTime = new Date(selectedDate);
    const [hours, minutes] = scheduledTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    createPostMutation.mutate({
      post_content: postContent,
      platform,
      scheduled_date: scheduledDateTime.toISOString(),
      status: 'scheduled',
      image_url: imageUrl || undefined,
    });
  };

  const handleUseIdea = (idea) => {
    setPostContent(idea.content);
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <PenTool className="w-5 h-5 text-emerald-500" />
          Compose Post
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* AI Ideas Quick Use */}
        {generatedIdeas.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-900 mb-2">
              Quick Use AI Ideas:
            </p>
            <div className="flex flex-wrap gap-2">
              {generatedIdeas.map((idea, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => handleUseIdea(idea)}
                  className="text-xs"
                >
                  Use Idea {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Post Content */}
        <div>
          <Label htmlFor="content">Post Content</Label>
          <Textarea
            id="content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your social media post here..."
            className="mt-1 min-h-[150px]"
          />
          <p className="text-xs text-slate-500 mt-1">
            {postContent.length} characters
          </p>
        </div>

        {/* Platform Selection */}
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Image URL */}
        <div>
          <Label htmlFor="image" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image URL (optional)
          </Label>
          <Input
            id="image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>

        {/* Schedule Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input
              id="date"
              value={format(selectedDate, 'MMM d, yyyy')}
              disabled
              className="mt-1 bg-slate-50"
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleSchedulePost}
          disabled={createPostMutation.isPending}
          className="w-full bg-[#10b981] hover:bg-[#059669] h-12"
        >
          <Send className="w-4 h-4 mr-2" />
          Schedule Post
        </Button>
      </CardContent>
    </Card>
  );
}