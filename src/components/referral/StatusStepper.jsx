import React from "react";
import { CheckCircle, Circle } from "lucide-react";

export default function StatusStepper({ status }) {
  const steps = [
    "Received",
    "Contacted",
    "In Progress",
    "Completed",
    "Paid"
  ];

  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index <= currentStepIndex
                  ? 'bg-[#c8a559] text-white shadow-lg'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {index < currentStepIndex ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" fill={index === currentStepIndex ? 'currentColor' : 'none'} />
              )}
            </div>
            <p
              className={`text-xs mt-2 font-medium ${
                index <= currentStepIndex ? 'text-[#0b1d3a]' : 'text-slate-400'
              }`}
            >
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 rounded transition-all ${
                index < currentStepIndex ? 'bg-[#c8a559]' : 'bg-slate-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}