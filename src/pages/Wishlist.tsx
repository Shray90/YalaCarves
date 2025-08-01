import { Link } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatPrice } from "@/utils/currency";

const Wishlist = () => {
  const { state, removeFromWishlist } = useWishlist();

  const inStockItems = state.items.filter((item) => item.inStock);
  const outOfStockItems = state.items.filter((item) => !item.inStock);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Wishlist
            </h1>
            <p className="text-muted-foreground">
              {state.items.length} item{state.items.length !== 1 ? "s" : ""} in
              your wishlist
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {state.items.length === 0 ? (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💖</div>
            <h2 className="text-2xl font-serif font-bold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your wishlist yet.
            </p>
            <Link to="/products">
              <Button size="lg">Explore Our Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* In Stock Items */}
            {inStockItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Available Items</span>
                    <Badge variant="secondary" className="text-xs">
                      {inStockItems.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {inStockItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                by {item.artisan} • {item.category}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-lg">
                                Rs {item.price.toLocaleString()}
                              </span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  Rs {item.originalPrice.toLocaleString()}
                                </span>
                              )}
                              {item.originalPrice > item.price && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Save Rs {(item.originalPrice - item.price).toLocaleString()}
                                </Badge>
                              )}
                            </div>

                            {/* Remove Button */}
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromWishlist(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                        {index < inStockItems.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Out of Stock Items */}
            {outOfStockItems.length > 0 && (
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-destructive">
                    <span>Out of Stock</span>
                    <Badge variant="destructive" className="text-xs">
                      {outOfStockItems.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {outOfStockItems.map((item, index) => (
                      <div key={item.id} className="opacity-60">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                by {item.artisan} • {item.category}
                              </p>
                              <Badge
                                variant="destructive"
                                className="text-xs mt-1"
                              >
                                Out of Stock
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </Button>
                        </div>
                        {index < outOfStockItems.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
