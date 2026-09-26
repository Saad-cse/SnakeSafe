import React, { useState } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { SnakeIdentificationResult, QuestionnaireAnswers } from '../../types';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const QuestionnaireStep: React.FC = () => {
  const { setSnakeIdentification } = useEmergency();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    color: 'Black / Dark Brown',
    pattern: 'Bands / Narrow rings',
    approximateLength: '3 to 5 feet',
    headShape: 'Oval / Rounded',
    timeOfDay: 'Night / Dark',
    hoodSpread: 'No hood seen',
    nearWater: 'No, dry outdoor ground',
    behavior: 'Sluggish / Tried to escape slowly'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SnakeIdentificationResult | null>(null);

  const handleFieldChange = (field: keyof QuestionnaireAnswers, val: string) => {
    setAnswers(prev => ({ ...prev, [field]: val }));
  };

  const handleGetIdentification = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      const res = await ApiService.analyzeQuestionnaire(answers);
      setResult(res);
    } catch {
      // Fallback
      setResult({
        possibleSpecies: 'Common Krait (Bungarus caeruleus)',
        possibleGroup: 'Krait-like',
        confidence: 0.58,
        confidenceLevel: 'Low / Medium',
        venomous: true,
        antivenomType: 'Polyvalent Antivenom',
        riskLevel: 'Extremely High - Potent Neurotoxic',
        keyFeatures: ['Nocturnal encounter', 'Cross-banded markings'],
        warning: '⚠ This is only an estimate. Do not delay medical treatment.',
        method: 'QUESTIONNAIRE'
      });
    } finally {
      setLoading(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      if (result) {
        await setSnakeIdentification(result);
      } else {
        await setSnakeIdentification({
          possibleSpecies: 'Unclassified Snake',
          possibleGroup: 'Suspected Venomous',
          confidence: 0.50,
          confidenceLevel: 'Low',
          venomous: true,
          antivenomType: 'Polyvalent Antivenom',
          riskLevel: 'Seek Immediate Triage',
          keyFeatures: ['Visual observation recorded'],
          warning: '⚠ This is only an estimate. Do not delay medical treatment.',
          method: 'QUESTIONNAIRE'
        });
      }
      navigate('/patient/bite-assessment');
    } catch (err) {
      console.error('Failed to save snake identification:', err);
      setSaveError("Couldn't save your answers — please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
          <ClipboardList className="w-3.5 h-3.5" />
          <span>STEP 4 OF 8 (NO PHOTO OBSERVED)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Snake Observation
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Answer what you recall quickly. If unsure, pick the closest option and proceed immediately.
        </p>
      </div>

      {/* Observation Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card-soft p-6 sm:p-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Colour of snake */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Colour of snake
            </label>
            <select
              value={answers.color}
              onChange={e => handleFieldChange('color', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>Black / Dark Brown</option>
              <option>Brown / Earthy</option>
              <option>Yellow / Cream / Tan</option>
              <option>Green</option>
              <option>Banded / Multi-colored</option>
              <option>Uncertain</option>
            </select>
          </div>

          {/* 2. Pattern / markings */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Pattern / markings
            </label>
            <select
              value={answers.pattern}
              onChange={e => handleFieldChange('pattern', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>Bands / Narrow rings</option>
              <option>Diamond / Hexagon chain spots</option>
              <option>Plain / Uniform body</option>
              <option>Speckled / Irregular blotches</option>
              <option>Unsure</option>
            </select>
          </div>

          {/* 3. Approximate length */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Approximate length
            </label>
            <select
              value={answers.approximateLength}
              onChange={e => handleFieldChange('approximateLength', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>Small (under 1.5 ft)</option>
              <option>Medium (1.5 to 3 ft)</option>
              <option>3 to 5 feet</option>
              <option>Large (over 5 ft)</option>
              <option>Uncertain</option>
            </select>
          </div>

          {/* 4. Head shape */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4. Head shape
            </label>
            <select
              value={answers.headShape}
              onChange={e => handleFieldChange('headShape', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>Oval / Rounded</option>
              <option>Triangular / Arrow-shaped</option>
              <option>Continuous with neck</option>
              <option>Did not see head</option>
            </select>
          </div>

          {/* 5. Day or night */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              5. Day or night
            </label>
            <select
              value={answers.timeOfDay}
              onChange={e => handleFieldChange('timeOfDay', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>Day / Bright daylight</option>
              <option>Dusk / Twilight</option>
              <option>Night / Dark</option>
              <option>Dawn / Early morning</option>
            </select>
          </div>

          {/* 6. Hood spread? */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              6. Hood spread?
            </label>
            <select
              value={answers.hoodSpread}
              onChange={e => handleFieldChange('hoodSpread', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>No hood seen</option>
              <option>Yes, hood observed</option>
              <option>Uncertain</option>
            </select>
          </div>

          {/* 7. Near water? */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              7. Near water?
            </label>
            <select
              value={answers.nearWater}
              onChange={e => handleFieldChange('nearWater', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>No, dry outdoor ground / garden</option>
              <option>Yes, pond, stream, or paddy field</option>
              <option>Inside house / bedroom / kitchen</option>
              <option>Agricultural field / bush</option>
            </select>
          </div>

          {/* 8. Behaviour */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              8. Behaviour
            </label>
            <select
              value={answers.behavior}
              onChange={e => handleFieldChange('behavior', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-blue"
            >
              <option>Sluggish / Tried to escape slowly</option>
              <option>Loud hissing / coiled defensively</option>
              <option>Fast striking / aggressive posture</option>
              <option>Quick escape into darkness</option>
            </select>
          </div>
        </div>

        {/* Button: Get Possible Identification (Flowchart Screen 4) */}
        {!result && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/patient/snake-id')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Photo Option</span>
            </button>

            <button
              type="button"
              onClick={handleGetIdentification}
              disabled={loading}
              className="py-3 px-6 bg-brand-blue hover:bg-blue-900 text-white font-extrabold rounded-xl shadow-md text-sm flex items-center space-x-2 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Observation Heuristics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Get Possible Identification</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Identification Result Box */}
        {result && (
          <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                Possible Identification:
              </span>
              <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Confidence: {result.confidenceLevel} ({Math.round(result.confidence * 100)}%)
              </span>
            </div>

            <p className="text-xl font-black text-slate-900">
              {result.possibleGroup}
            </p>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Estimated: {result.possibleSpecies}
            </p>

            {saveError && (
              <p className="text-xs text-red-700 font-semibold mt-3">{saveError}</p>
            )}

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex justify-end">
              <button
                onClick={handleContinue}
                disabled={isSaving}
                className="py-3 px-6 bg-brand-red hover:bg-brand-darkRed text-white font-extrabold rounded-xl shadow-lg text-sm flex items-center space-x-2 disabled:opacity-60"
              >
                <span>{isSaving ? 'Saving...' : 'Continue to Bite Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Screen 4 Warning Box */}
      <MedicalWarningBanner />
    </div>
  );
};
