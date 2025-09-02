import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GiftWithReservations } from "@shared/schema";

interface GiftCardProps {
  gift: GiftWithReservations;
  onReserve: () => void;
}

const getGiftIcon = (giftName: string) => {
  const name = giftName.toLowerCase();
  if (name.includes("auricular") || name.includes("headphone")) return "fas fa-headphones";
  if (name.includes("libro") || name.includes("book")) return "fas fa-book";
  if (name.includes("planta") || name.includes("plant")) return "fas fa-seedling";
  if (name.includes("nintendo") || name.includes("game")) return "fas fa-gamepad";
  if (name.includes("cafetera") || name.includes("coffee")) return "fas fa-coffee";
  if (name.includes("sudadera") || name.includes("shirt")) return "fas fa-tshirt";
  return "fas fa-gift";
};

const getGradientClasses = (giftName: string) => {
  const name = giftName.toLowerCase();
  if (name.includes("auricular")) return "from-pink-100 to-purple-100";
  if (name.includes("libro")) return "from-orange-100 to-red-100";
  if (name.includes("planta")) return "from-green-100 to-teal-100";
  if (name.includes("nintendo")) return "from-blue-100 to-indigo-100";
  if (name.includes("cafetera")) return "from-yellow-100 to-orange-100";
  if (name.includes("sudadera")) return "from-purple-100 to-pink-100";
  return "from-gray-100 to-gray-200";
};

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  const isAvailable = gift.availableQuantity > 0;
  const isFullyReserved = gift.availableQuantity === 0 && gift.reservedQuantity > 0;

  return (
    <Card className="gift-card overflow-hidden hover:shadow-lg transition-all relative" data-testid={`card-public-gift-${gift.id}`}>
      {/* Colorful gift illustration */}
      <div className={`h-48 bg-gradient-to-br ${getGradientClasses(gift.name)} flex items-center justify-center`}>
        <i className={`${getGiftIcon(gift.name)} text-6xl opacity-50`}></i>
      </div>

      {/* Reserved overlay for fully reserved gifts */}
      {isFullyReserved && (
        <div className="reserved-overlay absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg text-center">
            <i className="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
            <p className="font-semibold text-gray-800">Reservado por</p>
            <p className="text-sm text-gray-600">
              {gift.reservations.map(r => r.reservedBy.split(' ').slice(0, 2).join(' ')).join(', ')}
            </p>
          </div>
        </div>
      )}

      <CardContent className={`p-6 ${isFullyReserved ? 'opacity-75' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-card-foreground" data-testid={`text-public-gift-name-${gift.id}`}>
            {gift.name}
          </h3>
          <Badge 
            variant={isAvailable ? "default" : "secondary"}
            className={isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            data-testid={`badge-public-availability-${gift.id}`}
          >
            {isAvailable ? `${gift.availableQuantity} disponibles` : "Agotado"}
          </Badge>
        </div>
        
        {gift.description && (
          <p className="text-muted-foreground text-sm mb-4" data-testid={`text-public-gift-description-${gift.id}`}>
            {gift.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          {gift.price && (
            <span className="text-lg font-bold text-primary" data-testid={`text-public-gift-price-${gift.id}`}>
              {gift.price}
            </span>
          )}
          <span className="text-sm text-muted-foreground" data-testid={`text-public-gift-quantity-${gift.id}`}>
            Cantidad: {gift.quantity}
          </span>
        </div>
        
        <Button
          className="w-full"
          disabled={!isAvailable}
          onClick={onReserve}
          data-testid={`button-reserve-gift-${gift.id}`}
        >
          {isAvailable ? (
            <>
              <i className="fas fa-heart mr-2"></i>Reservar Regalo
            </>
          ) : (
            <>
              <i className="fas fa-ban mr-2"></i>No Disponible
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
