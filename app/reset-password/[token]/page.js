"use client";

import ResetPasswordContainer from "@/components/Auth/ResetPasswordContainer";

export default function ResetPasswordPage({ params }) {
  return <ResetPasswordContainer token={params.token} />;
}
