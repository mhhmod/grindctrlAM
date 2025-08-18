import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: any) => void;
  product: Product;
  selectedSize: string;
  quantity: number;
  isLoading: boolean;
}

export function OrderModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product, 
  selectedSize, 
  quantity, 
  isLoading 
}: OrderModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
    });
    setErrors({});
    onClose();
  };

  const totalAmount = (parseFloat(product.price) * quantity).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-secondary border-gray-800 text-white max-w-md w-full mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Complete Your Order</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-text-muted hover:text-white"
              data-testid="close-order-modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="order-form">
          <div>
            <Label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="bg-dark-primary border-gray-700 focus:border-accent-pink"
              placeholder="Enter your full name"
              data-testid="input-fullname"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-fullname">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-dark-primary border-gray-700 focus:border-accent-pink"
              placeholder="your@email.com"
              data-testid="input-email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-email">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-dark-primary border-gray-700 focus:border-accent-pink"
              placeholder="+20 xxx xxx xxxx"
              data-testid="input-phone"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-phone">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address" className="block text-sm font-medium mb-2">
              Delivery Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="bg-dark-primary border-gray-700 focus:border-accent-pink resize-none"
              rows={3}
              placeholder="Enter your complete delivery address"
              data-testid="input-address"
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-address">
                {errors.address}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-dark-primary rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span data-testid="summary-product">{product.name} ({selectedSize})</span>
              <span data-testid="summary-price">{product.price} EGP</span>
            </div>
            <div className="flex justify-between text-sm text-text-muted">
              <span>Quantity</span>
              <span data-testid="summary-quantity">{quantity}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-accent-pink" data-testid="summary-total">
                {totalAmount} EGP
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2"
            data-testid="confirm-order-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Order</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
