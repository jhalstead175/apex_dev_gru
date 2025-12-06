import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  TrendingUp, 
  FileText, 
  Target,
  Sparkles,
  Loader2,
  Copy,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function SEO() {
  const [analysisType, setAnalysisType] = useState('keywords');
  const [contentInput, setContentInput] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [location, setLocation] = useState('Pennsylvania');
  const [results, setResults] = useState(null);

  const analyzeSEOMutation = useMutation({
    mutationFn: async ({ type, content, keyword, location }) => {
      let prompt = '';
      let schema = {};

      if (type === 'keywords') {
        prompt = `You are an SEO expert for Aegis Spec Group, a roofing and building envelope company in ${location}.

Generate a comprehensive keyword strategy including:
1. Primary keywords (high volume, high intent)
2. Secondary keywords (supporting terms)
3. Long-tail keywords (specific, lower competition)
4. Local keywords (location-based)
5. Question-based keywords (for featured snippets)

Focus on roofing, building envelope, commercial and residential services.
Consider search intent: informational, transactional, and local.`;
        
        schema = {
          type: "object",
          properties: {
            primary_keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  search_volume: { type: "string" },
                  difficulty: { type: "string", enum: ["low", "medium", "high"] },
                  intent: { type: "string" }
                }
              }
            },
            secondary_keywords: {
              type: "array",
              items: { type: "string" }
            },
            long_tail_keywords: {
              type: "array",
              items: { type: "string" }
            },
            local_keywords: {
              type: "array",
              items: { type: "string" }
            },
            question_keywords: {
              type: "array",
              items: { type: "string" }
            }
          }
        };
      } else if (type === 'content_analysis') {
        prompt = `Analyze this content for SEO optimization:

Content: "${content}"
Target Keyword: "${keyword}"
Location: ${location}

Provide:
1. SEO score (0-100)
2. Keyword optimization analysis
3. Readability score
4. Specific improvement recommendations
5. Meta title suggestions (50-60 chars)
6. Meta description suggestions (150-160 chars)
7. Header structure recommendations
8. Internal linking opportunities`;

        schema = {
          type: "object",
          properties: {
            seo_score: { type: "number" },
            keyword_density: { type: "string" },
            readability_score: { type: "string" },
            improvements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  issue: { type: "string" },
                  recommendation: { type: "string" }
                }
              }
            },
            meta_title_suggestions: {
              type: "array",
              items: { type: "string" }
            },
            meta_description_suggestions: {
              type: "array",
              items: { type: "string" }
            },
            header_recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        };
      } else if (type === 'local_seo') {
        prompt = `Generate a local SEO strategy for Aegis Spec Group, a roofing contractor in ${location}.

Provide:
1. Google Business Profile optimization tips
2. Local citation opportunities
3. Review generation strategies
4. Local content ideas
5. Location page recommendations
6. Local link building opportunities
7. NAP consistency checklist`;

        schema = {
          type: "object",
          properties: {
            gbp_optimization: {
              type: "array",
              items: { type: "string" }
            },
            citation_opportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  platform: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            review_strategies: {
              type: "array",
              items: { type: "string" }
            },
            local_content_ideas: {
              type: "array",
              items: { type: "string" }
            },
            location_pages: {
              type: "array",
              items: { type: "string" }
            }
          }
        };
      } else if (type === 'blog_topics') {
        prompt = `Generate SEO-optimized blog post topics for Aegis Spec Group, a roofing company in ${location}.

Focus on:
- Educational content (how-to, guides)
- Seasonal topics (winter prep, spring maintenance)
- Common problems and solutions
- Industry trends
- Local relevance

Provide 10 blog topics with:
- Engaging title
- Target keyword
- Search intent
- Estimated difficulty
- Why it's valuable`;

        schema = {
          type: "object",
          properties: {
            blog_topics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  target_keyword: { type: "string" },
                  intent: { type: "string" },
                  difficulty: { type: "string" },
                  value_proposition: { type: "string" }
                }
              }
            }
          }
        };
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: schema
      });

      return response;
    },
    onSuccess: (data) => {
      setResults(data);
      toast.success('SEO analysis complete!');
    },
    onError: () => {
      toast.error('Failed to analyze. Please try again.');
    }
  });

  const handleAnalyze = () => {
    if (analysisType === 'content_analysis' && !contentInput.trim()) {
      toast.error('Please enter content to analyze');
      return;
    }

    analyzeSEOMutation.mutate({
      type: analysisType,
      content: contentInput,
      keyword: targetKeyword,
      location
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a85] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#10b981] to-[#059669] p-3 rounded-xl shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              SEO Strategy Center
            </h1>
            <p className="text-emerald-300 text-lg">
              AI-powered SEO insights and optimization
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#1e3a5f]">
            SEO Analysis Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keywords">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Keyword Research
                    </div>
                  </SelectItem>
                  <SelectItem value="content_analysis">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Content Analysis
                    </div>
                  </SelectItem>
                  <SelectItem value="local_seo">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Local SEO Strategy
                    </div>
                  </SelectItem>
                  <SelectItem value="blog_topics">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Blog Topic Ideas
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location Focus</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Pennsylvania"
                className="mt-1"
              />
            </div>

            {analysisType === 'content_analysis' && (
              <div>
                <Label>Target Keyword</Label>
                <Input
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="roofing contractor PA"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {analysisType === 'content_analysis' && (
            <div>
              <Label>Content to Analyze</Label>
              <Textarea
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                placeholder="Paste your content here for SEO analysis..."
                className="mt-1 min-h-[200px]"
              />
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={analyzeSEOMutation.isPending}
            className="w-full bg-[#10b981] hover:bg-[#059669] h-12"
          >
            {analyzeSEOMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Run SEO Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#1e3a5f]">
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Keywords Results */}
            {analysisType === 'keywords' && results.primary_keywords && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-emerald-600 mb-3">Primary Keywords</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {results.primary_keywords.map((kw, idx) => (
                      <div key={idx} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-emerald-900">{kw.keyword}</h4>
                          <Badge className={`${
                            kw.difficulty === 'low' ? 'bg-green-500' :
                            kw.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                          } text-white text-xs`}>
                            {kw.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-emerald-700">Volume: {kw.search_volume}</p>
                        <p className="text-sm text-emerald-700">Intent: {kw.intent}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-blue-600 mb-3">Long-Tail Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.long_tail_keywords?.map((kw, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-700 border border-blue-200">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-purple-600 mb-3">Local Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.local_keywords?.map((kw, idx) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-700 border border-purple-200">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-orange-600 mb-3">Question Keywords (Featured Snippets)</h3>
                  <div className="space-y-2">
                    {results.question_keywords?.map((kw, idx) => (
                      <div key={idx} className="bg-orange-50 rounded p-3 border border-orange-200 flex items-center justify-between">
                        <span className="text-sm text-orange-900">{kw}</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(kw)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content Analysis Results */}
            {analysisType === 'content_analysis' && results.seo_score !== undefined && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">SEO Score</h3>
                  <p className="text-5xl font-bold">{results.seo_score}/100</p>
                  <p className="text-emerald-100 mt-2">Keyword Density: {results.keyword_density}</p>
                  <p className="text-emerald-100">Readability: {results.readability_score}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-red-600 mb-3">Improvements Needed</h3>
                  <div className="space-y-3">
                    {results.improvements?.map((imp, idx) => (
                      <div key={idx} className={`rounded-lg p-4 border-2 ${
                        imp.priority === 'high' ? 'bg-red-50 border-red-200' :
                        imp.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            imp.priority === 'high' ? 'text-red-600' :
                            imp.priority === 'medium' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${
                                imp.priority === 'high' ? 'bg-red-500' :
                                imp.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              } text-white text-xs`}>
                                {imp.priority.toUpperCase()}
                              </Badge>
                              <span className="font-bold text-sm">{imp.issue}</span>
                            </div>
                            <p className="text-sm text-slate-700">{imp.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-emerald-600 mb-3">Meta Title Suggestions</h3>
                  <div className="space-y-2">
                    {results.meta_title_suggestions?.map((title, idx) => (
                      <div key={idx} className="bg-emerald-50 rounded p-3 border border-emerald-200 flex items-center justify-between">
                        <span className="text-sm text-emerald-900">{title}</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(title)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-blue-600 mb-3">Meta Description Suggestions</h3>
                  <div className="space-y-2">
                    {results.meta_description_suggestions?.map((desc, idx) => (
                      <div key={idx} className="bg-blue-50 rounded p-3 border border-blue-200 flex items-start justify-between gap-3">
                        <span className="text-sm text-blue-900">{desc}</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(desc)} className="flex-shrink-0">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Local SEO Results */}
            {analysisType === 'local_seo' && results.gbp_optimization && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-emerald-600 mb-3">Google Business Profile Optimization</h3>
                  <div className="space-y-2">
                    {results.gbp_optimization.map((tip, idx) => (
                      <div key={idx} className="bg-emerald-50 rounded p-3 border border-emerald-200 flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-emerald-900">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-blue-600 mb-3">Local Citation Opportunities</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {results.citation_opportunities?.map((cit, idx) => (
                      <div key={idx} className="bg-blue-50 rounded p-3 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900">{cit.platform}</span>
                          <Badge className={`${
                            cit.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
                          } text-white text-xs`}>
                            {cit.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-purple-600 mb-3">Local Content Ideas</h3>
                  <div className="space-y-2">
                    {results.local_content_ideas?.map((idea, idx) => (
                      <div key={idx} className="bg-purple-50 rounded p-3 border border-purple-200">
                        <span className="text-sm text-purple-900">{idea}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Blog Topics Results */}
            {analysisType === 'blog_topics' && results.blog_topics && (
              <div className="space-y-3">
                {results.blog_topics.map((topic, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-slate-900 text-lg">{topic.title}</h4>
                      <Badge className={`${
                        topic.difficulty === 'low' ? 'bg-green-500' :
                        topic.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-emerald-600 mb-2">
                      <strong>Target Keyword:</strong> {topic.target_keyword}
                    </p>
                    <p className="text-sm text-slate-600 mb-2">{topic.value_proposition}</p>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      {topic.intent}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}