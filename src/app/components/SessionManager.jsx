"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionManager({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only run in browser
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("access_token");
      const userId = sessionStorage.getItem("user_id");

      if (!token || !userId) {
        router.push("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [router]);

  // Optional: prevent flicker by showing loader while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700 text-lg font-medium">Checking session...</div>
      </div>
    );
  }

  return <>{children}</>;
}