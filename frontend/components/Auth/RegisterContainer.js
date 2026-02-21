import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "../../hooks/useAuth";

export default function RegisterContainer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          e.target.reset();
          router.push("/login");
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
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
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
            disabled={registerMutation.isPending}
            className="bg-indigo-600 text-white font-bold cursor-pointer px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {registerMutation.isPending
              ? "Registering..."
              : "Register for Free"}
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link
            className="text-sm mt-3 text-right text-slate-500 hover:text-indigo-600"
            href={"/login"}
          >
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
