import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Share2 } from "lucide-react";

import ContentCalendar from "../components/social/ContentCalendar";
import PostComposer from "../components/social/PostComposer";
import AIPostGenerator from "../components/social/AIPostGenerator";

export default function Social() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [generatedIdeas, setGeneratedIdeas] = useState([]);

  const { data: posts = [] } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date'),
    initialData: [],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a85] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Social Media Manager
            </h1>
            <p className="text-emerald-300 text-lg">
              Create, schedule, and manage your social presence
            </p>
          </div>
        </div>
      </div>

      {/* AI Post Generator */}
      <AIPostGenerator onIdeasGenerated={setGeneratedIdeas} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ContentCalendar 
          posts={posts}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        <PostComposer 
          selectedDate={selectedDate}
          generatedIdeas={generatedIdeas}
        />
      </div>
    </div>
  );
}