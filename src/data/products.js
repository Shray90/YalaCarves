// Product data for JavaScript version
export const products = [
  {
    id: 1,
    name: "Traditional Ganesh Sculpture",
    price: 35000,
    originalPrice: 42000,
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
    price: 58000,
    originalPrice: 71000,
    image: "🪟",
    category: "architectural",
    description:
      "Authentic Newari-style wooden window panel featuring traditional geometric patterns and floral motifs. Hand-carved using centuries-old techniques, this architectural piece brings the beauty of Kathmandu's heritage homes to your space.",
    artisan: "Master Sanu Kaji Shakya",
    inStock: true,
    stockQuantity: 3,
  },
  {
    id: 3,
    name: "Buddha Meditation Statue",
    price: 24000,
    originalPrice: 29000,
    image: "🧘",
    category: "spiritual",
    description:
      "Serene Buddha statue in meditation pose, carved from sustainable sal wood. Features peaceful expression and traditional robes detail. Ideal for meditation rooms, gardens, or spiritual practice spaces.",
    artisan: "Master Raju Nakarmi",
    inStock: true,
    stockQuantity: 15,
  },
  {
    id: 4,
    name: "Traditional Mask Collection",
    price: 18000,
    originalPrice: 22000,
    image: "🎭",
    category: "cultural",
    description:
      "Set of three traditional Nepali masks representing different deities and cultural characters. Hand-painted with natural pigments and carved with traditional tools. Perfect for cultural decoration or theater.",
    artisan: "Master Ganga Kaji",
    inStock: true,
    stockQuantity: 12,
  },
  {
    id: 5,
    name: "Lotus Flower Carving",
    price: 15000,
    originalPrice: 19000,
    image: "🪷",
    category: "decorative",
    description:
      "Elegant lotus flower wall hanging carved from sustainably sourced hardwood. Symbol of purity and enlightenment in Buddhist and Hindu traditions. Beautiful accent piece for any room.",
    artisan: "Master Indra Pradhan",
    inStock: true,
    stockQuantity: 20,
  },
  {
    id: 6,
    name: "Temple Guardian Lion",
    price: 47000,
    originalPrice: 54000,
    image: "🦁",
    category: "religious",
    description:
      "Majestic guardian lion sculpture traditionally placed at temple entrances. Features fierce expression and intricate mane details. Carved from dense hardwood for durability and lasting beauty.",
    artisan: "Master Binod Chitrakar",
    inStock: true,
    stockQuantity: 5,
  },
  {
    id: 7,
    name: "Peacock Wall Art",
    price: 21000,
    originalPrice: 26000,
    image: "🦚",
    category: "decorative",
    description:
      "Stunning peacock relief carving showcasing the national bird of Nepal. Features detailed feather work and traditional motifs. Perfect statement piece for living rooms or hallways.",
    artisan: "Master Dinesh Prajapati",
    inStock: true,
    stockQuantity: 9,
  },
  {
    id: 8,
    name: "Himalayan Yak Sculpture",
    price: 29000,
    originalPrice: 36000,
    image: "🐂",
    category: "cultural",
    description:
      "Authentic yak sculpture representing the hardy animals of the Himalayas. Carved with attention to anatomical details and cultural significance. Great conversation piece for any home.",
    artisan: "Master Pemba Sherpa",
    inStock: false,
    stockQuantity: 0,
  },
  {
    id: 9,
    name: "Traditional Prayer Wheel",
    price: 11000,
    originalPrice: 15000,
    image: "☸️",
    category: "spiritual",
    description:
      "Handcrafted wooden prayer wheel with traditional mantras inscribed. Spins smoothly and includes authentic Tibetan prayers. Essential item for Buddhist practice and meditation.",
    artisan: "Master Tenzin Norbu",
    inStock: true,
    stockQuantity: 25,
  },
  {
    id: 10,
    name: "Newari Door Panel",
    price: 71000,
    originalPrice: 86000,
    image: "🚪",
    category: "architectural",
    description:
      "Exquisite Newari-style door panel featuring traditional woodcarving techniques passed down through generations. Includes intricate geometric patterns and mythological figures.",
    artisan: "Master Ratna Shakya",
    inStock: true,
    stockQuantity: 2,
  },
  {
    id: 11,
    name: "Wooden Incense Holder",
    price: 5000,
    originalPrice: 7000,
    image: "🔥",
    category: "spiritual",
    description:
      "Beautifully carved wooden incense holder with traditional motifs. Features multiple stick holders and ash collection base. Perfect for daily spiritual practice and meditation.",
    artisan: "Master Hari Shrestha",
    inStock: true,
    stockQuantity: 45,
  },
  {
    id: 12,
    name: "Dancing Shiva Sculpture",
    price: 43000,
    originalPrice: 50000,
    image: "🕺",
    category: "religious",
    description:
      "Dynamic Nataraja (Dancing Shiva) sculpture capturing the cosmic dance of creation and destruction. Intricate details in every limb and ornament. Masterpiece of Hindu religious art.",
    artisan: "Master Krishna Chitrakar",
    inStock: true,
    stockQuantity: 6,
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

export const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category) => {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.artisan.toLowerCase().includes(searchTerm),
  );
};
