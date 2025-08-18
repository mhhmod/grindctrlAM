import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve static files for downloads
  app.use('/downloads', express.static(path.join(process.cwd(), 'client/public/downloads')));
  
  // Get the active product
  app.get("/api/product", async (req, res) => {
    try {
      const product = await storage.getActiveProduct();
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new order
  app.post("/api/orders", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertOrderSchema.parse(req.body);
      
      // Create order
      const order = await storage.createOrder(validatedData);
      
      // Send webhook to n8n
      try {
        const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.WEBHOOK_URL;
        
        if (webhookUrl) {
          const webhookData = {
            orderId: order.id,
            product: {
              name: "Luxury Cropped Black T-Shirt",
              size: order.size,
              quantity: order.quantity,
              price: parseFloat(order.unitPrice),
              total: parseFloat(order.totalAmount)
            },
            customer: {
              fullName: order.customerName,
              email: order.customerEmail,
              phone: order.customerPhone,
              address: order.customerAddress
            },
            timestamp: order.createdAt?.toISOString(),
            currency: "EGP",
            source: "website"
          };

          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
          });

          if (response.ok) {
            await storage.updateOrderWebhookStatus(order.id, true);
          } else {
            console.error("Webhook failed:", response.status, response.statusText);
          }
        } else {
          console.warn("No webhook URL configured");
        }
      } catch (webhookError) {
        console.error("Error sending webhook:", webhookError);
        // Don't fail the order if webhook fails
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Download project source
  app.get("/api/download/project-source", (req, res) => {
    const filePath = path.join(process.cwd(), "project-source.tar.gz");
    
    // Set proper headers for file download
    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', 'attachment; filename="project-source.tar.gz"');
    
    res.download(filePath, "project-source.tar.gz", (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(404).json({ error: "File not found" });
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
