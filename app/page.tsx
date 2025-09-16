"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AuthForm from "../components/AuthForm";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const user = session?.user;
  const canShowDashboard =
    user && (user.name || user.email || user.image || user.id);

  return (
    <div className="min-h-screen">
      {canShowDashboard ? <Dashboard user={user} /> : <AuthForm />}
    </div>
  );
}
