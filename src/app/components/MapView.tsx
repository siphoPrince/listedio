import { useState } from 'react';
import { MapPin, Navigation, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Slider } from '@/app/components/ui/slider';
import type { Item } from '@/app/data/mockData';

interface MapViewProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

export function MapView({ items, onItemClick }: MapViewProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [radiusFilter, setRadiusFilter] = useState([10]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter items by distance
  const filteredItems = items.filter((item) => item.location.distance <= radiusFilter[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nearby Items</h1>
            <p className="text-muted-foreground">
              Discover items and sellers within {radiusFilter[0]}km of your location
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-semibold">Search Radius</label>
                  <span className="text-primary font-bold">{radiusFilter[0]}km</span>
                </div>
                <Slider
                  value={radiusFilter}
                  onValueChange={setRadiusFilter}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1km</span>
                  <span>10km</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <Card className="lg:sticky lg:top-24 h-[600px] overflow-hidden">
            <div className="relative w-full h-full bg-gray-100">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50">
                {/* Center Pin (User Location) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative">
                    <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-400/20 rounded-full animate-ping" />
                  </div>
                  <p className="text-xs font-semibold text-center mt-2 bg-white px-2 py-1 rounded shadow">
                    You
                  </p>
                </div>

                {/* Item Pins */}
                {filteredItems.map((item, index) => {
                  const angle = (index * (360 / filteredItems.length)) * (Math.PI / 180);
                  const distance = (item.location.distance / radiusFilter[0]) * 200;
                  const x = 50 + Math.cos(angle) * (distance / 6);
                  const y = 50 + Math.sin(angle) * (distance / 6);

                  return (
                    <div
                      key={item.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative">
                        <MapPin
                          className={`w-8 h-8 ${
                            selectedItem?.id === item.id
                              ? 'text-primary fill-primary'
                              : 'text-red-500 fill-red-500'
                          } drop-shadow-lg group-hover:scale-110 transition-transform`}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-semibold">
                          R{item.currentBid || item.price}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Radius Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="border-2 border-primary/30 rounded-full"
                    style={{
                      width: `${(radiusFilter[0] / 10) * 400}px`,
                      height: `${(radiusFilter[0] / 10) * 400}px`,
                    }}
                  />
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2 z-30">
                <Button size="icon" variant="secondary" className="shadow-lg">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>

              {/* Distance Legend */}
              <Card className="absolute bottom-4 left-4 p-3 z-30">
                <p className="text-xs font-semibold mb-2">Distance</p>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span>Your Location</span>
                </div>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <MapPin className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>Items</span>
                </div>
              </Card>
            </div>
          </Card>

          {/* Items List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {filteredItems.length} items found
              </h2>
            </div>

            {filteredItems.length > 0 ? (
              filteredItems
                .sort((a, b) => a.location.distance - b.location.distance)
                .map((item) => (
                  <Card
                    key={item.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedItem?.id === item.id
                        ? 'ring-2 ring-primary shadow-lg'
                        : ''
                    }`}
                    onClick={() => onItemClick(item)}
                    onMouseEnter={() => setSelectedItem(item)}
                  >
                    <div className="flex space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="font-semibold text-primary">
                                {item.location.distance}km
                              </span>
                              <span className="mx-2">•</span>
                              <span>{item.location.address}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-primary">
                              ${item.currentBid || item.price}
                            </p>
                            {item.currentBid && (
                              <Badge variant="secondary" className="text-xs">
                                {item.bids.length} bids
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemClick(item);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            ) : (
              <Card className="p-8 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No items found within {radiusFilter[0]}km.
                  <br />
                  Try increasing your search radius.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
