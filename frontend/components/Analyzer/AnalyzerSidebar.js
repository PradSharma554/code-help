import { Play, Lightbulb, Unlock, Loader2 } from "lucide-react";

export default function AnalyzerSidebar({
  onAnalyze,
  onGetHint,
  onGetSolution,
  loading,
  assistLoading,
  code,
  language,
}) {
  return (
    <div className="flex flex-col gap-4 mt-2 shrink-0">
      {/* Analyze Button */}
      <div className="relative group">
        <button
          onClick={onAnalyze}
          disabled={loading || !code.trim()}
          className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity shadow-xl border border-slate-700">
          Analyze Complexity
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
        </span>
      </div>

      {/* Hint Button */}
      <div className="relative group">
        <button
          onClick={onGetHint}
          disabled={assistLoading === "hint" || !code.trim()}
          className="p-3 bg-amber-500 text-white rounded-xl shadow-lg hover:bg-amber-600 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          {assistLoading === "hint" ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Lightbulb className="w-6 h-6" />
          )}
        </button>
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity shadow-xl border border-slate-700">
          Get Hint
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
        </span>
      </div>

      {/* Solution Button */}
      <div className="relative group">
        <button
          onClick={() => onGetSolution(language)}
          disabled={assistLoading === "solution" || !code.trim()}
          className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          {assistLoading === "solution" ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Unlock className="w-6 h-6" />
          )}
        </button>
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity shadow-xl border border-slate-700">
          Show Solution
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
        </span>
      </div>
    </div>
  );
}
