import { useQuery } from "@tanstack/react-query";
import { AddGiftForm } from "@/components/add-gift-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { GiftWithReservations } from "@shared/schema";

export function AdminView() {
  const { toast } = useToast();
  
  const { data: gifts, isLoading } = useQuery<GiftWithReservations[]>({
    queryKey: ["/api/gifts"],
  });

  const handleDeleteGift = async (giftId: string) => {
    try {
      await apiRequest("DELETE", `/api/gifts/${giftId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/gifts"] });
      toast({
        title: "Regalo eliminado",
        description: "El regalo ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el regalo.",
        variant: "destructive",
      });
    }
  };

  const totalGifts = gifts?.length || 0;
  const reservedGifts = gifts?.filter(gift => gift.reservedQuantity > 0).length || 0;
  const availableGifts = gifts?.filter(gift => gift.availableQuantity > 0).length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Gift Section */}
        <div className="lg:col-span-1">
          <AddGiftForm />

          {/* Reservations Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-pie text-primary mr-2"></i>
                Resumen de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <span className="text-sm text-muted-foreground">Total de regalos</span>
                <span className="font-semibold text-foreground" data-testid="text-total-gifts">
                  {totalGifts}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm text-green-700">Reservados</span>
                <span className="font-semibold text-green-800" data-testid="text-reserved-gifts">
                  {reservedGifts}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                <span className="text-sm text-blue-700">Disponibles</span>
                <span className="font-semibold text-blue-800" data-testid="text-available-gifts">
                  {availableGifts}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Gift List & Reservations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gift Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-list text-primary mr-2"></i>
                Gestión de Regalos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : gifts?.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-gift text-4xl text-muted-foreground mb-4"></i>
                  <p className="text-muted-foreground">No hay regalos en la lista aún.</p>
                  <p className="text-sm text-muted-foreground">Agrega tu primer regalo usando el formulario.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {gifts?.map((gift) => (
                    <div 
                      key={gift.id} 
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      data-testid={`card-gift-${gift.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground" data-testid={`text-gift-name-${gift.id}`}>
                            {gift.name}
                          </h3>
                          {gift.description && (
                            <p className="text-sm text-muted-foreground mt-1" data-testid={`text-gift-description-${gift.id}`}>
                              {gift.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge 
                              variant={gift.availableQuantity > 0 ? "default" : "secondary"}
                              data-testid={`badge-available-${gift.id}`}
                            >
                              {gift.availableQuantity > 0 
                                ? `${gift.availableQuantity} disponibles`
                                : "Agotado"
                              }
                            </Badge>
                            {gift.reservedQuantity > 0 && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                {gift.reservedQuantity} reservado{gift.reservedQuantity > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {gift.price && (
                              <span className="text-xs text-muted-foreground" data-testid={`text-gift-price-${gift.id}`}>
                                {gift.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteGift(gift.id)}
                            data-testid={`button-delete-gift-${gift.id}`}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reservations Detail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-users text-primary mr-2"></i>
                Detalles de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-muted-foreground font-medium">Regalo</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Reservado por</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Cantidad</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gifts?.flatMap(gift => 
                        gift.reservations.map(reservation => (
                          <tr 
                            key={reservation.id} 
                            className="border-b border-border hover:bg-muted/30"
                            data-testid={`row-reservation-${reservation.id}`}
                          >
                            <td className="py-3 text-foreground" data-testid={`text-reservation-gift-${reservation.id}`}>
                              {gift.name}
                            </td>
                            <td className="py-3 text-foreground" data-testid={`text-reservation-name-${reservation.id}`}>
                              {reservation.reservedBy}
                            </td>
                            <td className="py-3 text-foreground" data-testid={`text-reservation-quantity-${reservation.id}`}>
                              {reservation.quantity}
                            </td>
                            <td className="py-3 text-muted-foreground" data-testid={`text-reservation-date-${reservation.id}`}>
                              {new Date(reservation.createdAt || '').toLocaleDateString('es-ES')}
                            </td>
                          </tr>
                        ))
                      ) || (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground">
                            No hay reservas aún.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
