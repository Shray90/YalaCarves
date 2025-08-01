const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('yalacarves_token');
  }

  // Create headers with auth token
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: this.getHeaders(options.auth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', data);
        console.error('Response Status:', response.status);
        console.error('Response Headers:', response.headers);

        // If there are validation errors, show them
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        }

        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false
    });

    if (response.token) {
      localStorage.setItem('yalacarves_token', response.token);
      localStorage.setItem('yalacarves_user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(name, email, password, securityQuestion, securityAnswer) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, securityQuestion, securityAnswer }),
      auth: false
    });

    if (response.token) {
      localStorage.setItem('yalacarves_token', response.token);
      localStorage.setItem('yalacarves_user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('yalacarves_token');
    localStorage.removeItem('yalacarves_user');
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`, { auth: false });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`, { auth: false });
  }

  async createProduct(productData) {
    const url = `${this.baseURL}/products`;
    const token = this.getAuthToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  }

  async updateProduct(id, productData) {
    const url = `${this.baseURL}/products/${id}`;
    const token = this.getAuthToken();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories', { auth: false });
  }

  async createCategory(categoryData) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async updateCartProduct(productId, quantity) {
    return this.request(`/cart/product/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/item/${itemId}`, {
      method: 'DELETE'
    });
  }

  async removeProductFromCart(productId) {
    return this.request(`/cart/product/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE'
    });
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getMyOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT'
    });
  }

  // Admin
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders/admin/all${query ? `?${query}` : ''}`);
  }

  async updateOrderStatus(id, status, paymentStatus) {
    return this.request(`/orders/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus })
    });
  }

  async getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  async getInventoryLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/inventory/logs${query ? `?${query}` : ''}`);
  }

  async bulkUpdateStock(updates) {
    return this.request('/admin/inventory/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ updates })
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { auth: false });
  }
}

export default new ApiService();
