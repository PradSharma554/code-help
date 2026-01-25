"use client";

import { useState, useEffect } from "react";
import {
  useDashboardStats,
  useSyncLeetCode,
  useRefreshInsight,
} from "../../hooks/useDashboard";
import DashboardHeader from "./DashboardHeader";
import InsightCard from "./InsightCard";
import SuggestedProblems from "./SuggestedProblems";
import LeetCodeProgress from "./LeetCodeProgress";
import MistakeDistribution from "./MistakeDistribution";
import WeakTopics from "./WeakTopics";
import RecentLogs from "./RecentLogs";
import SyncModal from "./SyncModal";

export default function DashboardContainer() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError,
    error,
  } = useDashboardStats();
  const syncLeetCode = useSyncLeetCode();
  const refreshInsight = useRefreshInsight();

  const [savedUsername, setSavedUsername] = useState("");
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("leetcode_username");
    if (stored) setSavedUsername(stored);
  }, []);

  const handleSyncClick = () => {
    const stored = localStorage.getItem("leetcode_username");
    if (stored) {
      handleSync(stored);
    } else {
      setShowSyncModal(true);
    }
  };

  const handleEditClick = () => {
    setShowSyncModal(true);
  };

  const handleSync = async (username) => {
    syncLeetCode.mutate(username, {
      onSuccess: () => {
        localStorage.setItem("leetcode_username", username);
        setSavedUsername(username);
        setShowSyncModal(false);
        alert("Synced successfully!");
      },
      onError: (err) => {
        alert(err.message || "Sync failed");
      },
    });
  };

  if (statsLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
        Error loading dashboard: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader
        savedUsername={savedUsername}
        isSyncing={false} // Only local sync state if needed, but mutation covers it
        isSyncingMutation={syncLeetCode.isPending}
        onSyncClick={handleSyncClick}
        onEditClick={handleEditClick}
      />

      <InsightCard
        stats={stats}
        refreshingInsight={refreshInsight.isPending}
        onRefresh={() => refreshInsight.mutate()}
      />

      <SuggestedProblems problems={stats?.suggestedProblems} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LeetCodeProgress leetcodeStats={stats?.leetcodeStats} />
        <MistakeDistribution mistakeTypeStats={stats?.mistakeTypeStats} />
      </div>
      <WeakTopics topicStats={stats?.topicStats} />

      <RecentLogs recentMistakes={stats?.recentMistakes} />

      <SyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        onSync={handleSync}
        isSyncing={syncLeetCode.isPending}
        initialUsername={savedUsername}
      />
    </div>
  );
}
