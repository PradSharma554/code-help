"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState({ user: null });
  const [status, setStatus] = useState("loading");
  const router = useRouter();

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setSession({
          user: {
            id: data._id,
            name: data.name,
            email: data.email,
            credits: data.credits,
          },
        });
        setStatus("authenticated");
      } else {
        setSession({ user: null });
        setStatus("unauthenticated");
      }
    } catch (e) {
      setSession({ user: null });
      setStatus("unauthenticated");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSession({
          user: {
            id: data._id,
            name: data.name,
            email: data.email,
            credits: data.credits,
          },
        });
        setStatus("authenticated");
        return { ok: true, url: "/dashboard" };
      }
      return { ok: false, error: data.error };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
    setSession({ user: null });
    setStatus("unauthenticated");
    router.push("/login?callbackUrl=/");
  };

  return (
    <AuthContext.Provider
      value={{ session, status, login, logout, data: session }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Aliased as useSession to mimic next-auth shape
export const useSession = () => {
  const context = useContext(AuthContext);
  return {
    data: context.session?.user ? context.session : null,
    status: context.status,
    login: context.login,
    logout: context.logout,
  };
};

export const signIn = async (method, options) => {
  // Return mock since we handle login manually now via useAuth / login page
  return { error: "Use login function from AuthContext" };
};

export const signOut = async (options) => {
  // will be handled in logout
};
