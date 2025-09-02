import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  currentView: "admin" | "public";
  onViewChange: (view: "admin" | "public") => void;
  isAdminAuthenticated: boolean;
  onAdminLogin: (password: string) => boolean;
  onAdminLogout: () => void;
}

export function Header({ currentView, onViewChange, isAdminAuthenticated, onAdminLogin, onAdminLogout }: HeaderProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      onViewChange("admin");
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = onAdminLogin(password);
    
    if (success) {
      setShowPasswordModal(false);
      setPassword("");
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido al panel de administración.",
      });
    } else {
      toast({
        title: "Error",
        description: "Contraseña incorrecta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    onAdminLogout();
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración.",
    });
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setPassword("");
  };

  return (
    <>
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
                onClick={handleAdminClick}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  currentView === "admin"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-muted text-secondary-foreground"
                )}
              >
                <i className="fas fa-cog mr-2"></i>Admin
              </button>
              
              {isAdminAuthenticated && (
                <button 
                  data-testid="button-admin-logout"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Cerrar Sesión
                </button>
              )}
              
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

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-md" data-testid="modal-admin-password">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <i className="fas fa-lock text-primary mr-2"></i>
              Acceso Administrativo
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="adminPassword" className="text-sm font-medium text-muted-foreground">
                Contraseña de Administrador
              </Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-admin-password"
                autoFocus
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-1"></i>
                Solo los administradores pueden acceder a esta sección.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1"
                onClick={closeModal}
                data-testid="button-cancel-admin-login"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
                data-testid="button-confirm-admin-login"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Verificando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key mr-2"></i>
                    Acceder
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
