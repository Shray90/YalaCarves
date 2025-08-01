// Order Success page component for confirming successful order placement
// Features order confirmation details, next steps, and navigation to order tracking
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Truck, Eye, ArrowRight, CreditCard, Calendar } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/services/api";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    emoji: string;
    slug: string;
  };
}

interface OrderDetails {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderNumber = location.state?.orderNumber;
  const orderId = location.state?.orderId;

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no order data is available, redirect to home
    if (!orderNumber || !orderId) {
      navigate("/", { replace: true });
      return;
    }

    // Fetch order details to show products
    fetchOrderDetails();
  }, [orderNumber, orderId, navigate]);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getOrder(orderId);
      if (response.success) {
        setOrderDetails(response.order);
      } else {
        console.warn('Could not load order details:', response);
        // Don't show error toast, just continue without details
      }
    } catch (error) {
      console.warn('Could not load order details:', error);
      // Don't show error toast, just continue without details
    } finally {
      setLoading(false);
    }
  };

  if (!orderNumber || !orderId) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Details</span>
                <Badge variant="secondary" className="text-sm">
                  #{orderNumber}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Order Number</div>
                  <div className="font-medium">#{orderNumber}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="font-medium flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Order Status</div>
                  <Badge variant="outline" className="w-fit">
                    Pending
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Order Date</div>
                  <div className="font-medium flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{orderDetails ? new Date(orderDetails.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {orderDetails && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-2xl font-bold text-green-600">
                      Rs {orderDetails.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items Card */}
          {loading ? (
            <Card className="mb-6">
              <CardContent className="py-8 text-center">
                <div className="text-muted-foreground">Loading order details...</div>
              </CardContent>
            </Card>
          ) : orderDetails && orderDetails.items && orderDetails.items.length > 0 ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Your Order Items</span>
                  <Badge variant="secondary" className="text-xs">
                    {orderDetails.items.length} item{orderDetails.items.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {item.product.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Rs {item.price.toLocaleString()} each
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            Pending
                          </Badge>
                        </div>
                      </div>
                      {index < orderDetails.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}

                  <Separator />

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">Order Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      Rs {orderDetails.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Order Status Timeline */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Status & Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-green-700">✓ Order Placed</div>
                    <div className="text-sm text-muted-foreground">
                      Your order has been successfully placed and is now pending confirmation.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Next: Order Confirmation</div>
                    <div className="text-sm text-muted-foreground">
                      We'll review and confirm your order within 24 hours.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Then: Processing</div>
                    <div className="text-sm text-muted-foreground">
                      Our artisans will carefully prepare your handcrafted items.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Finally: Shipping & Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Your order will be shipped and delivered within 5-7 business days.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to={`/orders/${orderId}`} className="block">
              <Button className="w-full" size="lg">
                <Eye className="w-4 h-4 mr-2" />
                View Order Details
              </Button>
            </Link>
            
            <Link to="/my-orders" className="block">
              <Button variant="outline" className="w-full" size="lg">
                View All Orders
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link to="/products" className="block">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Important Notes */}
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="font-medium text-amber-800">Important Information:</div>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span><strong>Cancellation:</strong> You can cancel your order within 5 hours of placement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span><strong>Payment:</strong> Rs {orderDetails ? orderDetails.totalAmount.toLocaleString() : '0'} will be collected upon delivery (COD)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span><strong>Tracking:</strong> Monitor your order status in "My Orders" section</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span><strong>Updates:</strong> You'll receive notifications about status changes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span><strong>Support:</strong> Contact us if you need to make any changes</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
