import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useMistakes = () => {
  return useQuery({
    queryKey: ["mistakes"],
    queryFn: async () => {
      const res = await fetch("/api/mistakes");
      if (!res.ok) throw new Error("Failed to fetch mistakes");
      return res.json();
    },
  });
};

export const useAnalyzeCode = () => {
  return useMutation({
    mutationFn: async ({ code, language = "javascript" }) => {
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

export const useCreateMistake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/mistakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mistakes"] });
      // Also invalidate dashboard stats as new mistake affects it
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
