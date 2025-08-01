// My Orders page JavaScript version
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { toast } from "../hooks/use-toast";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    shippingAddress: {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Pakistan'
    },
    notes: ''
  });

  const canCancelOrder = (createdAt) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
    return hoursDiff <= 5;
  };

  const canEditOrder = (status) => {
    return status === 'pending';
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.getMyOrders();
      if (res.success) {
        setOrders(res.orders);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    setCancelingOrderId(orderId);
    try {
      const res = await api.request(`/orders/${orderId}/cancel`, {
        method: "PUT",
      });
      if (res.success) {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled.",
        });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to cancel order.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order.",
        variant: "destructive",
      });
    } finally {
      setCancelingOrderId(null);
    }
  };

  const handleEditOrder = async (orderId) => {
    try {
      const res = await api.getOrder(orderId);
      if (res.success) {
        setEditingOrder(orderId);
        setEditForm({
          shippingAddress: res.order.shippingAddress,
          notes: res.order.notes || ''
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load order details.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      const res = await api.request(`/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify(editForm)
      });
      
      if (res.success) {
        toast({
          title: "Order Updated",
          description: "Your order has been updated successfully.",
        });
        setEditingOrder(null);
        fetchOrders(); // Refresh orders
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to update order.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await api.request(`/orders/${orderId}`, {
        method: "DELETE"
      });
      
      if (res.success) {
        toast({
          title: "Order Deleted",
          description: "Order has been deleted successfully.",
        });
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to delete order.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">Loading orders...</div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">You have no orders</h1>
          <Link to="/products">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Button onClick={fetchOrders} variant="outline">
            Refresh
          </Button>
        </div>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 shadow-sm bg-white">
              {editingOrder === order.id ? (
                // Edit Form
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Edit Order #{order.order_number}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Street Address</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editForm.shippingAddress.streetAddress}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          shippingAddress: {
                            ...editForm.shippingAddress,
                            streetAddress: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editForm.shippingAddress.city}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          shippingAddress: {
                            ...editForm.shippingAddress,
                            city: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Postal Code</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editForm.shippingAddress.postalCode}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          shippingAddress: {
                            ...editForm.shippingAddress,
                            postalCode: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editForm.shippingAddress.state}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          shippingAddress: {
                            ...editForm.shippingAddress,
                            state: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      rows="3"
                      value={editForm.notes}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        notes: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdateOrder(order.id)}>
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingOrder(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold">Rs {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="font-semibold">{order.itemCount} items</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold capitalize">{order.payment_method?.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    
                    {canEditOrder(order.status) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditOrder(order.id)}
                      >
                        Edit Order
                      </Button>
                    )}
                    
                    {order.status !== "cancelled" && canCancelOrder(order.createdAt) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelingOrderId === order.id}
                      >
                        {cancelingOrderId === order.id ? "Cancelling..." : "Cancel"}
                      </Button>
                    )}
                    
                    {(order.status === "cancelled" || order.status === "delivered") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
