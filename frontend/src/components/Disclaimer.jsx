import React, { useState } from 'react';
import { ShieldCheck, Eye, Lock, Scale, ChevronDown, ChevronUp } from 'lucide-react';

export default function Disclaimer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-8 rounded-2xl bg-white/70 border border-slate-200/80 p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Responsible AI & Human Oversight Notice
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500">
              AI recommendations are informational. Municipal solid waste regulations always take priority.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
        >
          <span>{expanded ? "Hide Principles" : "View AI Principles"}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 animate-fadeIn">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <Lock className="h-3.5 w-3.5 text-teal-600" />
              <span>Zero-Storage Privacy</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Uploaded waste images are processed strictly in volatile memory (RAM) and immediately discarded. No user photos or identifying data are persisted.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <Scale className="h-3.5 w-3.5 text-indigo-600" />
              <span>Fairness & Uncertainty</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tested against varying lighting, angles, and conditions. If an object cannot be verified with certainty, the model marks it as "Uncertain" rather than guessing.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <Eye className="h-3.5 w-3.5 text-amber-600" />
              <span>Full Transparency</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every classification explicitly exposes detected item, estimated material composition, confidence percentage, and actionable environmental rationale.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
