import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Grid, List, ShoppingCart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/currency";
import api from "@/services/api";

const Products = () => {
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // State for backend data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle URL search parameters
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Fetch products and categories from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching products and categories...');
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);

        console.log('Products response:', productsRes);
        console.log('Categories response:', categoriesRes);

        if (productsRes.success) {
          setProducts(productsRes.products || []);
        }

        if (categoriesRes.success) {
          // Transform categories for the select component
          const categoryOptions = [
            { value: "all", label: "All Categories" },
            ...categoriesRes.categories.map(cat => ({
              value: cat.slug || cat.name.toLowerCase(),
              label: cat.name
            }))
          ];
          setCategories(categoryOptions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artisan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured order (default)
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Our Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic Nepali wood carvings crafted by master artisans.
            Each piece tells a unique story of tradition and skill.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-lg">Loading products...</div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-lg text-muted-foreground">No products found</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className={`group transition-all duration-300 hover:shadow-lg border border-border/50 ${
                viewMode === "list" ? "flex flex-col sm:flex-row" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className={`p-0 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div
                  className={
                    viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"
                  }
                >
                  {/* Product Image */}
                  <Link to={`/product/${product.id}`}>
                    <div
                      className={`bg-gradient-to-br from-wood-100 to-wood-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 cursor-pointer relative ${
                        viewMode === "list"
                          ? "sm:w-48 h-48 rounded-l-lg"
                          : "aspect-square rounded-t-lg"
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-l-lg sm:rounded-t-lg">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6 space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find((c) => c.value === product.category)?.label}
                      </Badge>
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    {viewMode === "list" && (
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {product.artisan}</span>
                    </div>

                    {viewMode === "list" && (
                      <div className="pt-2">
                        <Button
                          className="w-full sm:w-auto"
                          onClick={() => addItem(product)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {viewMode === "grid" && (
                  <div className="p-4 border-t border-border">
                    <Button
                      className="w-full"
                      onClick={() => addItem(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
                ))
              )}
            </div>

            {/* Load More */}
            {!loading && filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Products;
