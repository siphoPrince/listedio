import { useEffect, useState } from 'react';
import {
  User,
  Star,
  Package,
  Gavel,
  ShoppingBag,
  TrendingUp,
  Shield,
  Calendar,
  Edit,
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Separator } from '@/app/components/ui/separator';
import { currentUser, mockTransactions, type Item } from '@/app/data/mockData';
import { useAuth } from '@/app/hooks/useAuth';
import { listenUserListings, type Listing } from '@/app/api/listings';

interface UserDashboardProps {
  onItemClick: (item: Item) => void;
}

export function UserDashboard({ onItemClick }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth()
  const [userListings, setUserListings] = useState<Listing[]>([])

  useEffect(() => {
    if (!user) return
    const unsub = listenUserListings(user.uid, (items) => setUserListings(items))
    return () => unsub()
  }, [user])
  
  // Mock user's bids derived from user's listings (placeholder data)
  const userBids = userListings.slice(0, 3).map((it, idx) => ({
    item: it as unknown as Item,
    bidAmount: 100 * (idx + 3),
    status: idx === 2 ? 'outbid' : 'leading',
  }))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full border-4 border-primary"
              />
              <div>
                <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
                <p className="text-muted-foreground mb-2">{currentUser.email}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-semibold">{currentUser.rating}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Member since {formatDate(currentUser.memberSince)}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="rounded-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                <p className="text-2xl font-bold">{currentUser.totalSales}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Purchases</p>
                <p className="text-2xl font-bold">{currentUser.totalPurchases}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
                <p className="text-2xl font-bold">{userListings.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Bids</p>
                <p className="text-2xl font-bold">{userBids.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Gavel className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">You placed a bid</p>
                      <p className="text-xs text-muted-foreground">
                        ${userBids[0].bidAmount} on {userBids[0].item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">New listing created</p>
                      <p className="text-xs text-muted-foreground">
                        Listed "Desk Lamp" for $65
                      </p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Transaction completed</p>
                      <p className="text-xs text-muted-foreground">
                        Purchased "Laptop Stand" for $45
                      </p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full justify-start rounded-full" variant="outline">
                    <Package className="w-4 h-4 mr-3" />
                    Create New Listing
                  </Button>
                  <Button className="w-full justify-start rounded-full" variant="outline">
                    <Gavel className="w-4 h-4 mr-3" />
                    Browse Active Auctions
                  </Button>
                  <Button className="w-full justify-start rounded-full" variant="outline">
                    <Shield className="w-4 h-4 mr-3" />
                    View Escrow Balance
                  </Button>
                  <Button className="w-full justify-start rounded-full" variant="outline">
                    <User className="w-4 h-4 mr-3" />
                    Account Settings
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="listings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onItemClick(item as unknown as Item)}
                >
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-full aspect-[4/3] object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xl font-bold text-primary">
                        ${item.price ?? '—'}
                      </p>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status ?? 'active'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 rounded-full">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-full">
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="bids">
            <div className="space-y-4">
              {userBids.map((bid, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onItemClick(bid.item)}
                >
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <img
                      src={bid.item.image}
                      alt={bid.item.title}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{bid.item.title}</h3>
                        <Badge
                          variant={bid.status === 'leading' ? 'default' : 'secondary'}
                          className={
                            bid.status === 'leading'
                              ? 'bg-green-600'
                              : 'bg-orange-500'
                          }
                        >
                          {bid.status === 'leading' ? 'Leading' : 'Outbid'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Your Bid</p>
                          <p className="font-bold text-primary">R{bid.bidAmount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Highest</p>
                          <p className="font-bold">
                            ${bid.item.currentBid || bid.bidAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Starting Price</p>
                          <p className="font-bold">R{bid.item.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Bids</p>
                          <p className="font-bold">{bid.item.bids.length}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          className="rounded-full"
                          disabled={bid.status === 'leading'}
                        >
                          {bid.status === 'leading' ? 'Winning Bid' : 'Place Higher Bid'}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <img
                      src={transaction.item.image}
                      alt={transaction.item.title}
                      className="w-full md:w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold mb-1">
                            {transaction.item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {transaction.type === 'purchase' ? 'Purchased' : 'Sold'} on{' '}
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            transaction.status === 'completed'
                              ? 'default'
                              : transaction.status === 'escrow'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={
                            transaction.status === 'completed'
                              ? 'bg-green-600'
                              : transaction.status === 'escrow'
                              ? 'bg-blue-600'
                              : ''
                          }
                        >
                          {transaction.status === 'escrow' && (
                            <Shield className="w-3 h-3 mr-1" />
                          )}
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="text-xl font-bold text-primary">
                            R{transaction.amount}
                          </p>
                        </div>
                        {transaction.status === 'escrow' && (
                          <Button size="sm" className="rounded-full">
                            Confirm Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
