import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
};

export const useSyncLeetCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username) => {
      const res = await fetch("/api/leetcode/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useRefreshInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/journal/insight", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to generate insight");
      return data;
    },
    onSuccess: (data) => {
      // We can update the cache directly or invalidate
      // Here we invalidate because the insight is part of the stats
      queryClient.setQueryData(["dashboardStats"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          insight: data.insight,
          suggestedProblems: data.suggestedProblems || [],
          mistakeCountAtLastInsight: oldData.totalMistakes, // We might need to assume this updates, but invalidation is safer if we want exact server state.
          // However, the original code updated local state manually to avoid refetch.
          // Let's rely on invalidation for simplicity unless performance is critical,
          // OR manually update if we trust the return.
        };
      });
      // Optionally also invalidate to be sure
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
