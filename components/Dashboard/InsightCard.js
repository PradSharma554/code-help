import { Brain, Zap, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function InsightCard({ stats, refreshingInsight, onRefresh }) {
  const [isInsightExpanded, setIsInsightExpanded] = useState(false);

  return (
    <div className="bg-linear-to-r from-violet-50 to-indigo-50 border border-violet-100 p-6 rounded-xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100/50 rounded-lg">
            <Brain className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              AI Performance Insight
            </h3>
            <p className="text-xs text-slate-500">
              {stats && stats.mistakeCountAtLastInsight
                ? `Last updated after ${stats.mistakeCountAtLastInsight} logs`
                : "Analyze your journal to generate report"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={refreshingInsight}
            className="text-xs font-medium px-3 py-1.5 bg-white border border-violet-100 text-violet-600 rounded-md hover:bg-violet-50 transition flex items-center gap-1.5 disabled:opacity-70 shadow-sm"
          >
            {refreshingInsight ? (
              <div className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Zap className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">Refresh</span>
          </button>
          {stats?.insight && (
            <button
              onClick={() => setIsInsightExpanded(!isInsightExpanded)}
              className="p-1.5 bg-white border border-violet-100 text-slate-500 rounded-md hover:bg-violet-50 transition"
            >
              {isInsightExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Insight Content */}
      {stats && stats.insight ? (
        <div
          className={`relative transition-all duration-500 overflow-hidden ${isInsightExpanded ? "max-h-[2000px]" : "max-h-32"}`}
        >
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-white/60 p-5 rounded-xl border border-violet-100/50 shadow-sm">
            {stats.insight.split("**").map((part, index) =>
              index % 2 === 1 ? (
                <strong key={index} className="text-violet-700 font-bold">
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
          </div>

          {!isInsightExpanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-indigo-50 to-transparent flex items-end justify-center pb-2 cursor-pointer"
              onClick={() => setIsInsightExpanded(true)}
            >
              <span className="text-xs font-semibold text-violet-600 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-violet-100">
                Click to expand
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 bg-white/40 rounded-lg border border-dashed border-violet-200">
          <p className="mb-2">No analysis generated yet.</p>
          <button
            onClick={onRefresh}
            className="text-sm font-medium text-violet-600 hover:text-violet-700 underline"
          >
            Generate First Report
          </button>
        </div>
      )}
    </div>
  );
}
