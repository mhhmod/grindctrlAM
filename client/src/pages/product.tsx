import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Bolt, Truck, Shield, Leaf, Plus, Minus, Sparkles, Heart } from "lucide-react";
import { OrderModal } from "@/components/order-modal";
import { SuccessModal } from "@/components/success-modal";
import { useToast } from "@/hooks/use-toast";
import type { Product, InsertOrder } from "@shared/schema";

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();

  // Fetch product data
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/product"],
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      setShowOrderModal(false);
      setShowSuccessModal(true);
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error) => {
      console.error("Order creation failed:", error);
      toast({
        title: "Order Failed",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateQuantity = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + change));
    setQuantity(newQuantity);
  };

  const handleOrderSubmit = (customerData: any) => {
    if (!product) return;

    const orderData: InsertOrder = {
      productId: product.id,
      customerName: customerData.fullName,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      customerAddress: customerData.address,
      size: selectedSize,
      quantity,
      unitPrice: product.price,
      totalAmount: (parseFloat(product.price) * quantity).toFixed(2),
    };

    createOrderMutation.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-pink"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
          <p className="text-text-muted">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const savings = product.originalPrice 
    ? ((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice) * 100).toFixed(0)
    : null;

  const allImages = [product.imageUrl, ...(product.thumbnailUrls || [])];



  return (
    <div className="min-h-screen bg-dark-primary text-primary">
      {/* Header */}
      <header className="border-b border-primary/10 bg-dark-primary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-accent-pink rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <h1 className="text-lg font-bold text-primary" data-testid="brand-logo">
                GrindCTRL
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-secondary text-sm" data-testid="nav-home">Home</a>
              <div className="flex items-center space-x-1">
                <span className="text-secondary text-sm">Cart</span>
                <div className="w-5 h-5 bg-accent-pink rounded-full flex items-center justify-center" data-testid="cart-button">
                  <span className="text-white text-xs font-medium">0</span>
                </div>
              </div>
              <a href="#" className="text-secondary text-sm" data-testid="checkout">Checkout</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto lg:max-w-4xl lg:grid lg:grid-cols-2 lg:gap-8">
          
          {/* Left Side - Product Info (mobile: below image, desktop: left) */}
          <div className="space-y-4 order-2 lg:order-1">
            <Badge className="bg-accent-pink/20 text-accent-pink px-2 py-1 text-xs rounded" data-testid="new-drop-badge">
              New Drop
            </Badge>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 leading-tight" data-testid="product-title">
                {product.name}
              </h1>
              <p className="text-secondary text-sm mb-4" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                {product.originalPrice && (
                  <span className="text-lg text-muted line-through" data-testid="original-price">
                    {product.originalPrice} EGP
                  </span>
                )}
                <span className="text-2xl font-bold text-primary" data-testid="sale-price">
                  {product.price} EGP
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button 
                className="w-full bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold py-3 rounded-lg"
                onClick={() => setShowOrderModal(true)}
                data-testid="buy-now-button"
              >
                Buy Now
              </Button>
              <Button 
                variant="outline"
                className="w-full border-primary/20 text-secondary hover:text-accent-pink font-semibold py-3 rounded-lg"
                data-testid="add-to-cart-button"
              >
                Add to Cart
              </Button>
            </div>

            {/* Simple Feature */}
            <div className="text-secondary text-sm">
              • Fast checkout, Cart support
            </div>
            <div className="text-secondary text-sm">
              Free returns within 14 days
            </div>
          </div>

          {/* Right Side - Product Image (mobile: above content, desktop: right) */}
          <div className="order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="bg-gray-200 rounded-2xl overflow-hidden aspect-square">
              <img 
                src={allImages[selectedImageIndex]} 
                alt={`${product.name}`}
                className="w-full h-full object-cover"
                data-testid="product-image-main"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-muted mt-8">
          © 2024 GrindCTRL. All rights reserved.
        </div>
      </main>

      {/* Modals */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handleOrderSubmit}
        product={product}
        selectedSize={selectedSize}
        quantity={quantity}
        isLoading={createOrderMutation.isPending}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
