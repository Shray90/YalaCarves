// Currency utility functions for Yala Carves e-commerce platform
// Provides comprehensive price formatting with Nepali Rupee localization and savings calculations
// Utility function to format prices in Nepali Rupees with proper localization
export const formatPrice = (price) => {
  return `Rs ${price.toLocaleString("en-IN")}`;
};

// Function to format price with proper Nepali number formatting
export const formatPriceNepali = (price) => {
  // Convert to Indian numbering system (lakhs, crores)
  return `Rs ${price.toLocaleString("en-IN")}`;
};

// Function to calculate and format savings
export const formatSavings = (originalPrice, currentPrice) => {
  const savings = originalPrice - currentPrice;
  return `Save Rs ${savings.toLocaleString("en-IN")}`;
};

// Function to format price range
export const formatPriceRange = (minPrice, maxPrice) => {
  return `Rs ${minPrice.toLocaleString("en-IN")} - Rs ${maxPrice.toLocaleString("en-IN")}`;
};
