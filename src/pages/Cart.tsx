import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Lock,
  Truck,
  Shield,
  Tag,
  Gift,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

const Cart = () => {
  const { state, updateQuantity, removeItem, addItem } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setAppliedPromo("WELCOME10");
      setPromoCode("");
    }
  };

  const subtotal = state.total;
  const savings = state.items.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0,
  );
  const promoDiscount = appliedPromo === "WELCOME10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 15000 ? 0 : 500;
  const total = subtotal - promoDiscount + shipping;

  const inStockItems = state.items.filter((item) => item.inStock);
  const outOfStockItems = state.items.filter((item) => !item.inStock);

  // Recommended products (not in cart)
  const recommendedProducts = products
    .filter((p) => !state.items.find((item) => item.id === p.id))
    .slice(0, 2);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {state.items.length} item{state.items.length !== 1 ? "s" : ""} in
              your cart
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {state.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-serif font-bold mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products">
              <Button size="lg">Explore Our Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Available Items</span>
                      <Badge variant="secondary" className="text-xs">
                        {inStockItems.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {inStockItems.map((item, index) => (
                        <div key={item.id}>
                          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  by {item.artisan} • {item.category}
                                </p>
                              </div>

                                                             <div className="flex items-center space-x-2">
                                 <span className="font-bold text-lg">
                                   Rs {item.price.toLocaleString()}
                                 </span>
                                 {item.originalPrice > item.price && (
                                   <span className="text-sm text-muted-foreground line-through">
                                     Rs {item.originalPrice.toLocaleString()}
                                   </span>
                                 )}
                                 {item.originalPrice > item.price && (
                                   <Badge
                                     variant="destructive"
                                     className="text-xs"
                                   >
                                     Save Rs {(item.originalPrice - item.price).toLocaleString()}
                                   </Badge>
                                 )}
                               </div>

                              {/* Quantity and Remove */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="w-8 h-8"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="w-8 h-8"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                Rs {(item.price * item.quantity).toLocaleString()}
                              </div>
                              {item.originalPrice > item.price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  Rs {(item.originalPrice * item.quantity).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                          {index < inStockItems.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-destructive">
                      <span>Out of Stock</span>
                      <Badge variant="destructive" className="text-xs">
                        {outOfStockItems.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {outOfStockItems.map((item, index) => (
                        <div key={item.id} className="opacity-60">
                          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover grayscale"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  by {item.artisan} • {item.category}
                                </p>
                                <Badge
                                  variant="destructive"
                                  className="text-xs mt-1"
                                >
                                  Out of Stock
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {index < outOfStockItems.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <span>Promo Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={applyPromoCode} disabled={!promoCode}>
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Promo code "{appliedPromo}" applied! 10% off
                    </div>
                  )}
                  <div className="mt-3 text-xs text-muted-foreground">
                    Try: WELCOME10 for 10% off your first order
                  </div>
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
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({inStockItems.length} items)</span>
                      <span>Rs {subtotal.toLocaleString()}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>You Save</span>
                        <span>-Rs {savings.toLocaleString()}</span>
                      </div>
                    )}
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount ({appliedPromo})</span>
                        <span>-Rs {promoDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
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
                          Add Rs {(15000 - subtotal).toLocaleString()} more for FREE
                          shipping!
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link to="/checkout" className="block">
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={inStockItems.length === 0}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Link to="/products" className="block">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span>Free shipping on orders over Rs 15,000</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Gift className="w-5 h-5 text-purple-600" />
                      <span>30-day return policy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Items */}
              {recommendedProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      You might also like
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-3"
                        >
                          <Link to={`/product/${product.id}`}>
                            <div className="w-12 h-12 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="flex-1">
                            <Link to={`/product/${product.id}`}>
                              <div className="text-sm font-medium hover:text-primary cursor-pointer">
                                {product.name}
                              </div>
                            </Link>
                            <div className="text-xs text-muted-foreground">
                              ${product.price}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addItem(product)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
