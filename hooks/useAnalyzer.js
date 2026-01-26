import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAnalyzeComplexity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, language }) => {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch("/api/analyzer/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
