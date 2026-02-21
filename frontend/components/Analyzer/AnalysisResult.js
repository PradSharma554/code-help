import { Code, AlertCircle } from "lucide-react";

export default function AnalysisResult({ result }) {
  if (!result) {
    return (
      <div className="h-full bg-white rounded-xl shadow-lg border p-6 flex flex-col items-center justify-center text-slate-400 text-center">
        <Code className="w-12 h-12 mb-4 opacity-20" />
        <p>Analysis results will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 animate-in slide-in-from-right-4 fade-in shrink-0">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Estimates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg text-center">
            <div className="text-xs text-indigo-500 mb-1">Time Complexity</div>
            <div className="text-2xl font-bold text-indigo-700">
              {result.timeComplexity}
            </div>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg text-center">
            <div className="text-xs text-pink-500 mb-1">Space Complexity</div>
            <div className="text-2xl font-bold text-pink-700">
              {result.spaceComplexity}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
          AI Explanation
        </h3>
        <p className="text-slate-700 leading-relaxed text-sm">
          {result.explanation}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Improvements
        </h3>
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {result.improvements}
        </div>
      </div>

      {/* Static Analysis Debug Info */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-xs font-semibold text-slate-400 mb-2">
          Static Analysis Checks
        </h3>
        <div className="flex gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded ${result.stats.loops > 0 ? "bg-slate-200" : "bg-slate-100 text-slate-400"}`}
          >
            Loops: {result.stats.loops}
          </span>
          {result.stats.recursion && (
            <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">
              Recursion Detected
            </span>
          )}
          {result.stats.nestedLoops && (
            <span className="px-2 py-1 rounded bg-red-100 text-red-700">
              Nested Loops
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
