// Mock data store for products, users, and reviews
export const mockProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smartphone Case",
    price: 24.99,
    description: "Durable protective case for smartphones",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
    category: "Accessories"
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 45.99,
    description: "Adjustable aluminum laptop stand for better ergonomics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    category: "Office"
  },
  {
    id: 4,
    name: "Coffee Mug",
    price: 12.99,
    description: "Ceramic coffee mug with heat-resistant handle",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop",
    category: "Kitchen"
  }
];

export const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Carol Williams", email: "carol@example.com" },
  { id: 4, name: "David Brown", email: "david@example.com" }
];

// Initial reviews data
const initialReviews = [
  {
    id: 1,
    productId: 1,
    userId: 2,
    userName: "Bob Smith",
    rating: 5,
    description: "Amazing sound quality! The noise cancellation works perfectly.",
    image: null,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    productId: 1,
    userId: 3,
    userName: "Carol Williams",
    rating: 4,
    description: "Great headphones, very comfortable for long listening sessions.",
    image: null,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 3,
    productId: 2,
    userId: 4,
    userName: "David Brown",
    rating: 3,
    description: "Good protection but a bit bulky.",
    image: null,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString()
  }
];

// Data management functions
export const getStoredData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
};

// Initialize data if not exists
export const initializeData = () => {
  if (!localStorage.getItem('reviews')) {
    setStoredData('reviews', initialReviews);
  }
  if (!localStorage.getItem('currentUser')) {
    setStoredData('currentUser', mockUsers[0]); // Default to Alice
  }
};

// Review CRUD operations
export const getReviews = () => {
  return getStoredData('reviews', []);
};

export const getReviewsByProduct = (productId) => {
  const reviews = getReviews();
  return reviews.filter(review => review.productId === parseInt(productId));
};

export const addReview = (reviewData) => {
  const reviews = getReviews();
  const newReview = {
    id: Date.now(),
    ...reviewData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const updatedReviews = [...reviews, newReview];
  setStoredData('reviews', updatedReviews);
  return newReview;
};

export const updateReview = (reviewId, updatedData) => {
  const reviews = getReviews();
  const updatedReviews = reviews.map(review => 
    review.id === reviewId 
      ? { ...review, ...updatedData, updatedAt: new Date().toISOString() }
      : review
  );
  setStoredData('reviews', updatedReviews);
  return updatedReviews.find(review => review.id === reviewId);
};

export const deleteReview = (reviewId) => {
  const reviews = getReviews();
  const updatedReviews = reviews.filter(review => review.id !== reviewId);
  setStoredData('reviews', updatedReviews);
};

export const getCurrentUser = () => {
  return getStoredData('currentUser', mockUsers[0]);
};

export const setCurrentUser = (user) => {
  setStoredData('currentUser', user);
};

export const getProductById = (id) => {
  return mockProducts.find(product => product.id === parseInt(id));
};