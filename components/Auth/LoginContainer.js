import Link from "next/link";
import { useState } from "react";
import { useLogin } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useLogin();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace("/");
        },
        onError: (err) => {
          setError(err.message);
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="shadow-lg p-8 bg-white rounded-xl w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">
          Login to Insight
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          <button
            disabled={loginMutation.isPending}
            className="bg-indigo-600 text-white font-bold cursor-pointer px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link
            className="text-sm mt-3 text-right text-slate-500 hover:text-indigo-600"
            href={"/register"}
          >
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
