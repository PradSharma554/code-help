"use client";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism-dark.css"; // Using dark theme

import { useState, useEffect } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Play,
  Code,
  AlertCircle,
  Lightbulb,
  Unlock,
  Loader2,
  X,
} from "lucide-react";

export default function AnalyzerPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [hint, setHint] = useState(null);
  const [solution, setSolution] = useState(null);
  const [assistLoading, setAssistLoading] = useState(null); // 'hint' or 'solution'

  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solutionLanguage, setSolutionLanguage] = useState("javascript");
  const [lastAnalyzedCode, setLastAnalyzedCode] = useState("");

  // Persistence: Load on Mount
  useEffect(() => {
    const savedCode = localStorage.getItem("analyzer_code");
    const savedLang = localStorage.getItem("analyzer_lang");
    const savedResult = localStorage.getItem("analyzer_result");
    const savedHint = localStorage.getItem("analyzer_hint");
    const savedSolution = localStorage.getItem("analyzer_solution");
    const savedSolLang = localStorage.getItem("analyzer_sol_lang");

    if (savedCode) {
      setCode(savedCode);
      setLastAnalyzedCode(savedCode); // Initialize lastAnalyzedCode
    }
    if (savedLang) setLanguage(savedLang);
    if (savedResult) setResult(JSON.parse(savedResult));
    if (savedHint) setHint(savedHint);
    if (savedSolution) setSolution(savedSolution);
    if (savedSolLang) setSolutionLanguage(savedSolLang);
  }, []);

  // Persistence: Save on Change
  useEffect(() => {
    localStorage.setItem("analyzer_code", code);
    localStorage.setItem("analyzer_lang", language);

    if (result) localStorage.setItem("analyzer_result", JSON.stringify(result));
    else localStorage.removeItem("analyzer_result");

    if (hint) localStorage.setItem("analyzer_hint", hint);
    else localStorage.removeItem("analyzer_hint");

    if (solution) localStorage.setItem("analyzer_solution", solution);
    else localStorage.removeItem("analyzer_solution");

    if (solutionLanguage)
      localStorage.setItem("analyzer_sol_lang", solutionLanguage);
  }, [code, language, result, hint, solution, solutionLanguage]);

  // Handle Code Change: Just update code, don't reset yet
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  // Helper to reset outputs if code has changed since last analysis/assist
  const checkAndResetStaleData = () => {
    if (code !== lastAnalyzedCode) {
      setResult(null);
      setHint(null);
      setSolution(null);
      setShowSolutionModal(false);
      // lastAnalyzedCode will be updated after successful API call
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    checkAndResetStaleData(); // Reset if code is stale

    setLoading(true);
    setResult(null); // Clear result immediately for new analysis

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setResult(data);
      setLastAnalyzedCode(code); // Mark this code as analyzed
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (!code.trim()) return;

    checkAndResetStaleData(); // Reset if code is stale

    setAssistLoading("hint");
    try {
      const res = await fetch("/api/analyzer/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          type: "hint",
          previousHints: [], // No history needed for single hint mode
        }),
      });
      const data = await res.json();
      if (data.result) {
        setHint(data.result);
        setLastAnalyzedCode(code); // Mark this code as having received a hint
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAssistLoading(null);
    }
  };

  const handleGetSolution = async (lang = language) => {
    if (!code.trim()) return;

    // If code has changed, reset all outputs and proceed to fetch
    if (code !== lastAnalyzedCode) {
      checkAndResetStaleData(); // This will reset solution too
      // Fall through to fetch new solution
    } else {
      // Code is the same. If we already have a solution for this exact language, just open modal
      if (solution && lang === solutionLanguage) {
        setShowSolutionModal(true);
        return;
      }
    }

    setAssistLoading("solution");
    setSolutionLanguage(lang); // Sync language
    try {
      const res = await fetch("/api/analyzer/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang, type: "solution" }),
      });
      const data = await res.json();
      if (data.result) {
        setSolution(data.result);
        setShowSolutionModal(true); // Open immediately
        setLastAnalyzedCode(code); // Mark this code as having received a solution
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAssistLoading(null);
    }
  };

  const hasOutput = result;

  return (
    <div className="max-w-6xl mx-auto min-h-[80vh] flex flex-col md:flex-row gap-6 relative">
      {/* Input Section (Left) */}
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

        <div className="grow w-full border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 min-h-[400px] bg-[#1d1f21] relative">
          <Editor
            value={code}
            onValueChange={(newCode) =>
              handleCodeChange({ target: { value: newCode } })
            }
            highlight={(code) =>
              highlight(
                code,
                languages[language] || languages.javascript,
                language,
              )
            }
            padding={24}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 14,
              minHeight: "400px",
              backgroundColor: "transparent",
              color: "#f8f8f2",
            }}
            className="min-h-[400px]"
            textareaClassName="focus:outline-none"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            Analyze Complexity
          </button>

          <button
            onClick={handleGetHint}
            disabled={assistLoading === "hint" || !code.trim()}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
            title="Get a hint to fix mistakes"
          >
            {assistLoading === "hint" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Lightbulb className="w-5 h-5" />
            )}
            Hint
          </button>

          <button
            onClick={() => handleGetSolution(language)}
            disabled={assistLoading === "solution" || !code.trim()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            title="Reveal the correct solution"
          >
            {assistLoading === "solution" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
            {/* If solution exists, just "Show Solution", else implied fetch */}
            Show Solution
          </button>
        </div>

        {/* Hints Display (Left Side - Below Buttons) */}
        {hint && (
          <div className="mt-6 animate-in slide-in-from-top-4 fade-in">
            <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4" /> Latest Hint
            </h3>
            <div className="p-3 bg-amber-50 text-amber-900 text-sm rounded-lg border border-amber-100 animate-in slide-in-from-top-2">
              {hint}
            </div>
          </div>
        )}
      </div>

      {/* Output Section (Right - Analysis Only) */}
      <div className="md:w-1/3 flex flex-col gap-4 h-[85vh] overflow-y-auto pb-4 pr-1">
        {!hasOutput && (
          <div className="h-full bg-white rounded-xl shadow-lg border p-6 flex flex-col items-center justify-center text-slate-400 text-center">
            <Code className="w-12 h-12 mb-4 opacity-20" />
            <p>Analysis results will appear here.</p>
          </div>
        )}

        {/* Card 1: Complexity Analysis */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg border p-6 animate-in slide-in-from-right-4 fade-in shrink-0">
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
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
        )}
      </div>

      {/* Solution Modal */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-emerald-600" />
                  Optimal Solution
                </h2>
                <select
                  value={solutionLanguage}
                  onChange={(e) => handleGetSolution(e.target.value)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-0 overflow-hidden flex-1 relative bg-[#1d1f21]">
              {assistLoading === "solution" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <div className="h-full overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                  language={solutionLanguage.toLowerCase()}
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    minHeight: "100%",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    background: "transparent",
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {solution || ""}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(solution);
                }}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition flex items-center gap-1"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
