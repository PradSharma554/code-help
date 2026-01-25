import { useMutation } from "@tanstack/react-query";

export const useAnalyzeComplexity = () => {
  return useMutation({
    mutationFn: async ({ code, language }) => {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      return res.json();
    },
  });
};

export const useAssistant = () => {
  return useMutation({
    mutationFn: async ({ code, language, type, previousHints = [] }) => {
      const res = await fetch("/api/analyzer/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, type, previousHints }),
      });
      if (!res.ok) throw new Error("Assistant failed");
      return res.json();
    },
  });
};
