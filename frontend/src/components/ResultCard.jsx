import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Info,
  Layers,
  Recycle,
  Trash2,
  Cpu,
  Flame,
  ArrowLeft
} from 'lucide-react';

const CATEGORY_STYLES = {
  "Dry / Recyclable": {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    bar: "bg-blue-500",
    icon: Recycle,
    border: "border-blue-200",
    accent: "text-blue-700"
  },
  "Wet / Organic": {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bar: "bg-emerald-500",
    icon: CheckCircle2,
    border: "border-emerald-200",
    accent: "text-emerald-700"
  },
  "E-Waste": {
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    bar: "bg-indigo-500",
    icon: Cpu,
    border: "border-indigo-200",
    accent: "text-indigo-700"
  },
  "Hazardous / Special": {
    badge: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse",
    bar: "bg-rose-500",
    icon: Flame,
    border: "border-rose-300",
    accent: "text-rose-700"
  },
  "General / Non-recyclable": {
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    bar: "bg-slate-500",
    icon: Trash2,
    border: "border-slate-200",
    accent: "text-slate-700"
  },
  "Uncertain": {
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    bar: "bg-amber-500",
    icon: HelpCircle,
    border: "border-amber-300",
    accent: "text-amber-700"
  }
};

export default function ResultCard({ result, onReset }) {
  if (!result) return null;

  const style = CATEGORY_STYLES[result.waste_category] || CATEGORY_STYLES["Uncertain"];
  const CategoryIcon = style.icon;
  const confidencePercent = Math.round((result.confidence || 0) * 100);

  const isHazardous = result.waste_category === "Hazardous / Special";
  const isUncertain = result.waste_category === "Uncertain";

  return (
    <div className={`bg-white rounded-3xl shadow-xl shadow-slate-200/60 border ${style.border} p-6 sm:p-8 transition-all animate-fadeIn`}>
      {/* Top Bar: Reset / Back & Category Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Analyze Another Item</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Category:</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${style.badge}`}>
            <CategoryIcon className="h-4 w-4" />
            {result.waste_category}
          </span>
        </div>
      </div>

      {/* Main Analysis Header */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Item</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {result.detected_item || "Unidentified Item"}
          </h2>

          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">Material:</span>
            <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-xs sm:text-sm text-slate-800 font-medium">
              {result.material || "Unknown / Mixed"}
            </span>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>AI Confidence Score</span>
            <span className={`font-extrabold ${confidencePercent > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {confidencePercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
              style={{ width: `${Math.min(100, Math.max(5, confidencePercent))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-tight">
            {confidencePercent >= 85
              ? "High visual/textual match detected."
              : confidencePercent >= 60
              ? "Moderate certainty; inspect material condition."
              : "Low certainty; check municipal manual sorting guidelines."}
          </p>
        </div>
      </div>

      {/* Hazardous Special Alert Banner */}
      {isHazardous && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="font-bold block mb-0.5">Hazardous Waste Caution</strong>
            Never dispose of this item in normal household trash or domestic bins. Do not puncture, burn, crush, or dismantle. Deliver to an authorized municipal hazardous waste depot or official e-waste drop-off box.
          </div>
        </div>
      )}

      {/* Uncertain Information Request */}
      {isUncertain && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="font-bold block mb-0.5">Ambiguous or Uncertain Classification</strong>
            Responsible AI requires acknowledging ambiguity rather than guessing. Try uploading a clearer, well-lit photo showing recycling symbols (e.g., resin identification codes #1 to #7) or provide more detail in the text box.
          </div>
        </div>
      )}

      {/* Grid: Disposal Guidance & Explanation */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Disposal */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Recommended Action</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {result.disposal_guidance}
            </p>
          </div>
        </div>

        {/* Classification Explanation */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
              <Info className="h-4 w-4 text-teal-600" />
              <span>Why This Classification?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {result.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Sustainability Tip */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-emerald-950">
          <strong className="font-bold block text-emerald-900 mb-0.5">Sustainability Tip (SDG 12)</strong>
          {result.sustainability_tip}
        </div>
      </div>

      {/* Safety / Local Municipal Rule Warning */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-[12px] text-slate-500">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Safety & Local Rules Notice:</strong> {result.safety_note || "Disposal rules vary by location. Follow your local municipality's waste-management guidelines."}
        </p>
      </div>
    </div>
  );
}
