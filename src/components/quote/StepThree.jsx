import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Calendar, RefreshCw, AlertCircle, Clock, Lightbulb, FileText } from "lucide-react";

export default function StepThree({ quote, isCalculating, onScheduleInspection, onStartNew }) {
  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-16 h-16 text-[#10b981] animate-spin mb-4" />
        <p className="text-lg font-medium text-slate-700">
          AI is analyzing your project...
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Evaluating Pennsylvania market rates, material costs, and project complexity
        </p>
        <div className="mt-6 space-y-2 text-sm text-slate-600 text-center">
          <p className="animate-pulse">⚡ Analyzing roof specifications...</p>
          <p className="animate-pulse delay-100">📊 Calculating labor requirements...</p>
          <p className="animate-pulse delay-200">💰 Determining optimal pricing...</p>
        </div>
      </div>
    );
  }

  const urgencyColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    emergency: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          Your AI-Powered Estimate is Ready!
        </h3>
        <p className="text-slate-600">
          Intelligent analysis based on Pennsylvania market data
        </p>
      </div>

      {/* Urgency Badge */}
      {quote?.urgency && (
        <div className="flex justify-center">
          <Badge className={`${urgencyColors[quote.urgency]} px-4 py-2 text-sm font-medium`}>
            {quote.urgency === 'emergency' ? '🚨 ' : quote.urgency === 'high' ? '⚠️ ' : ''}
            {quote.urgency.toUpperCase()} PRIORITY
          </Badge>
        </div>
      )}

      {/* Main Quote Card */}
      <Card className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a85] text-white p-8 shadow-2xl">
        <div className="text-center">
          <p className="text-emerald-300 text-sm font-medium mb-2">
            Estimated Project Investment
          </p>
          <p className="text-5xl font-bold mb-2">
            ${quote?.low?.toLocaleString()} - ${quote?.high?.toLocaleString()}
          </p>
          <p className="text-sm text-slate-300">
            AI-analyzed estimate • Final price based on detailed inspection
          </p>
        </div>
      </Card>

      {/* Cost Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 bg-slate-50 border-2 border-slate-200">
          <p className="text-sm font-medium text-slate-600 mb-1">Material Costs</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">
            ${quote?.material_cost?.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">Premium quality materials</p>
        </Card>
        <Card className="p-6 bg-slate-50 border-2 border-slate-200">
          <p className="text-sm font-medium text-slate-600 mb-1">Labor Costs</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">
            ${quote?.labor_cost?.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">Certified professional crews</p>
        </Card>
      </div>

      {/* Timeline */}
      {quote?.timeline && (
        <Card className="p-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-bold text-blue-900">Estimated Timeline</p>
              <p className="text-blue-700">{quote.timeline} weeks from project start</p>
            </div>
          </div>
        </Card>
      )}

      {/* Project Scope */}
      {quote?.scope && (
        <Card className="p-6 bg-slate-50 border-2 border-slate-200">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Scope of Work</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{quote.scope}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Key Considerations */}
      {quote?.considerations && quote.considerations.length > 0 && (
        <Card className="p-6 bg-orange-50 border-2 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-orange-900 mb-3">Important Considerations</h4>
              <ul className="space-y-2">
                {quote.considerations.map((consideration, index) => (
                  <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {quote?.recommendations && quote.recommendations.length > 0 && (
        <Card className="p-6 bg-emerald-50 border-2 border-emerald-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-emerald-900 mb-3">Expert Recommendations</h4>
              <ul className="space-y-2">
                {quote.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* What's Included */}
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <h4 className="font-bold text-blue-900 mb-4">What's Included in Your Quote:</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Professional installation by certified, insured contractors</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Premium materials with manufacturer warranty</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Complete tear-off and proper disposal (if selected)</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Comprehensive project management and quality inspections</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>5-year workmanship warranty on labor</span>
          </li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onStartNew}
          variant="outline"
          className="flex-1 h-12 text-lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          New Quote
        </Button>
        <Button
          onClick={onScheduleInspection}
          className="flex-1 h-12 bg-[#10b981] hover:bg-[#059669] text-white font-medium text-lg shadow-lg"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Schedule Free Inspection
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        This is a preliminary estimate. A detailed on-site inspection is required for final pricing.
      </p>
    </div>
  );
}