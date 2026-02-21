import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export const useAnalyzeComplexity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, language }) => {
      const res = await apiFetch("/api/analyzer/analyze", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, language, type, previousHints = [] }) => {
      const res = await apiFetch("/api/analyzer/assist", {
        method: "POST",
        body: JSON.stringify({ code, language, type, previousHints }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assistant failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
