"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LineChart, Zap } from "lucide-react";
import DashboardContainer from "../components/Dashboard/DashboardContainer";

import PageLoader from "../components/Common/PageLoader";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  if (session) {
    return <DashboardContainer />;
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
        analyze complexity with AI-powered tools.
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
