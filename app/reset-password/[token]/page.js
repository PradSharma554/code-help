"use client";

import { use } from "react";
import ResetPasswordContainer from "@/components/Auth/ResetPasswordContainer";

export default function ResetPasswordPage({ params }) {
  const { token } = use(params);
  return <ResetPasswordContainer token={token} />;
}
