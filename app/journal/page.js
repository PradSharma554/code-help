"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  X,
  Search,
  Filter,
  Sparkles,
  Loader2,
  DownloadCloud,
} from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const { data: session } = useSession();
  const [mistakes, setMistakes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetchMistakes();
  }, [session]);

  const fetchMistakes = async () => {
    const res = await fetch("/api/mistakes");
    if (res.ok) {
      const data = await res.json();
      setMistakes(data);
    }
  };

  const handleSync = async () => {
    if (!leetcodeUsername.trim()) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/leetcode/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: leetcodeUsername }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message); // Simple feedback for now
        setShowSyncModal(false);
        fetchMistakes();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Sync failed. Check console.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!codeSnippet.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Defaulting to javascript for now, ideally could add a selector
        body: JSON.stringify({ code: codeSnippet, language: "javascript" }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.problemName || !data.topic) return;

    const payload = {
      ...data,
      codeSnippet,
      complexityAnalysis: analysis
        ? {
            time: analysis.timeComplexity,
            space: analysis.spaceComplexity,
            note: analysis.improvements,
          }
        : undefined,
    };

    const res = await fetch("/api/mistakes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      fetchMistakes();
      e.target.reset();
      setCodeSnippet("");
      setAnalysis(null);
    }
  };

  const filteredMistakes = mistakes.filter(
    (m) =>
      m.problemName.toLowerCase().includes(filter.toLowerCase()) ||
      m.topic.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mistake Journal</h1>
          <p className="text-slate-500 mt-1">
            Reflect on your errors to stop making them.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
          >
            <DownloadCloud className="w-4 h-4" /> Sync LeetCode
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium"
          >
            {showForm ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {showForm ? "Cancel" : "Log Mistake"}
          </button>
        </div>
      </div>

      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Sync from LeetCode
              </h3>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Enter your LeetCode username to fetch recent failed submissions
              (TLE, Wrong Answer, etc.). This will auto-log them so you can add
              reflections.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="e.g. tmwilliamlin168"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSyncModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSync}
                disabled={isSyncing || !leetcodeUsername.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-70"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <DownloadCloud className="w-4 h-4" />
                )}
                {isSyncing ? "Syncing..." : "Sync Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 mb-8 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4 text-slate-800">New Entry</h3>
          <form onSubmit={handleCreate} className="space-y-4">
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
                onClick={() => setShowForm(false)}
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
      )}

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by problem or topic..."
          className="w-full pl-10 pr-4 py-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredMistakes.map((mistake) => (
          <div
            key={mistake._id}
            className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {mistake.problemName}
                </h3>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full border">
                    {mistake.platform}
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">
                    {mistake.topic}
                  </span>
                </div>
              </div>
              <span
                className={clsx("text-xs font-semibold px-2 py-1 rounded", {
                  "bg-red-50 text-red-700":
                    mistake.mistakeType === "Wrong Approach" ||
                    mistake.mistakeType === "Logic Bug",
                  "bg-yellow-50 text-yellow-700": mistake.mistakeType === "TLE",
                  "bg-orange-50 text-orange-700":
                    mistake.mistakeType === "Edge Case",
                  "bg-slate-100 text-slate-600":
                    mistake.mistakeType === "Other",
                })}
              >
                {mistake.mistakeType}
              </span>
            </div>

            {mistake.complexityAnalysis && mistake.complexityAnalysis.time && (
              <div className="mb-3 flex gap-4 text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                <span>TC: {mistake.complexityAnalysis.time}</span>
                <span>SC: {mistake.complexityAnalysis.space}</span>
              </div>
            )}

            <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-400 italic">
              "{mistake.reflection}"
            </p>
            <div className="mt-3 text-xs text-slate-400 flex justify-end">
              {new Date(mistake.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        {filteredMistakes.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
            No entries found. Start logging your grind!
          </div>
        )}
      </div>
    </div>
  );
}
