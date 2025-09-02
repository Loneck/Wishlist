import { useState } from "react";
import { Header } from "@/components/header";
import { AdminView } from "@/pages/admin";
import { PublicView } from "@/pages/public";

export default function Home() {
  const [currentView, setCurrentView] = useState<"admin" | "public">("public");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleViewChange = (view: "admin" | "public") => {
    if (view === "public") {
      setCurrentView("public");
    } else if (view === "admin" && isAdminAuthenticated) {
      setCurrentView("admin");
    }
    // If trying to access admin without authentication, Header will handle the password prompt
  };

  const handleAdminLogin = (password: string) => {
    if (password === "Yodita2025") {
      setIsAdminAuthenticated(true);
      setCurrentView("admin");
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView("public");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />
      {currentView === "admin" ? <AdminView /> : <PublicView />}
    </div>
  );
}
