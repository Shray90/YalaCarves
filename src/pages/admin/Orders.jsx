// Admin orders management
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled"
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [editStatus, setEditStatus] = useState({}); // { [orderId]: status }
  const [statusLoading, setStatusLoading] = useState({}); // { [orderId]: bool }
  const [statusError, setStatusError] = useState({}); // { [orderId]: error }

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAllOrders({ page, limit });
      if (res.success) {
        setOrders(res.orders);
      } else {
        setError(res.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, limit]);

  const handleStatusChange = (orderId, value) => {
    setEditStatus((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleStatusSave = async (orderId) => {
    setStatusLoading((prev) => ({ ...prev, [orderId]: true }));
    setStatusError((prev) => ({ ...prev, [orderId]: null }));
    try {
      const newStatus = editStatus[orderId];
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res && res.status) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: res.status } : o));
        setEditStatus((prev) => ({ ...prev, [orderId]: undefined }));
      } else {
        setStatusError((prev) => ({ ...prev, [orderId]: res.error || 'Failed to update status' }));
      }
    } catch {
      setStatusError((prev) => ({ ...prev, [orderId]: 'Error updating status' }));
    } finally {
      setStatusLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div>
      <h1>View Orders</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <>
          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total (Rs)</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Items</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.order_number}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.customer_email}</td>
                  <td>{o.totalAmount}</td>
                  <td>
                    <select
                      value={editStatus[o.id] !== undefined ? editStatus[o.id] : o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      disabled={statusLoading[o.id]}
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>{o.payment_status}</td>
                  <td>{o.itemCount}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleStatusSave(o.id)}
                      disabled={statusLoading[o.id] || (editStatus[o.id] === undefined || editStatus[o.id] === o.status)}
                    >
                      {statusLoading[o.id] ? 'Saving...' : 'Save'}
                    </button>
                    {statusError[o.id] && <div style={{ color: 'red' }}>{statusError[o.id]}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span style={{ margin: '0 8px' }}>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={orders.length < limit}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;