import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export const useMistakes = ({ page = 1, pageSize = 10, search = "" } = {}) => {
  return useQuery({
    queryKey: ["mistakes", page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      });
      const res = await apiFetch(`/api/mistakes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch mistakes");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalyzeCode = () => {
  return useMutation({
    mutationFn: async ({ code, language = "javascript" }) => {
      const res = await apiFetch("/api/analyzer/analyze", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      return data;
    },
  });
};

export const useCreateMistake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiFetch("/api/mistakes", {
        method: "POST",
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
      const res = await apiFetch(`/api/mistakes/${id}`, {
        method: "PUT",
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

export const useLeetCodeUsername = () => {
  return useQuery({
    queryKey: ["leetcodeUsername"],
    queryFn: async () => {
      const res = await apiFetch("/api/user/leetcode");
      if (!res.ok) throw new Error("Failed to fetch username");
      return res.json();
    },
  });
};

export const useUpdateLeetCodeUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username) => {
      const res = await apiFetch("/api/user/leetcode", {
        method: "PUT",
        body: JSON.stringify({ username }),
      });
      if (!res.ok) throw new Error("Failed to update username");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leetcodeUsername"] });
    },
  });
};
