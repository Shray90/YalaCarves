// Checkout page JavaScript version
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";

const Checkout = () => {
  const { state: cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [payment, setPayment] = useState({
    method: "cod", // only Cash on Delivery for now
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cart.total;
  const shippingFee = subtotal > 15000 ? 0 : 500;
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          streetAddress: shipping.address,
          city: shipping.city,
          state: shipping.state || "",
          postalCode: shipping.postalCode,
          country: "India",
        },
        paymentMethod: "cash_on_delivery", // Fixed payment method
        notes: null,
      };

      console.log('Sending order data:', orderData);
      const res = await api.createOrder(orderData);
      console.log('Order response:', res);

      if (res.success) {
        clearCart();
        navigate("/order-success", {
          state: {
            orderNumber: res.order.orderNumber,
            orderId: res.order.id
          },
        });
      } else {
        console.error('Order failed:', res);
        setError(res.error || "Failed to place order");
      }
    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/products">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={shipping.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="address"
                placeholder="Address"
                value={shipping.address}
                onChange={handleInputChange}
                required
              />
              <Input
                name="city"
                placeholder="City"
                value={shipping.city}
                onChange={handleInputChange}
                required
              />
              <Input
                name="state"
                placeholder="State"
                value={shipping.state}
                onChange={handleInputChange}
              />
              <Input
                name="postalCode"
                placeholder="Postal Code"
                value={shipping.postalCode}
                onChange={handleInputChange}
                required
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                value={shipping.phone}
                onChange={handleInputChange}
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={payment.method === "cod"}
                  onChange={() => setPayment({ method: "cod" })}
                />
                <span>Cash on Delivery</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `Rs ${shippingFee.toLocaleString()}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-red-600">{error}</div>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;