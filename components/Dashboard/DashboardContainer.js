"use client";

import { useState, useEffect } from "react";
import {
  useDashboardStats,
  useSyncLeetCode,
  useRefreshInsight,
} from "../../hooks/useDashboard";
import {
  useLeetCodeUsername,
  useUpdateLeetCodeUsername,
} from "../../hooks/useJournal";
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

  // console.log(stats?.credits);

  const syncLeetCode = useSyncLeetCode();
  const refreshInsight = useRefreshInsight();

  const [savedUsername, setSavedUsername] = useState("");
  const [showSyncModal, setShowSyncModal] = useState(false);

  const { data: leetCodeData } = useLeetCodeUsername();
  const updateLeetCodeUsername = useUpdateLeetCodeUsername();

  // console.log(leetCodeData);

  useEffect(() => {
    if (leetCodeData && leetCodeData.username) {
      setSavedUsername(leetCodeData.username);
    } else if (leetCodeData && !leetCodeData.username) {
      setSavedUsername("");
    }
  }, [leetCodeData]);

  const handleSyncClick = () => {
    if (savedUsername) {
      handleSync(savedUsername);
    } else {
      setShowSyncModal(true);
    }
  };

  const handleEditClick = () => {
    setShowSyncModal(true);
  };

  const handleSync = async (username) => {
    try {
      // First update the username linked to the account
      await updateLeetCodeUsername.mutateAsync(username);

      // Then perform the sync
      syncLeetCode.mutate(username, {
        onSuccess: () => {
          setSavedUsername(username);
          setShowSyncModal(false);
          refreshInsight.mutate();
          alert("Synced successfully!");
        },
        onError: (err) => {
          alert(err.message || "Sync failed");
        },
      });
    } catch (error) {
      alert("Failed to update username");
    }
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
        credits={stats?.credits}
      />

      <InsightCard
        stats={stats}
        refreshingInsight={refreshInsight.isPending}
        onRefresh={() =>
          refreshInsight.mutate(undefined, {
            onError: (err) => {
              if (
                err.message.includes("quota") ||
                err.message.includes("402")
              ) {
                alert(
                  "You've reached your quota! Please pay $20 to use further.",
                );
              } else {
                alert(err.message || "Refresh failed");
              }
            },
          })
        }
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
