import React, { useState } from 'react';
import { Recycle, Info, Sparkles, Globe2, ShieldCheck, X } from 'lucide-react';

export default function Header() {
  const [showSdgModal, setShowSdgModal] = useState(false);

  return (
    <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Recycle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                EcoSort AI
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200">
                1M1B Edition
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Make the right disposal choice.
            </p>
          </div>
        </div>

        {/* SDG Badges & Quick Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <button
            onClick={() => setShowSdgModal(true)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-all shadow-2xs"
            title="View SDG 12 Alignment"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
            <span>SDG 12: Responsible Consumption</span>
          </button>

          <button
            onClick={() => setShowSdgModal(true)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-all shadow-2xs"
            title="View SDG 11 Alignment"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
            <span>SDG 11: Sustainable Cities</span>
          </button>

          <button
            onClick={() => setShowSdgModal(true)}
            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Learn about SDG impact"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SDG Alignment Modal */}
      {showSdgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowSdgModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">United Nations SDG Alignment</h3>
                <p className="text-xs text-slate-500">1M1B AI for Sustainability Virtual Internship</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-xs font-extrabold">SDG 12</span>
                  <span>Responsible Consumption & Production</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-950">
                  Target 12.5 aims to substantially reduce waste generation through prevention, reduction, recycling, and reuse. EcoSort AI directly curbs recycling contamination by guiding consumers on exact segregation and circular habits.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-xs font-extrabold">SDG 11</span>
                  <span>Sustainable Cities & Communities</span>
                </div>
                <p className="text-xs leading-relaxed text-emerald-950">
                  Target 11.6 focuses on reducing the adverse per capita environmental impact of cities, including municipal solid waste management. EcoSort AI empowers households and schools to participate constructively in municipal waste streams.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSdgModal(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
