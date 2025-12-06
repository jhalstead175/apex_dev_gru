import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Lightbulb, X, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function AIInsightsPanel({ insights, onClose }) {
  const healthColors = {
    excellent: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    good: 'bg-blue-100 text-blue-700 border-blue-300',
    fair: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    needs_attention: 'bg-red-100 text-red-700 border-red-300'
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-blue-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-2xl">
        <CardHeader className="border-b border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-purple-900">
                  AI Business Insights
                </CardTitle>
                <p className="text-sm text-purple-600 mt-1">
                  Powered by advanced business intelligence analysis
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-purple-700 hover:bg-purple-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Health Score */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-900">Overall Business Health</h3>
              <Badge className={`${healthColors[insights.overall_health]} border text-lg px-4 py-2`}>
                {insights.overall_health.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-purple-700 mb-2">
                <span>Health Score</span>
                <span className="font-bold">{insights.health_score}/100</span>
              </div>
              <div className="h-4 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                  style={{ width: `${insights.health_score}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-800 leading-relaxed">
                {insights.executive_summary}
              </p>
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-emerald-100">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-emerald-900">Top Strengths</h3>
              </div>
              <div className="space-y-3">
                {insights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 bg-emerald-50 rounded-lg p-3">
                    <div className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-emerald-800">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-100">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-orange-900">Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                {insights.areas_for_improvement.map((area, index) => (
                  <div key={index} className="flex items-start gap-3 bg-orange-50 rounded-lg p-3">
                    <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-orange-800">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Actionable Recommendations</h3>
            </div>
            <div className="space-y-4">
              {insights.actionable_recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-blue-900">{rec.category}</h4>
                    <Badge className={`${priorityColors[rec.priority]} text-white text-xs`}>
                      {rec.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">{rec.recommendation}</p>
                  <div className="bg-white rounded p-2 border border-blue-100">
                    <p className="text-xs text-blue-700">
                      <strong>Expected Impact:</strong> {rec.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Opportunities */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-purple-900">Revenue Growth Opportunities</h3>
            </div>
            <div className="space-y-2">
              {insights.revenue_opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-3 bg-purple-50 rounded-lg p-3">
                  <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                    💰
                  </div>
                  <p className="text-sm text-purple-800">{opportunity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Suggestions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-bold text-indigo-900">Operational Efficiency</h3>
            </div>
            <div className="space-y-2">
              {insights.efficiency_suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 bg-indigo-50 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-indigo-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              AI Forecast & Goals
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-xs text-purple-100 mb-1">Projected Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  ${insights.key_metrics_forecast.projected_monthly_revenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-xs text-purple-100 mb-1">Projected Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {insights.key_metrics_forecast.projected_conversion_rate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-xs text-purple-100 mb-1">Recommended Goals</p>
                <p className="text-sm font-medium">
                  {insights.key_metrics_forecast.recommended_sales_goals}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}