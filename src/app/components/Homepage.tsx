import { useState } from 'react';
import { ItemCard } from '@/app/components/ItemCard';
import { Button } from '@/app/components/ui/button';
import { categories, type Item } from '@/app/data/mockData';

interface HomepageProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  searchQuery: string;
}

export function Homepage({ items, onItemClick, searchQuery }: HomepageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesCategory =
      selectedCategory === 'All' || item.tags.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Discover Amazing Deals Near You
          </h1>
          <p className="text-lg text-muted-foreground">
            Buy and sell with confidence using our secure escrow system
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No items found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
