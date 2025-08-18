import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-secondary border-gray-800 text-white max-w-sm w-full mx-4">
        <div className="text-center space-y-4 p-2">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-500" data-testid="success-icon" />
          </div>
          <h3 className="text-xl font-bold" data-testid="success-title">
            Order Confirmed!
          </h3>
          <p className="text-text-muted" data-testid="success-message">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold py-3 rounded-xl"
            data-testid="continue-shopping-button"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
