import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useMistakes = ({ page = 1, pageSize = 10, search = "" } = {}) => {
  return useQuery({
    queryKey: ["mistakes", page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      });
      const res = await fetch(`/api/mistakes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch mistakes");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
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
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useUpdateMistake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reflection }) => {
      const res = await fetch(`/api/mistakes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflection }),
      });
      if (!res.ok) throw new Error("Failed to update entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mistakes"] });
    },
  });
};
