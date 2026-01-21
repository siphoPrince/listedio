import { useState } from 'react';
import { Shield, CreditCard, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Progress } from '@/app/components/ui/progress';
import type { Item } from '@/app/data/mockData';

interface CheckoutPageProps {
  item: Item;
  bidAmount?: number;
  onBack: () => void;
  onComplete: () => void;
}

export function CheckoutPage({ item, bidAmount, onBack, onComplete }: CheckoutPageProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'complete'>('payment');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const finalAmount = bidAmount || item.currentBid || item.price;
  const escrowFee = finalAmount * 0.03; // 3% escrow fee
  const totalAmount = finalAmount + escrowFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('complete');
    }, 2000);
  };

  const handleComplete = () => {
    onComplete();
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
          <p className="text-muted-foreground mb-6">
            Securely transferring funds to escrow...
          </p>
          <Progress value={66} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            Please do not close this window
          </p>
        </Card>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your funds are safely held in escrow
          </p>
          
          <Card className="bg-green-50 border-green-200 p-4 mb-6 text-left">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 mb-1">
                  Escrow Protection Active
                </p>
                <p className="text-green-800">
                  R{finalAmount.toFixed(2)} is now held securely in escrow. The seller will be
                  notified and funds will be released once you confirm receipt.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-2 text-sm text-left mb-6">
            <h3 className="font-semibold">Next Steps:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>1. Coordinate with the seller for pickup/delivery</li>
              <li>2. Inspect the item thoroughly</li>
              <li>3. Confirm receipt in your dashboard</li>
              <li>4. Funds will be released to the seller</li>
            </ul>
          </div>

          <Button onClick={handleComplete} className="w-full rounded-full">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Secure Checkout</h2>
              </div>

              {/* Escrow Notice */}
              <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-1">
                      Protected by Escrow
                    </p>
                    <p className="text-blue-800">
                      Your payment will be held securely in escrow until you confirm receipt
                      and satisfaction with the item. Seller only receives payment after your
                      approval.
                    </p>
                  </div>
                </div>
              </Card>

              <form onSubmit={handlePayment} className="space-y-6">
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full rounded-full" size="lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Pay R{totalAmount.toFixed(2)} via Escrow
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By completing this purchase, you agree to our Terms of Service and Escrow
                  Agreement
                </p>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Order Summary</h3>

              {/* Item */}
              <div className="flex space-x-3 mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sold by {item.seller.name}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Pricing */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {bidAmount ? 'Your Bid' : 'Item Price'}
                  </span>
                  <span className="font-semibold">R{finalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escrow Fee (3%)</span>
                  <span className="font-semibold">R{escrowFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">
                    R{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Escrow Timeline */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Escrow Timeline</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">1.</span>
                    Payment held in escrow
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">2.</span>
                    Seller notified to arrange delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">3.</span>
                    You inspect and confirm receipt
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">4.</span>
                    Funds released to seller
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
