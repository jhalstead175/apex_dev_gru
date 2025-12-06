import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Facebook, Instagram, Linkedin } from "lucide-react";
import { format, isSameDay } from "date-fns";

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  all: CalendarIcon,
};

const platformColors = {
  facebook: 'bg-blue-100 text-blue-700',
  instagram: 'bg-pink-100 text-pink-700',
  linkedin: 'bg-blue-100 text-blue-800',
  all: 'bg-purple-100 text-purple-700',
};

export default function ContentCalendar({ posts, selectedDate, onDateSelect }) {
  const getPostsForDate = (date) => {
    return posts.filter(post => {
      if (!post.scheduled_date) return false;
      return isSameDay(new Date(post.scheduled_date), date);
    });
  };

  const scheduledPosts = getPostsForDate(selectedDate);

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          Content Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-lg border"
          modifiers={{
            hasPost: (date) => getPostsForDate(date).length > 0,
          }}
          modifiersStyles={{
            hasPost: {
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: 'bold',
            },
          }}
        />

        <div className="mt-6">
          <h3 className="font-bold text-slate-700 mb-3">
            Posts for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {scheduledPosts.length === 0 ? (
            <p className="text-slate-500 text-sm">No posts scheduled for this date</p>
          ) : (
            <div className="space-y-3">
              {scheduledPosts.map((post) => {
                const PlatformIcon = platformIcons[post.platform] || CalendarIcon;
                const platformColor = platformColors[post.platform] || platformColors.all;
                
                return (
                  <div
                    key={post.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <Badge className={`${platformColor} mb-2`}>
                      <PlatformIcon className="w-3 h-3 mr-1" />
                      {post.platform}
                    </Badge>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {post.post_content}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {format(new Date(post.scheduled_date), 'h:mm a')}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}