import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  className?: string;
  customText?: string;
}

export const MedicalWarningBanner: React.FC<Props> = ({ className = '', customText }) => {
  return (
    <div className={`p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-950 flex items-start space-x-3 shadow-sm ${className}`}>
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
      <div className="text-xs sm:text-sm">
        <p className="font-bold tracking-tight text-amber-900">
          MEDICAL SAFETY DISCLAIMER:
        </p>
        <p className="mt-0.5 leading-relaxed font-medium">
          {customText || "⚠ Snake identification is an estimate and may be incorrect. Do not delay medical treatment while waiting for identification. Immediate transport to an antivenom-equipped hospital is vital."}
        </p>
      </div>
    </div>
  );
};
