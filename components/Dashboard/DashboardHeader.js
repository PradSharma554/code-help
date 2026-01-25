import { DownloadCloud, LineChart, Edit, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader({
  savedUsername,
  isSyncing,
  isSyncingMutation,
  onSyncClick,
  onEditClick,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Your Overview</h2>
        {savedUsername && (
          <div className="flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-left-2">
            <span className="text-sm text-slate-500">Connected as:</span>
            <a
              href={`https://leetcode.com/${savedUsername}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              {savedUsername}
            </a>
            <button
              onClick={onEditClick}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
              title="Change Username"
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onSyncClick}
          disabled={isSyncing || isSyncingMutation}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/30 disabled:opacity-70"
        >
          {isSyncing || isSyncingMutation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <DownloadCloud className="w-4 h-4" />
          )}
          {isSyncing || isSyncingMutation ? "Syncing..." : "Sync LeetCode"}
        </button>
        <Link
          href="/journal"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
        >
          <LineChart className="w-4 h-4" /> Log Mistake
        </Link>
      </div>
    </div>
  );
}
