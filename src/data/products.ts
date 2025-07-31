import { Product } from "@/contexts/CartContext";

export const products: Product[] = [
  {
    id: 1,
    name: "Traditional Ganesh Sculpture",
    price: 299,
    originalPrice: 350,
    image: "🐘",
    category: "religious",
    description:
      "Beautifully hand-carved Ganesh statue crafted from premium teak wood. This traditional piece features intricate details and represents the remover of obstacles in Hindu tradition. Perfect for home temples, meditation spaces, or as a spiritual gift.",
    artisan: "Master Bijay Shakya",
    inStock: true,
    stockQuantity: 8,
  },
  {
    id: 2,
    name: "Nepali Window Panel",
    price: 489,
    originalPrice: 599,
    image: "🪟",
    category: "architectural",
    rating: 4.8,
    reviews: 89,
    description:
      "Authentic Newari-style wooden window panel featuring traditional geometric patterns and floral motifs. Hand-carved using centuries-old techniques, this architectural piece brings the beauty of Kathmandu's heritage homes to your space.",
    artisan: "Master Sanu Kaji Shakya",
    inStock: true,
    stockQuantity: 3,
  },
  {
    id: 3,
    name: "Buddha Meditation Statue",
    price: 199,
    originalPrice: 240,
    image: "🧘",
    category: "spiritual",
    rating: 4.9,
    reviews: 203,
    description:
      "Serene Buddha statue in meditation pose, carved from sustainable sal wood. Features peaceful expression and traditional robes detail. Ideal for meditation rooms, gardens, or spiritual practice spaces.",
    artisan: "Master Raju Nakarmi",
    inStock: true,
    stockQuantity: 15,
  },
];

export const categories = [
  { value: "all", label: "All Categories" },
  { value: "religious", label: "Religious Art" },
  { value: "architectural", label: "Architectural" },
  { value: "spiritual", label: "Spiritual" },
  { value: "cultural", label: "Cultural" },
  { value: "decorative", label: "Home Decor" },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.artisan.toLowerCase().includes(searchTerm),
  );
};
