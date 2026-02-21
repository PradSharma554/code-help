import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      // 1. Check if user exists
      const resUserExists = await apiFetch("/api/auth/userExists", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const { user } = await resUserExists.json();
      if (user) throw new Error("User already exists.");

      // 2. Register
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("User registration failed.");
      return res.json();
    },
  });
};

export const useLogin = () => {
  const { login } = useSession();
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await login(email, password);
      if (res?.error) throw new Error(res.error || "Invalid credentials");
      return res;
    },
  });
};
