"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  LineChart,
  BarChart,
  FileDigit,
  Brain,
  Zap,
  ChevronDown,
  ChevronUp,
  Target,
  ExternalLink,
  DownloadCloud,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return <Dashboard />;
  }

  return <Landing />;
}

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
        Master Algorithms with <span className="text-indigo-600">Insight</span>.
      </h1>
      <p className="max-w-2xl text-lg text-slate-600">
        Stop grinding blindly. Log your LeetCode mistakes, spot patterns, and
        analyze complexity with AI-powered tools. Built for serious competitive
        programmers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-12 py-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border hover:border-indigo-200 transition text-left hover:shadow-md">
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
            <LineChart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Mistake Journal</h3>
          <p className="text-slate-500">
            Log every TLE and logic error. Visualise your weak spots over time.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border hover:border-indigo-200 transition text-left hover:shadow-md">
          <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center mb-4 text-pink-600">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Complexity Analyzer</h3>
          <p className="text-slate-500">
            Paste code to get instant Big-O analysis and optimization tips.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition hover:border-slate-400"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [refreshingInsight, setRefreshingInsight] = useState(false);
  const [isInsightExpanded, setIsInsightExpanded] = useState(false);

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
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
        alert(data.message);
        setShowSyncModal(false);
        fetchStats();
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

  const refreshInsight = async () => {
    setRefreshingInsight(true);
    try {
      const res = await fetch("/api/journal/insight", { method: "POST" });
      const data = await res.json();
      if (data.insight) {
        setStats((prev) => ({
          ...prev,
          insight: data.insight,
          suggestedProblems: data.suggestedProblems || [],
          mistakeCountAtLastInsight: prev.totalMistakes,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshingInsight(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  const COLORS = ["#4f46e5", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Your Overview</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/30"
          >
            <DownloadCloud className="w-4 h-4" /> Sync LeetCode
          </button>
          <Link
            href="/journal"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
          >
            <LineChart className="w-4 h-4" /> Log Mistake
          </Link>
        </div>
      </div>

      {/* AI Insight Card */}
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
              onClick={refreshInsight}
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
              onClick={refreshInsight}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 underline"
            >
              Generate First Report
            </button>
          </div>
        )}
      </div>

      {/* Suggested Problems (Separate Card) */}
      {stats &&
        stats.suggestedProblems &&
        stats.suggestedProblems.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Recommended Practice
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-indigo-50/50">
                  <tr className="text-slate-500 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Problem</th>
                    <th className="px-4 py-3 font-medium">Topic</th>
                    <th className="px-4 py-3 font-medium">Difficulty</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {stats.suggestedProblems.map((prob, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/30 transition">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {prob.problemName}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{prob.topic}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            prob.difficulty === "Hard"
                              ? "bg-red-50 text-red-600"
                              : prob.difficulty === "Medium"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-green-50 text-green-600"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={prob.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 text-xs font-semibold"
                        >
                          Solve <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LeetCode Stats (Pie Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="font-semibold text-slate-700">LeetCode Progress</h3>
            <span className="text-xs text-slate-400">
              Total: {stats?.leetcodeStats?.totalSolved || 0}
            </span>
          </div>

          {stats?.leetcodeStats ? (
            <div className="relative w-full h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Easy",
                        value: stats.leetcodeStats.easySolved || 0,
                        fill: "#10b981",
                      },
                      {
                        name: "Medium",
                        value: stats.leetcodeStats.mediumSolved || 0,
                        fill: "#f59e0b",
                      },
                      {
                        name: "Hard",
                        value: stats.leetcodeStats.hardSolved || 0,
                        fill: "#ef4444",
                      },
                    ]}
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    cornerRadius={5}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">
                  {stats.leetcodeStats.totalSolved}
                </span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Solved
                </span>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic">
              Sync LeetCode to see stats
            </div>
          )}

          {stats?.leetcodeStats && (
            <div className="w-full grid grid-cols-3 gap-2 mt-2 text-center">
              <div className="bg-emerald-50 rounded-lg p-2">
                <div className="text-emerald-600 font-bold text-lg">
                  {stats.leetcodeStats.easySolved}
                </div>
                <div className="text-emerald-700/60 text-[10px] uppercase font-bold">
                  Easy
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-2">
                <div className="text-amber-600 font-bold text-lg">
                  {stats.leetcodeStats.mediumSolved}
                </div>
                <div className="text-amber-700/60 text-[10px] uppercase font-bold">
                  Med
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-2">
                <div className="text-red-600 font-bold text-lg">
                  {stats.leetcodeStats.hardSolved}
                </div>
                <div className="text-red-700/60 text-[10px] uppercase font-bold">
                  Hard
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mistake Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border hovershadow-md transition">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">
            Mistake Distribution
          </h3>
          <div className="h-64">
            {stats && stats.mistakeTypeStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.mistakeTypeStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="_id"
                  >
                    {stats.mistakeTypeStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#1e293b" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
                No data logged yet
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {stats &&
              stats.mistakeTypeStats.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded-full border"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: COLORS[index % COLORS.length] }}
                  ></span>
                  {entry._id}
                </div>
              ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">
            Weak Topics
          </h3>
          <div className="h-64">
            {stats && stats.topicStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={stats.topicStats}
                  layout="vertical"
                  margin={{ left: 10, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="_id"
                    width={90}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </ReBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
                No data logged yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">
          Recent Logs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500 uppercase text-xs tracking-wider">
                <th className="pb-3 font-medium px-4">Problem</th>
                <th className="pb-3 font-medium px-4">Topic</th>
                <th className="pb-3 font-medium px-4">Mistake</th>
                <th className="pb-3 font-medium px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats && stats.recentMistakes.length > 0 ? (
                stats.recentMistakes.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {log.problemName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-600 border border-slate-200">
                        {log.topic}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          log.mistakeType === "TLE"
                            ? "bg-yellow-100 text-yellow-700"
                            : log.mistakeType === "Wrong Approach"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {log.mistakeType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono text-xs">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-slate-400 italic"
                  >
                    No logs found. Start your journey today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              and update your progress stats.
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
    </div>
  );
}
