import { MapPin, Gavel, Star } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import type { Item } from '@/app/data/mockData';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const hasBids = item.currentBid && item.currentBid > item.price;

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.video && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            Video
          </div>
        )}
        {hasBids && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent">
              <Gavel className="w-3 h-3 mr-1" />
              Bidding
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{item.location.distance}km away</span>
          </div>
        </div>

        {/* Price */}
        <div>
          {hasBids ? (
            <div>
              <p className="text-sm text-muted-foreground line-through">R{item.price}</p>
              <p className="text-xl font-bold text-primary">
                R{item.currentBid}
              </p>
              <p className="text-xs text-muted-foreground">Current Bid</p>
            </div>
          ) : (
            <p className="text-xl font-bold text-primary">R{item.price}</p>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <img
              src={item.seller.avatar}
              alt={item.seller.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm">{item.seller.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span>{item.seller.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button className="w-full rounded-full" onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}>
          {hasBids ? 'Place Bid' : 'View Details'}
        </Button>
      </div>
    </Card>
  );
}
