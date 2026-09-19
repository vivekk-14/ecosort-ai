import React, { useState } from 'react';
import Header from './components/Header';
import WasteInput from './components/WasteInput';
import ResultCard from './components/ResultCard';
import Disclaimer from './components/Disclaimer';
import { AlertCircle, X, Sparkles, RefreshCcw } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textQuery, setTextQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('file', selectedImage);
      }
      if (textQuery.trim()) {
        formData.append('text_prompt', textQuery.trim());
      }

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errDetail = 'Failed to analyze waste.';
        try {
          const errJson = await response.json();
          errDetail = errJson.detail || errJson.message || errDetail;
        } catch {
          errDetail = `Server returned HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errDetail);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      // Helpful error message for beginner developers if backend is not started yet
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError(
          'Could not connect to the EcoSort AI Backend server at http://127.0.0.1:8000. Please ensure the FastAPI backend is running (Phase 3).'
        );
      } else {
        setError(err.message || 'An unexpected error occurred while analyzing the item.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setTextQuery('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navigation & Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Intro Hero */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>AI for Circular Economy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Sort Smart, Recycle Right with{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EcoSort AI
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Upload an image or describe your waste. Our multimodal AI identifies the material, assigns the right waste bin stream, and gives responsible disposal steps.
          </p>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-xs animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold">Analysis Warning</p>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-700 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Dynamic Display: Input Form vs Result Dashboard */}
        {!result ? (
          <WasteInput
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            textQuery={textQuery}
            setTextQuery={setTextQuery}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            onReset={handleReset}
          />
        ) : (
          <ResultCard result={result} onReset={handleReset} />
        )}

        {/* Responsible AI Notice Section */}
        <Disclaimer />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 EcoSort AI • Developed for 1M1B AI for Sustainability Virtual Internship.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>SDG 12 & SDG 11 Aligned</span>
            <span>•</span>
            <span>Zero-Storage Privacy Guaranteed</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
