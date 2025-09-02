import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertGift } from "@shared/schema";

export function AddGiftForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  const addGiftMutation = useMutation({
    mutationFn: async (data: InsertGift) => {
      const response = await apiRequest("POST", "/api/gifts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gifts"] });
      setName("");
      setDescription("");
      setQuantity("1");
      setPrice("");
      toast({
        title: "Regalo agregado",
        description: "El regalo ha sido agregado exitosamente a la lista.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el regalo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre del regalo.",
        variant: "destructive",
      });
      return;
    }

    const quantityNum = parseInt(quantity);
    if (quantityNum < 1) {
      toast({
        title: "Error",
        description: "La cantidad debe ser al menos 1.",
        variant: "destructive",
      });
      return;
    }

    addGiftMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      quantity: quantityNum,
      price: price.trim() || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <i className="fas fa-plus-circle text-primary mr-2"></i>
          Agregar Regalo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="giftName" className="text-sm font-medium text-muted-foreground">
              Nombre del Regalo
            </Label>
            <Input
              id="giftName"
              type="text"
              placeholder="Ej: Auriculares Bluetooth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="input-gift-name"
            />
          </div>
          
          <div>
            <Label htmlFor="giftDescription" className="text-sm font-medium text-muted-foreground">
              Descripción
            </Label>
            <Textarea
              id="giftDescription"
              placeholder="Descripción opcional del regalo..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              data-testid="textarea-gift-description"
            />
          </div>
          
          <div>
            <Label htmlFor="giftQuantity" className="text-sm font-medium text-muted-foreground">
              Cantidad Disponible
            </Label>
            <Input
              id="giftQuantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              data-testid="input-gift-quantity"
            />
          </div>
          
          <div>
            <Label htmlFor="giftPrice" className="text-sm font-medium text-muted-foreground">
              Precio Estimado (Opcional)
            </Label>
            <Input
              id="giftPrice"
              type="text"
              placeholder="$50.000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              data-testid="input-gift-price"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={addGiftMutation.isPending}
            data-testid="button-add-gift"
          >
            {addGiftMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Agregando...
              </>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i>
                Agregar Regalo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
