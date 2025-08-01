import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Truck, CreditCard, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const Checkout = () => {
  const { state: cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const subtotal = cart.total;
  const shipping = subtotal > 15000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (cart.items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!phone.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "cash_on_delivery",
        notes: notes.trim() || null,
      };

      console.log('Sending order data:', orderData);
      console.log('Shipping address details:', shippingAddress);
      console.log('Phone:', phone);
      console.log('Cart items:', cart.items);
      console.log('User token:', localStorage.getItem('yalacarves_token'));
      console.log('User object:', user);
      console.log('Is authenticated:', isAuthenticated);

      const response = await api.createOrder(orderData);
      console.log('Order response:', response);

      if (response.success) {
        clearCart();
        toast({
          title: "Order Placed Successfully!",
          description: `Order #${response.order.orderNumber} has been placed.`,
        });
        navigate("/order-success", {
          state: {
            orderNumber: response.order.orderNumber,
            orderId: response.order.id
          }
        });
      } else {
        console.error('Order failed:', response);
        toast({
          title: "Error",
          description: response.error || "Failed to place order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-serif font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link to="/products">
            <Button size="lg">Shop Now</Button>
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
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order
            </p>
          </div>
          <Link to="/cart">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="streetAddress">Street Address *</Label>
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={shippingAddress.streetAddress}
                        onChange={handleInputChange}
                        placeholder="Enter your street address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        placeholder="Enter your state"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        placeholder="Enter postal code"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value="cod" className="space-y-3">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="font-medium">Cash on Delivery (COD)</div>
                        <div className="text-sm text-muted-foreground">
                          Pay when your order is delivered
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for your order..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart.items.length} items)</span>
                      <span>Rs {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `Rs ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>Rs {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-blue-800 text-sm">
                        <Truck className="w-4 h-4" />
                        <span>
                          Add Rs {(15000 - subtotal).toLocaleString()} more for FREE shipping!
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
