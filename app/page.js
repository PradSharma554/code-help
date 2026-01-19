"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LineChart, BarChart, FileDigit, Brain, Zap } from "lucide-react";
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

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

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
        <Link
          href="/journal"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
        >
          <LineChart className="w-4 h-4" /> Log Mistake
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    </div>
  );
}
