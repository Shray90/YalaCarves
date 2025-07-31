import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ViewOrders = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/admin/all');
        if (response.success) {
          setOrders(response.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAdmin]);

  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>View Orders</h1>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.order_number}</td>
              <td>{o.customer_name} ({o.customer_email})</td>
              <td>{o.totalAmount}</td>
              <td>{o.status}</td>
              <td>{o.payment_status}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewOrders;
