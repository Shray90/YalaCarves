// Admin users management
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const initialEditState = {
  id: null,
  name: '',
  email: '',
  phone: '',
  is_admin: false,
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [editUser, setEditUser] = useState(initialEditState);
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAllUsers({ page, limit });
      if (res.success) {
        setUsers(res.users);
      } else {
        setError(res.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, limit]);

  const handleEditClick = (user) => {
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      is_admin: user.is_admin,
    });
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await api.updateUser(editUser.id, {
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        is_admin: editUser.is_admin,
      });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...res.user } : u)));
        setEditUser(initialEditState);
      } else {
        setEditError(res.error || 'Failed to update user');
      }
    } catch {
      setEditError('Error updating user');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditUser(initialEditState);
    setEditError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await api.deleteUser(id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(res.error || 'Failed to delete user');
      }
    } catch {
      alert('Error deleting user');
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <>
          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Admin?</th>
                <th>Order Count</th>
                <th>Total Spent (Rs)</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  {editUser.id === u.id ? (
                    <>
                      <td><input name="name" value={editUser.name} onChange={handleEditChange} /></td>
                      <td><input name="email" value={editUser.email} onChange={handleEditChange} /></td>
                      <td><input name="phone" value={editUser.phone} onChange={handleEditChange} /></td>
                      <td><input type="checkbox" name="is_admin" checked={editUser.is_admin} onChange={handleEditChange} /></td>
                      <td>{u.orderCount}</td>
                      <td>{u.totalSpent}</td>
                      <td>{new Date(u.created_at).toLocaleString()}</td>
                      <td>
                        <button onClick={handleEditSave} disabled={editLoading}>Save</button>
                        <button onClick={handleEditCancel} disabled={editLoading}>Cancel</button>
                        {editError && <div style={{ color: 'red' }}>{editError}</div>}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td>{u.is_admin ? 'Yes' : 'No'}</td>
                      <td>{u.orderCount}</td>
                      <td>{u.totalSpent}</td>
                      <td>{new Date(u.created_at).toLocaleString()}</td>
                      <td>
                        <button onClick={() => handleEditClick(u)}>Edit</button>
                        <button onClick={() => handleDelete(u.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span style={{ margin: '0 8px' }}>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={users.length < limit}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;