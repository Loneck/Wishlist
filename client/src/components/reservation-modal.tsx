import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { GiftWithReservations, InsertReservation } from "@shared/schema";

interface ReservationModalProps {
  gift: GiftWithReservations;
  onClose: () => void;
}

export function ReservationModal({ gift, onClose }: ReservationModalProps) {
  const [reservedBy, setReservedBy] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const reservationMutation = useMutation({
    mutationFn: async (data: InsertReservation) => {
      const response = await apiRequest("POST", "/api/reservations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gifts"] });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo completar la reserva.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservedBy.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu nombre completo.",
        variant: "destructive",
      });
      return;
    }

    const quantityNum = parseInt(quantity);
    if (quantityNum > gift.availableQuantity) {
      toast({
        title: "Error",
        description: `Solo hay ${gift.availableQuantity} unidades disponibles.`,
        variant: "destructive",
      });
      return;
    }

    reservationMutation.mutate({
      giftId: gift.id,
      reservedBy: reservedBy.trim(),
      quantity: quantityNum,
    });
  };

  const availableQuantities = Array.from(
    { length: gift.availableQuantity }, 
    (_, i) => i + 1
  );

  if (showSuccess) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center" data-testid="modal-success">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-2xl text-green-600"></i>
          </div>
          <DialogTitle className="text-xl font-semibold text-card-foreground mb-2">
            ¡Reserva Confirmada!
          </DialogTitle>
          <p className="text-muted-foreground mb-6">
            Tu regalo ha sido reservado exitosamente. ¡Gracias por tu consideración!
          </p>
          <Button onClick={onClose} data-testid="button-close-success">
            Continuar
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-reservation">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <i className="fas fa-heart text-primary mr-2"></i>
            Reservar Regalo
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground" data-testid="text-selected-gift-name">
            {gift.name}
          </h4>
          {gift.description && (
            <p className="text-sm text-muted-foreground" data-testid="text-selected-gift-description">
              {gift.description}
            </p>
          )}
          {gift.price && (
            <p className="text-primary font-semibold mt-2" data-testid="text-selected-gift-price">
              {gift.price}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reservedBy" className="text-sm font-medium text-muted-foreground">
              Tu Nombre Completo
            </Label>
            <Input
              id="reservedBy"
              type="text"
              placeholder="Ej: María González López"
              value={reservedBy}
              onChange={(e) => setReservedBy(e.target.value)}
              required
              data-testid="input-reserved-by"
            />
          </div>
          
          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-muted-foreground">
              Cantidad a Reservar
            </Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger data-testid="select-quantity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableQuantities.map(qty => (
                  <SelectItem key={qty} value={qty.toString()}>
                    {qty} unidad{qty > 1 ? 'es' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-1"></i>
              Una vez que reserves este regalo, se marcará como ocupado y nadie más podrá reservarlo.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel-reservation"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={reservationMutation.isPending}
              data-testid="button-confirm-reservation"
            >
              {reservationMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Reservando...
                </>
              ) : (
                <>
                  <i className="fas fa-heart mr-2"></i>
                  Confirmar Reserva
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
