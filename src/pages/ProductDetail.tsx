import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatPrice } from "@/utils/currency";
import api from "@/services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        console.log('Fetching product with ID:', id);
        const response = await api.getProduct(id);
        console.log('Product response:', response);

        if (response.success) {
          setProduct(response.product);

          // Fetch related products from the same category
          const relatedResponse = await api.getProducts({
            category: response.product.category,
            limit: 4
          });

          if (relatedResponse.success) {
            // Filter out the current product from related products
            const filtered = relatedResponse.products.filter(p => p.id !== parseInt(id));
            setRelatedProducts(filtered.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading product...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">
            Product Not Found
          </h1>
          <Link to="/products">
            <Button>Return to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };



  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to="/products"
            className="text-muted-foreground hover:text-foreground"
          >
            Products
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-wood-100 to-wood-200 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-wood-50 to-wood-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} view ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground">by {product.artisan}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-foreground">
                Rs {product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    Rs {product.originalPrice}
                  </span>
                  <Badge variant="destructive">
                    Save Rs{product.originalPrice - product.price}
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">In Stock</span>
                  <span className="text-muted-foreground">
                    ({product.stockQuantity} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(product.stockQuantity, quantity + 1))
                    }
                    disabled={
                      !product.inStock || quantity >= product.stockQuantity
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant={isInWishlist(product.id) ? "destructive" : "outline"}
                  size="lg"
                  onClick={toggleWishlist}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isInWishlist(product.id) ? "red" : "none"}
                    stroke="currentColor"
                  />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">
                    Orders over Rs 15,000
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Secure Payment</div>
                  <div className="text-xs text-muted-foreground">
                    SSL Protected
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">30-Day Returns</div>
                  <div className="text-xs text-muted-foreground">
                    Money back guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8">
              {["description", "specifications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {product.description}
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Craftsmanship Details
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        • Hand-carved using traditional tools and techniques
                      </li>
                      <li>• Sustainably sourced hardwood materials</li>
                      <li>• Natural wood finish with protective coating</li>
                      <li>• Each piece is unique with slight variations</li>
                      <li>• Created by skilled master artisan</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Cultural Significance
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Represents centuries-old Nepali traditions</li>
                      <li>• Connects to spiritual and cultural heritage</li>
                      <li>• Symbol of craftsmanship excellence</li>
                      <li>• Supports local artisan communities</li>
                      <li>• Authentic piece of Nepali art</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">
                    Product Details
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Material:</dt>
                      <dd className="font-medium">Premium Hardwood</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Origin:</dt>
                      <dd className="font-medium">Patan, Nepal</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Artisan:</dt>
                      <dd className="font-medium">{product.artisan}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Technique:</dt>
                      <dd className="font-medium">Hand-carved</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Finish:</dt>
                      <dd className="font-medium">Natural Wood</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4">
                    Care Instructions
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Clean with soft, dry cloth</li>
                    <li>• Avoid direct sunlight exposure</li>
                    <li>• Keep away from moisture</li>
                    <li>• Apply wood polish periodically</li>
                    <li>• Handle with care during moving</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group cursor-pointer">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-wood-100 to-wood-200 rounded-t-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-foreground">
                            {formatPrice(relatedProduct.price)}
                          </span>
                          {relatedProduct.originalPrice >
                            relatedProduct.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(relatedProduct.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
