import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProduct(id: string): Promise<Product | undefined>;
  getActiveProduct(): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderWebhookStatus(id: string, sent: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    
    // Initialize with the luxury black t-shirt
    this.initializeProduct();
  }

  private initializeProduct() {
    const productId = randomUUID();
    const product: Product = {
      id: productId,
      name: "Luxury Cropped Black T-Shirt",
      description: "Minimal. Premium cotton. Built for grind.",
      price: "300.00",
      originalPrice: "350.00",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
      thumbnailUrls: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
      ],
      isActive: true,
      createdAt: new Date(),
    };
    this.products.set(productId, product);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getActiveProduct(): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.isActive === true,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      originalPrice: insertProduct.originalPrice || null,
      thumbnailUrls: insertProduct.thumbnailUrls || null,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      status: "pending",
      webhookSent: false,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderWebhookStatus(id: string, sent: boolean): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.webhookSent = sent;
      this.orders.set(id, order);
    }
  }
}

export const storage = new MemStorage();
