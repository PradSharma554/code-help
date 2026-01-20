"use client";

import { useState } from "react";
import { Play, Code, AlertCircle, CheckCircle } from "lucide-react";

export default function AnalyzerPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex flex-col md:flex-row gap-6">
      {/* Input Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">
            Code Complexity Analyzer
          </h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your solution here..."
          className="flex-grow w-full p-4 font-mono text-sm bg-slate-900 text-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
        ></textarea>

        <button
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            "Analyzing..."
          ) : (
            <>
              <Play className="w-5 h-5" /> Analyze Complexity
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="md:w-1/3 bg-white rounded-xl shadow-lg border p-6 overflow-y-auto">
        {!result ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
            <Code className="w-12 h-12 mb-4 opacity-20" />
            <p>Analysis results will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Estimates
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                  <div className="text-xs text-indigo-500 mb-1">
                    Time Complexity
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {result.timeComplexity}
                  </div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg text-center">
                  <div className="text-xs text-pink-500 mb-1">
                    Space Complexity
                  </div>
                  <div className="text-2xl font-bold text-pink-700">
                    {result.spaceComplexity}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                AI Explanation
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm">
                {result.explanation}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Improvements
              </h3>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {result.improvements}
              </div>
            </div>

            {/* Static Analysis Debug Info */}
            <div className="pt-6 border-t">
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
        )}
      </div>
    </div>
  );
}
