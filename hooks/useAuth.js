import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      // 1. Check if user exists
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const { user } = await resUserExists.json();
      if (user) throw new Error("User already exists.");

      // 2. Register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("User registration failed.");
      return res.json();
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) throw new Error("Invalid credentials");
      return res;
    },
  });
};
