import { useState } from "react";
import { Header } from "@/components/header";
import { AdminView } from "@/pages/admin";
import { PublicView } from "@/pages/public";

export default function Home() {
  const [currentView, setCurrentView] = useState<"admin" | "public">("public");

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {currentView === "admin" ? <AdminView /> : <PublicView />}
    </div>
  );
}
