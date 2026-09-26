import React from 'react';
import { Check, AlertCircle, MapPin, Building2, Ambulance } from 'lucide-react';

interface Props {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ProgressStepper: React.FC<Props> = ({ currentStep, onStepClick }) => {
  // Redesigned to match the new 2-tap-to-help flow: Emergency -> Location ->
  // Get Help (dispatch) -> Tracking. Snake ID / Questionnaire / Bite
  // Assessment are optional now and live inside the Tracking phase, so they
  // no longer get their own steps here.
  const steps = [
    { num: 1, label: 'Emergency', icon: AlertCircle },
    { num: 2, label: 'Location', icon: MapPin },
    { num: 3, label: 'Get Help', icon: Building2 },
    { num: 4, label: 'Tracking', icon: Ambulance },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 shadow-sm overflow-x-auto">
      <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[400px]">
        {steps.map((s, idx) => {
          const isCompleted = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          const Icon = s.icon;

          return (
            <React.Fragment key={s.num}>
              {/* Step item */}
              <div
                onClick={() => isCompleted && onStepClick && onStepClick(s.num)}
                className={`flex flex-col items-center group ${
                  isCompleted ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                    isCurrent
                      ? 'bg-brand-red text-white ring-4 ring-red-100 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-[11px] mt-1 font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-brand-red font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded transition-colors duration-200 ${
                    currentStep > steps[idx + 1].num - 1 && currentStep > s.num
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
