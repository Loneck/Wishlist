import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGiftSchema, insertReservationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Gift routes
  app.get("/api/gifts", async (req, res) => {
    try {
      const gifts = await storage.getGiftsWithReservations();
      res.json(gifts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gifts" });
    }
  });

  app.post("/api/gifts", async (req, res) => {
    try {
      const result = insertGiftSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).toString() 
        });
      }

      const gift = await storage.createGift(result.data);
      res.status(201).json(gift);
    } catch (error) {
      res.status(500).json({ message: "Failed to create gift" });
    }
  });

  app.put("/api/gifts/:id", async (req, res) => {
    try {
      const result = insertGiftSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).toString() 
        });
      }

      const gift = await storage.updateGift(req.params.id, result.data);
      if (!gift) {
        return res.status(404).json({ message: "Gift not found" });
      }

      res.json(gift);
    } catch (error) {
      res.status(500).json({ message: "Failed to update gift" });
    }
  });

  app.delete("/api/gifts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGift(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Gift not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gift" });
    }
  });

  // Reservation routes
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const result = insertReservationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).toString() 
        });
      }

      // Check if gift exists and has enough quantity available
      const gift = await storage.getGift(result.data.giftId);
      if (!gift) {
        return res.status(404).json({ message: "Gift not found" });
      }

      const existingReservations = await storage.getReservationsByGiftId(result.data.giftId);
      const reservedQuantity = existingReservations.reduce((sum, r) => sum + r.quantity, 0);
      const availableQuantity = gift.quantity - reservedQuantity;

      if (result.data.quantity > availableQuantity) {
        return res.status(400).json({ 
          message: `Only ${availableQuantity} units available for reservation` 
        });
      }

      const reservation = await storage.createReservation(result.data);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
