"use client";

import { useSession } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoader from "../Common/PageLoader";

export default function AuthGuard({ children }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <PageLoader />;
  }

  if (status === "unauthenticated") return null;

  return children;
}
