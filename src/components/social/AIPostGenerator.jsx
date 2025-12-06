import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AIPostGenerator({ onIdeasGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState([]);

  const generateIdeas = async () => {
    setIsGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 engaging social media post ideas for a professional roofing contractor business (Aegis Spec Group) located in Pennsylvania. 
        
        Requirements:
        - Mix of content types: educational tips, seasonal advice, project showcases, client testimonials prompts, and industry expertise
        - Keep each post concise and engaging (100-150 characters ideal)
        - Include relevant hashtags
        - Make them suitable for Facebook, Instagram, and LinkedIn
        - Focus on summer/warm weather roofing season
        
        Return ONLY the post text, ready to copy and use.`,
        response_json_schema: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  category: { type: "string" }
                }
              }
            }
          }
        }
      });

      const generatedPosts = result.posts || [];
      setIdeas(generatedPosts);
      onIdeasGenerated(generatedPosts);
      toast.success('Generated 5 new post ideas!');
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error('Failed to generate post ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            AI Content Generator
          </CardTitle>
          <Button
            onClick={generateIdeas}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Post Ideas
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {ideas.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-3" />
            <p className="text-slate-600">
              Click "Generate Post Ideas" to get AI-powered content suggestions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-purple-100 hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded mb-2">
                      {idea.category}
                    </span>
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {idea.content}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(idea.content)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}