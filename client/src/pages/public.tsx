import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GiftCard } from "@/components/gift-card";
import { ReservationModal } from "@/components/reservation-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { GiftWithReservations } from "@shared/schema";

export function PublicView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "reserved">("all");
  const [selectedGift, setSelectedGift] = useState<GiftWithReservations | null>(null);

  const { data: gifts, isLoading } = useQuery<GiftWithReservations[]>({
    queryKey: ["/api/gifts"],
  });

  const filteredGifts = gifts?.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "available" && gift.availableQuantity > 0) ||
                         (filter === "reserved" && gift.reservedQuantity > 0);
    
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <i className="fas fa-gift text-primary mr-3"></i>Mi Lista de Regalos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¡Hola! Estos son algunos regalos que me encantaría recibir. Si decides reservar alguno, solo ingresa tu nombre y la cantidad que quieres regalar.
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                  <Input
                    type="text"
                    placeholder="Buscar regalos..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="input-search-gifts"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  data-testid="button-filter-all"
                >
                  Todos
                </Button>
                <Button
                  variant={filter === "available" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("available")}
                  data-testid="button-filter-available"
                >
                  Disponibles
                </Button>
                <Button
                  variant={filter === "reserved" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("reserved")}
                  data-testid="button-filter-reserved"
                >
                  Reservados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gift Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredGifts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "No se encontraron regalos que coincidan con tu búsqueda." : "No hay regalos disponibles aún."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onReserve={() => setSelectedGift(gift)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedGift && (
        <ReservationModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
    </>
  );
}
