// Order Details page component for comprehensive order information and tracking
// Features detailed order status, shipping information, and cancellation functionality
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle,
  Phone
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface OrderDetails {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  notes?: string;
  shippingAddress: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      emoji: string;
      slug: string;
    };
  }>;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.getOrder(id!);
      if (response.success) {
        setOrder(response.order);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        });
        navigate("/my-orders");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching order details",
        variant: "destructive",
      });
      navigate("/my-orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "confirmed":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
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

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCanceling(true);
    
    try {
      const response = await api.cancelOrder(order.id);
      
      if (response.success) {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        });
        
        setOrder(prev => prev ? { ...prev, status: "cancelled" } : null);
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
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading order details...</div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/my-orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link to="/my-orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(order.status)} border text-base px-3 py-1`}
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status Timeline */}
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-3 ${
                      ["pending", "confirmed", "shipped", "delivered"].includes(order.status) 
                        ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>Order Placed</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className={`flex items-center space-x-3 ${
                      ["confirmed", "shipped", "delivered"].includes(order.status) 
                        ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      <Package className="w-4 h-4" />
                      <span>Order Confirmed</span>
                    </div>
                    
                    <div className={`flex items-center space-x-3 ${
                      ["shipped", "delivered"].includes(order.status) 
                        ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      <Truck className="w-4 h-4" />
                      <span>Order Shipped</span>
                    </div>
                    
                    <div className={`flex items-center space-x-3 ${
                      order.status === "delivered" 
                        ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                      <span>Order Delivered</span>
                    </div>
                  </div>

                  {canCancelOrder(order.createdAt, order.status) && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        onClick={handleCancelOrder}
                        disabled={canceling}
                      >
                        {canceling ? "Cancelling..." : "Cancel Order"}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        You can cancel this order within 5 hours of placement
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {item.product.emoji}
                        </div>
                        <div className="flex-1">
                          <Link 
                            to={`/product/${item.product.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Rs {item.price.toLocaleString()} each
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>{order.shippingAddress.streetAddress}</div>
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </div>
                  <div>{order.shippingAddress.country}</div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Order Number</span>
                    <span className="font-medium">#{order.orderNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-bold text-lg">
                      Rs {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span>Payment Method</span>
                    </div>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Payment Status</span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
