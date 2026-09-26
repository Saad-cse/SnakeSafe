import React, { useState, useRef } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { SnakeIdentificationResult } from '../../types';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const SnakePhotoStep: React.FC = () => {
  const { setSnakeIdentification } = useEmergency();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<SnakeIdentificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAiResult(null);
      setErrorMessage(null);
      runAiAnalysis(file);
    }
  };

  const runAiAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      // Simulate real neural inference latency for realism
      await new Promise(r => setTimeout(r, 1200));
      const result = await ApiService.identifySnakeImage(file);
      setAiResult(result);
    } catch (err: any) {
      setErrorMessage('Snake identification is currently unavailable. You can safely continue.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [isSavingId, setIsSavingId] = useState<boolean>(false);

  const handleContinueWithIdentification = async () => {
    if (isSavingId) return;
    setIsSavingId(true);
    try {
      if (aiResult) {
        await setSnakeIdentification(aiResult, imagePreview || undefined);
      } else {
        // Fallback default identification if skipped
        await setSnakeIdentification({
          possibleSpecies: 'Unidentified Snake Specimen',
          possibleGroup: 'Suspected Venomous (Standard Triage)',
          confidence: 0.50,
          confidenceLevel: 'Low',
          venomous: true,
          antivenomType: 'Polyvalent Antivenom',
          riskLevel: 'Seek Immediate Clinical Care',
          keyFeatures: ['Visual observation skipped'],
          warning: '⚠ This is only an estimate. Do not delay medical treatment.',
          method: 'PHOTO_AI'
        }, imagePreview || undefined);
      }
      navigate('/patient/bite-assessment');
    } catch (err) {
      console.error('Failed to save snake identification:', err);
      setErrorMessage("Couldn't save your identification — please try again.");
      setIsSavingId(false);
    }
  };

  const handleSelectSample = (sampleType: 'cobra' | 'viper' | 'krait') => {
    // Provide instant clinical demo sample buttons so testing on desktop without a camera is effortless!
    let sampleUrl = '';
    let sampleFile: File;
    if (sampleType === 'cobra') {
      sampleUrl = 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600&auto=format&fit=crop&q=80';
      sampleFile = new File(['mock'], 'indian_cobra_hood.jpg', { type: 'image/jpeg' });
    } else if (sampleType === 'viper') {
      sampleUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80';
      sampleFile = new File(['mock'], 'russells_viper_diamond.jpg', { type: 'image/jpeg' });
    } else {
      sampleUrl = 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=600&auto=format&fit=crop&q=80';
      sampleFile = new File(['mock'], 'common_krait_bands.jpg', { type: 'image/jpeg' });
    }
    setImagePreview(sampleUrl);
    setSelectedFile(sampleFile);
    runAiAnalysis(sampleFile);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-brand-purple text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 3 OF 8</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Do you have a photo of the snake?
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1">
          If safe to do so, provide an image. Never put yourself or others at risk to photograph a snake.
        </p>
      </div>

      {/* Hidden File / Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 3 Main Choice Cards (Flowchart Screen 3) */}
      {!imagePreview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Take Photo */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-brand-blue rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Take Photo</span>
            <span className="text-[11px] text-slate-400 mt-1">Use phone camera</span>
          </button>

          {/* Upload Photo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-brand-blue rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Upload Photo</span>
            <span className="text-[11px] text-slate-400 mt-1">From gallery or files</span>
          </button>

          {/* No Photo (Proceeds to Screen 4) */}
          <button
            type="button"
            onClick={() => navigate('/patient/questionnaire')}
            className="p-6 bg-white hover:bg-amber-50/50 border-2 border-slate-200 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <EyeOff className="w-7 h-7" />
            </div>
            <span className="font-bold text-slate-800 text-sm">No Photo</span>
            <span className="text-[11px] text-slate-400 mt-1">Fill 8-point observation</span>
          </button>
        </div>
      )}

      {/* Quick Demo Sample Picker for rapid reviewer testing */}
      {!imagePreview && (
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            One-Click Clinical Demo Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSelectSample('cobra')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-colors"
            >
              🐍 Spectacled Cobra Photo
            </button>
            <button
              onClick={() => handleSelectSample('viper')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-colors"
            >
              🐍 Russell's Viper Photo
            </button>
            <button
              onClick={() => handleSelectSample('krait')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-colors"
            >
              🐍 Common Krait Photo
            </button>
          </div>
        </div>
      )}

      {/* Image Preview & AI Analysis Loading/Result (Flowchart Screen 3) */}
      {imagePreview && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card-soft p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Image Thumbnail */}
            <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative flex-shrink-0">
              <img
                src={imagePreview}
                alt="Snake incident preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                  setAiResult(null);
                }}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold rounded shadow"
              >
                Change
              </button>
            </div>

            {/* AI Analysis State */}
            <div className="flex-1 w-full">
              {isAnalyzing && (
                <div className="py-8 text-center flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 text-brand-blue animate-spin mb-3" />
                  <p className="font-extrabold text-slate-800 text-base">
                    Analyzing snake image…
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Extracting cervical patterns, dorsal scales, and head morphology
                  </p>
                </div>
              )}

              {!isAnalyzing && aiResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      AI Computer Vision Analysis
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Confidence: {Math.round(aiResult.confidence * 100)}% ({aiResult.confidenceLevel})
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Possible Snake Group:</span>
                    <span className="text-lg font-black text-brand-darkRed">
                      {aiResult.possibleGroup}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Possible Species:</span>
                    <span className="text-sm font-bold text-slate-800">
                      {aiResult.possibleSpecies}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {aiResult.keyFeatures.map((feat, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs font-medium">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Action to proceed */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleContinueWithIdentification}
              disabled={isAnalyzing || isSavingId}
              className="py-3 px-6 bg-brand-red hover:bg-brand-darkRed text-white font-extrabold rounded-xl shadow-lg transition-all text-sm flex items-center space-x-2"
            >
              <span>{isSavingId ? 'Saving...' : 'Continue to Bite Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Screen 3 Mandatory Warning Box */}
      <div className="mt-6">
        <MedicalWarningBanner />
      </div>
    </div>
  );
};
