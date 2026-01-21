import { useState } from 'react';
import {
  MapPin,
  Star,
  Shield,
  Clock,
  Gavel,
  ArrowLeft,
  TrendingUp,
  Video,
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import type { Item } from '@/app/data/mockData';

interface ItemDetailProps {
  item: Item;
  onBack: () => void;
  onCheckout: (item: Item, bidAmount?: number) => void;
}

export function ItemDetail({ item, onBack, onCheckout }: ItemDetailProps) {
  const [bidAmount, setBidAmount] = useState(
    item.currentBid ? item.currentBid + 10 : item.price + 10
  );
  const minBid = item.currentBid ? item.currentBid + 5 : item.price + 5;

  const handlePlaceBid = () => {
    if (bidAmount >= minBid) {
      onCheckout(item, bidAmount);
    } else {
      alert(`Minimum bid is $${minBid}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.video && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Video Available</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Seller Info Card */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Seller Information</h3>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.seller.avatar}
                    alt={item.seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{item.seller.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{item.seller.rating} Rating</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Contact</Button>
              </div>
              <Separator className="my-4" />
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">{item.location.address}</p>
                  <p className="text-muted-foreground">{item.location.distance}km away</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                {item.currentBid && (
                  <Badge className="bg-accent">
                    <Gavel className="w-3 h-3 mr-1" />
                    Active Bidding
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price & Bidding */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                  <p className="text-2xl font-bold">R{item.price}</p>
                </div>

                {item.currentBid && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold">Current Highest Bid</p>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-primary">R{item.currentBid}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.bids.length} bid{item.bids.length !== 1 ? 's' : ''} placed
                      </p>
                    </div>
                  </>
                )}

                {/* Place Bid */}
                <div className="space-y-3 pt-4">
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={minBid}
                      step="5"
                      className="flex-1"
                    />
                    <Button onClick={handlePlaceBid} className="rounded-full px-8">
                      <Gavel className="w-4 h-4 mr-2" />
                      Place Bid
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum bid: R{minBid}
                  </p>
                </div>

                {/* Buy Now Option */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onCheckout(item)}
                  >
                    Buy Now at Current Price
                  </Button>
                </div>
              </div>
            </Card>

            {/* Escrow Protection */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Protected by Escrow
                  </h3>
                  <p className="text-sm text-green-800">
                    Your payment is held securely until you confirm receipt and satisfaction
                    with the item. Both buyers and sellers are protected.
                  </p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>

            {/* Bid History */}
            {item.bids.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Bid History</h3>
                <div className="space-y-4">
                  {item.bids.map((bid, index) => (
                    <div key={bid.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={bid.bidder.avatar}
                          alt={bid.bidder.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-sm">{bid.bidder.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(bid.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${bid.amount}</p>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Highest
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
