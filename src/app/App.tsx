import { useState } from 'react';
import { Header } from '@/app/components/Header';
import { Homepage } from '@/app/components/Homepage';
import { ItemUpload } from '@/app/components/ItemUpload';
import { ItemDetail } from '@/app/components/ItemDetail';
import { CheckoutPage } from '@/app/components/CheckoutPage';
import { MapView } from '@/app/components/MapView';
import { UserDashboard } from '@/app/components/UserDashboard';
import { mockItems, type Item } from '@/app/data/mockData';

type View = 'home' | 'upload' | 'detail' | 'checkout' | 'map' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [checkoutBidAmount, setCheckoutBidAmount] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setCurrentView('detail');
  };

  const handleCheckout = (item: Item, bidAmount?: number) => {
    setSelectedItem(item);
    setCheckoutBidAmount(bidAmount);
    setCurrentView('checkout');
  };

  const handleUploadSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleCheckoutComplete = () => {
    setCurrentView('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedItem(null);
    setCheckoutBidAmount(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {currentView === 'home' && (
        <Homepage
          items={mockItems}
          onItemClick={handleItemClick}
          searchQuery={searchQuery}
        />
      )}

      {currentView === 'upload' && <ItemUpload onSuccess={handleUploadSuccess} />}

      {currentView === 'detail' && selectedItem && (
        <ItemDetail
          item={selectedItem}
          onBack={handleBackToHome}
          onCheckout={handleCheckout}
        />
      )}

      {currentView === 'checkout' && selectedItem && (
        <CheckoutPage
          item={selectedItem}
          bidAmount={checkoutBidAmount}
          onBack={() => setCurrentView('detail')}
          onComplete={handleCheckoutComplete}
        />
      )}

      {currentView === 'map' && (
        <MapView items={mockItems} onItemClick={handleItemClick} />
      )}

      {currentView === 'dashboard' && (
        <UserDashboard onItemClick={handleItemClick} />
      )}
    </div>
  );
}
