import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { searchProducts } from "@/data/products";
import { Product } from "@/contexts/CartContext";

interface SearchDialogProps {
  children: React.ReactNode;
}

const SearchDialog = ({ children }: SearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const searchResults = searchProducts(query);
      setResults(searchResults.slice(0, 6)); // Limit to 6 results
    } else {
      setResults([]);
    }
  }, [query]);

  const handleProductClick = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for wood carvings, artisans, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {query.trim().length > 0 && (
            <div className="space-y-4">
              {results.length > 0 ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    Found {results.length} result
                    {results.length !== 1 ? "s" : ""} for "{query}"
                  </div>
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={handleProductClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {product.name}
                            </h3>
                            {!product.inStock && (
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>by {product.artisan}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">
                            ${product.price}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <Link
                      to={`/products?search=${encodeURIComponent(query)}`}
                      onClick={handleProductClick}
                    >
                      <Button variant="outline" className="w-full">
                        View all results for "{query}"
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No products found for "{query}"</p>
                  <p className="text-sm mt-1">
                    Try different keywords or browse our categories
                  </p>
                </div>
              )}
            </div>
          )}

          {query.trim().length === 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">
                Popular searches:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Buddha",
                  "Ganesh",
                  "Masks",
                  "Window Panel",
                  "Guardian Lion",
                ].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(term)}
                    className="text-xs"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
