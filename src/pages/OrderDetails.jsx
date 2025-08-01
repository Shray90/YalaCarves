import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { toast } from "../hooks/use-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.getOrder(id);
      if (res.success) {
        setOrder(res.order);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch order details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch order details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">Loading order details...</div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
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
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link to="/my-orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="space-y-2">
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod?.replace('_', ' ')}</p>
                <p><strong>Total Amount:</strong> Rs {order.totalAmount.toLocaleString()}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="text-gray-700">
                <p>{order.shippingAddress.streetAddress}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{item.product.emoji}</span>
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Rs {item.price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-xl font-bold">Rs {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;