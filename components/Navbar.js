"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Brain, FileDigit, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-indigo-600"
        >
          <Brain className="w-6 h-6" />
          Coding Lantern
        </Link>

        <div className="flex items-center gap-6">
          {status === "loading" ? (
            <div className="w-24 h-8 bg-slate-100 rounded animate-pulse"></div>
          ) : session ? (
            <>
              <Link
                href="/journal"
                className="text-sm font-medium hover:text-indigo-600 transition"
              >
                Journal
              </Link>
              <Link
                href="/analyzer"
                className="text-sm font-medium hover:text-indigo-600 transition"
              >
                Complexity Analyzer
              </Link>
              <div className="flex items-center gap-4 pl-4 border-l">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
