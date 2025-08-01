import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Eye, 
  AlertCircle,
  Calendar,
  CreditCard
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      emoji: string;
    };
  }>;
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.getMyOrders();
      if (response.success) {
        setOrders(response.orders);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "confirmed":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-600" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canCancelOrder = (createdAt: string, status: string) => {
    if (status === "cancelled" || status === "delivered") return false;
    
    const orderTime = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - orderTime.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff <= 5;
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancelingOrderId(orderId);
    
    try {
      const response = await api.cancelOrder(orderId);
      
      if (response.success) {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        });
        
        // Update the order status in the local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to cancel order",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while cancelling the order",
        variant: "destructive",
      });
    } finally {
      setCancelingOrderId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading your orders...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            My Orders
          </h1>
          <p className="text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-serif font-bold mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(order.status)} border`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        Rs {order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ordered:</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize">{order.paymentStatus}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Items Preview */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Order Items:</div>
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3 bg-muted/30 rounded-lg p-3"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.image || item.product.emoji}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × Rs {item.price.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-2">
                          <span className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    
                    {canCancelOrder(order.createdAt, order.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelingOrderId === order.id}
                      >
                        {cancelingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                      </Button>
                    )}
                    
                    {!canCancelOrder(order.createdAt, order.status) && 
                     order.status !== "cancelled" && 
                     order.status !== "delivered" && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Cannot cancel (5+ hours passed)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyOrders;
