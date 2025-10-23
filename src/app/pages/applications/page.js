"use client";

import ApplicationsPage from "@/app/components/Applications/ApplicationsPage";
import SessionManager from "@/app/components/SessionManager";

export default function Applications() {
  return (
    <SessionManager>
      <ApplicationsPage />
    </SessionManager>
  );
}