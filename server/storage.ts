import { type Gift, type InsertGift, type Reservation, type InsertReservation, type GiftWithReservations } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Gift methods
  getGifts(): Promise<Gift[]>;
  getGift(id: string): Promise<Gift | undefined>;
  createGift(gift: InsertGift): Promise<Gift>;
  updateGift(id: string, gift: Partial<InsertGift>): Promise<Gift | undefined>;
  deleteGift(id: string): Promise<boolean>;
  
  // Reservation methods
  getReservations(): Promise<Reservation[]>;
  getReservationsByGiftId(giftId: string): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  
  // Combined methods
  getGiftsWithReservations(): Promise<GiftWithReservations[]>;
}

export class MemStorage implements IStorage {
  private gifts: Map<string, Gift>;
  private reservations: Map<string, Reservation>;

  constructor() {
    this.gifts = new Map();
    this.reservations = new Map();
  }

  async getGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values());
  }

  async getGift(id: string): Promise<Gift | undefined> {
    return this.gifts.get(id);
  }

  async createGift(insertGift: InsertGift): Promise<Gift> {
    const id = randomUUID();
    const gift: Gift = { 
      ...insertGift, 
      id, 
      createdAt: new Date() 
    };
    this.gifts.set(id, gift);
    return gift;
  }

  async updateGift(id: string, updateData: Partial<InsertGift>): Promise<Gift | undefined> {
    const gift = this.gifts.get(id);
    if (!gift) return undefined;
    
    const updatedGift: Gift = { ...gift, ...updateData };
    this.gifts.set(id, updatedGift);
    return updatedGift;
  }

  async deleteGift(id: string): Promise<boolean> {
    // Also delete all reservations for this gift
    const reservationsToDelete = Array.from(this.reservations.values())
      .filter(reservation => reservation.giftId === id);
    
    reservationsToDelete.forEach(reservation => {
      this.reservations.delete(reservation.id);
    });

    return this.gifts.delete(id);
  }

  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservationsByGiftId(giftId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values())
      .filter(reservation => reservation.giftId === giftId);
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const reservation: Reservation = { 
      ...insertReservation, 
      id, 
      createdAt: new Date() 
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async getGiftsWithReservations(): Promise<GiftWithReservations[]> {
    const gifts = await this.getGifts();
    const allReservations = await this.getReservations();

    return gifts.map(gift => {
      const giftReservations = allReservations.filter(r => r.giftId === gift.id);
      const reservedQuantity = giftReservations.reduce((sum, r) => sum + r.quantity, 0);
      const availableQuantity = Math.max(0, gift.quantity - reservedQuantity);

      return {
        ...gift,
        reservations: giftReservations,
        reservedQuantity,
        availableQuantity,
      };
    });
  }
}

export const storage = new MemStorage();
