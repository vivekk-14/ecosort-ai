import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, Trash2, Sparkles, Loader2, ArrowRight } from 'lucide-react';

const QUICK_EXAMPLES = [
  "Empty plastic water bottle",
  "Fresh banana peel",
  "Old smartphone with a cracked screen",
  "Lithium-ion AA battery",
  "Greasy pizza box with food residue",
  "Clear glass olive oil bottle",
];

export default function WasteInput({
  selectedImage,
  setSelectedImage,
  imagePreview,
  setImagePreview,
  textQuery,
  setTextQuery,
  onAnalyze,
  isLoading,
  onReset
}) {
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'text'
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const canAnalyze = (selectedImage || textQuery.trim().length > 0) && !isLoading;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 transition-all">
      {/* Tab Switcher */}
      <div className="flex bg-slate-100/90 p-1.5 rounded-2xl mb-6 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'image'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Option 1: Upload Image</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'text'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Option 2: Describe Waste</span>
        </button>
      </div>

      {/* Tab 1: Image Upload */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          {!imagePreview ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                  : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                Drop your waste image here or <span className="text-emerald-600 underline">browse</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                Supports JPG, PNG, WebP up to 5MB. Clear lighting and visible edges yield best accuracy.
              </p>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950/5 flex flex-col items-center justify-center max-h-96 group">
              <img
                src={imagePreview}
                alt="Waste preview"
                className="max-h-80 w-auto object-contain rounded-2xl p-2"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-white/90 hover:bg-rose-50 hover:text-rose-600 text-slate-700 p-2 rounded-xl shadow-md backdrop-blur-xs transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="w-full bg-slate-900/70 backdrop-blur-xs py-2 px-4 text-xs text-white text-center">
                {selectedImage?.name || "Uploaded waste photo"} ({(selectedImage?.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
          )}

          {/* Optional context note when image is selected */}
          <div className="mt-2">
            <input
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="Optional: Add extra details (e.g. 'Has residue inside', 'Rechargeable')"
              className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Text-Only Description Fallback */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Describe the waste item in your own words
            </label>
            <textarea
              rows={3}
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="e.g. An empty plastic water bottle with the cap still on, or an old laptop battery..."
              className="w-full text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 custom-scrollbar resize-none"
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 mb-2 block">
              Quick test examples (click to fill):
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_EXAMPLES.map((eg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTextQuery(eg)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition-colors border border-slate-200/60"
                >
                  {eg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          {activeTab === 'image' && !selectedImage && (
            <span>No image selected yet. Switch to text or drag a photo above.</span>
          )}
          {activeTab === 'text' && !textQuery.trim() && (
            <span>Type a description or click any quick example above.</span>
          )}
          {canAnalyze && (
            <span className="text-emerald-600 font-medium">Ready for AI segregation analysis!</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {(selectedImage || textQuery) && (
            <button
              type="button"
              onClick={onReset}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors"
            >
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all ${
              canAnalyze
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200 hover:shadow-emerald-300 scale-100 active:scale-98'
                : 'bg-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Waste...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Waste</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
