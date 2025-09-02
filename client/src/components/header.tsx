import { cn } from "@/lib/utils";

interface HeaderProps {
  currentView: "admin" | "public";
  onViewChange: (view: "admin" | "public") => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <i className="fas fa-gift text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold text-foreground">Mi Lista de Regalos</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              data-testid="button-admin-toggle"
              onClick={() => onViewChange("admin")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                currentView === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-muted text-secondary-foreground"
              )}
            >
              <i className="fas fa-cog mr-2"></i>Admin
            </button>
            <button 
              data-testid="button-public-toggle"
              onClick={() => onViewChange("public")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                currentView === "public"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-muted text-secondary-foreground"
              )}
            >
              <i className="fas fa-eye mr-2"></i>Vista Pública
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
