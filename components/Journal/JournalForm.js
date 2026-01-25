import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useAnalyzeCode } from "../../hooks/useJournal";

export default function JournalForm({ onSubmit, onCancel }) {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const analyzeCode = useAnalyzeCode();

  const handleAnalyze = () => {
    if (!codeSnippet.trim()) return;
    setAnalysis(null);
    analyzeCode.mutate(
      { code: codeSnippet, language: "javascript" },
      {
        onSuccess: (data) => setAnalysis(data),
      },
    );
  };

  const isAnalyzing = analyzeCode.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!data.problemName || !data.topic) return;

    onSubmit({
      ...data,
      codeSnippet,
      complexityAnalysis: analysis
        ? {
            time: analysis.timeComplexity,
            space: analysis.spaceComplexity,
            note: analysis.improvements,
          }
        : undefined,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 mb-8 animate-in slide-in-from-top-4">
      <h3 className="text-lg font-bold mb-4 text-slate-800">New Entry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Problem Name
            </label>
            <input
              name="problemName"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Two Sum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Topic
            </label>
            <input
              name="topic"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Arrays, DP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Platform
            </label>
            <select
              name="platform"
              className="w-full p-2 border rounded-md outline-none"
            >
              <option>LeetCode</option>
              <option>Codeforces</option>
              <option>HackerRank</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mistake Type
            </label>
            <select
              name="mistakeType"
              className="w-full p-2 border rounded-md outline-none"
            >
              <option>Wrong Approach</option>
              <option>Edge Case</option>
              <option>TLE</option>
              <option>Logic Bug</option>
              <option>Implementation Error</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Code Snippet & AI Analysis */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">
              Code Snippet
            </label>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !codeSnippet.trim()}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
            >
              {isAnalyzing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            rows="4"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm bg-slate-50"
            placeholder="Paste your code here..."
          ></textarea>

          {/* Analysis Result Preview */}
          {analysis && (
            <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-sm">
              <div className="flex gap-4 mb-2">
                <div>
                  <span className="font-bold text-indigo-700">Time:</span>{" "}
                  {analysis.timeComplexity}
                </div>
                <div>
                  <span className="font-bold text-indigo-700">Space:</span>{" "}
                  {analysis.spaceComplexity}
                </div>
              </div>
              <div>
                <span className="font-bold text-indigo-700">Feedback:</span>{" "}
                {analysis.improvements}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Reflection (What went wrong?)
          </label>
          <textarea
            name="reflection"
            required
            rows="3"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="I forgot to handle empty array case..."
          ></textarea>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}
