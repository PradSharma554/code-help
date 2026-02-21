import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await apiFetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
};

export const useSyncLeetCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username) => {
      const res = await apiFetch("/api/leetcode/sync", {
        method: "POST",
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
      const res = await apiFetch("/api/journal/insight", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate insight");
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboardStats"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          insight: data.insight,
          suggestedProblems: data.suggestedProblems || [],
          mistakeCountAtLastInsight: oldData.totalMistakes,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
