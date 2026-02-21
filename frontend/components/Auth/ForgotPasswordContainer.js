"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordContainer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="shadow-lg p-8 bg-white rounded-xl w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            className="p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          <button
            disabled={loading}
            className="bg-indigo-600 text-white font-bold cursor-pointer px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <div className="bg-green-50 text-green-600 text-sm py-2 px-3 rounded-md mt-2">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end mt-3 text-sm">
            <Link
              className="text-slate-500 hover:text-indigo-600"
              href={"/login"}
            >
              Back to <span className="underline">Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
