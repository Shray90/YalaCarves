// Featured Products section component for showcasing handcrafted masterpieces
// Displays a curated selection of products with add-to-cart functionality and responsive grid layout
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/currency";
import api from "@/services/api";

// FeaturedProducts component with API integration and cart functionality
const FeaturedProducts = () => {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.getProducts({ limit: 4 });
        if (response.success) {
          setFeaturedProducts(response.products || []);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Featured Masterpieces
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most beloved pieces, each meticulously crafted by master
            artisans using traditional techniques passed down through
            generations.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading featured products...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-wood-100 to-wood-200 rounded-t-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)}
                    </span>
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => addItem(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
