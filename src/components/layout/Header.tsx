import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Search, User, Heart, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SearchDialog from "@/components/SearchDialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { user } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "My Orders", href: "/my-orders" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Decorative top border with traditional pattern */}
      <div className="h-1 bg-gradient-to-r from-nepal-red via-nepal-gold to-nepal-blue"></div>

      {/* Main header */}
      <div className="relative bg-gradient-to-r from-wood-50 via-background to-wood-50 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-wood-200/50 shadow-lg">
        {/* Traditional pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-r from-wood-200/20 via-transparent to-wood-200/20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex h-20 items-center justify-between">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Decorative ring around logo */}
                <div className="absolute -inset-1 bg-gradient-to-r from-nepal-gold via-wood-500 to-nepal-red rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                {/* Main logo container */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-wood-600 via-wood-700 to-wood-800 rounded-xl flex items-center justify-center shadow-lg border border-wood-500/20">
                  {/* Traditional carved pattern background */}
                  <div className="absolute inset-0 rounded-xl opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                  </div>

                  {/* Logo text */}
                  <span className="relative text-nepal-gold font-bold text-lg drop-shadow-sm">
                    YC
                  </span>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                </div>
              </div>

              {/* Brand name with enhanced typography */}
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-foreground group-hover:text-wood-700 transition-colors duration-300 tracking-wide">
                  Yala Carves
                </span>
                <span className="text-xs text-wood-600 font-medium tracking-wider uppercase opacity-80">
                  Traditional Nepali Art
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 text-wood-700 hover:text-wood-800 transition-all duration-300 font-medium text-sm tracking-wide group"
                >
                  {/* Background highlight on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-wood-100 to-wood-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100 transform"></div>

                  {/* Traditional underline */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-nepal-gold to-wood-600 group-hover:w-3/4 transition-all duration-300"></div>

                  {/* Text */}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <SearchDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex relative group hover:bg-wood-100 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-wood-200 to-wood-300 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <Search className="h-5 w-5 text-wood-600 group-hover:text-wood-800 transition-colors duration-300 relative z-10" />
                </Button>
              </SearchDialog>

              {/* Profile Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative group hover:bg-wood-100 transition-all duration-300"
                asChild
              >
                <Link to={user?.isAdmin ? "/admin/dashboard" : "/profile"}>
                  <div className="absolute inset-0 bg-gradient-to-r from-wood-200 to-wood-300 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <User className="h-5 w-5 text-wood-600 group-hover:text-wood-800 transition-colors duration-300 relative z-10" />
                </Link>
              </Button>

              {/* Conditionally render Wishlist and Cart for non-admin users */}
              {!user?.isAdmin && (
                <>
                  {/* Wishlist Button with Enhanced Badge */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative group hover:bg-wood-100 transition-all duration-300"
                    asChild
                  >
                    <Link to="/wishlist">
                      <div className="absolute inset-0 bg-gradient-to-r from-wood-200 to-wood-300 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <Heart className="h-5 w-5 text-wood-600 group-hover:text-wood-800 transition-colors duration-300 relative z-10" />
                      {wishlistState.items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-nepal-red to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
                          {wishlistState.items.length}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Cart Button with Enhanced Badge */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative group hover:bg-wood-100 transition-all duration-300"
                    asChild
                  >
                    <Link to="/cart">
                      <div className="absolute inset-0 bg-gradient-to-r from-wood-200 to-wood-300 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <ShoppingBag className="h-5 w-5 text-wood-600 group-hover:text-wood-800 transition-colors duration-300 relative z-10" />
                      {cartState.itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-nepal-red to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
                          {cartState.itemCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </>
              )}

              {/* Enhanced Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative group hover:bg-wood-100 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-wood-200 to-wood-300 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-wood-600 group-hover:text-wood-800 transition-colors duration-300 relative z-10" />
                ) : (
                  <Menu className="h-5 w-5 text-wood-600 group-hover:text-wood-800 transition-colors duration-300 relative z-10" />
                )}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
              isMenuOpen ? "max-h-96 pb-6" : "max-h-0",
            )}
          >
            <div className="bg-gradient-to-b from-wood-50 to-wood-100 mx-4 rounded-lg border border-wood-200/50 shadow-inner">
              <nav className="flex flex-col space-y-2 p-4">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative group px-4 py-3 text-wood-700 hover:text-wood-800 transition-all duration-300 font-medium rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Background highlight */}
                    <div className="absolute inset-0 bg-gradient-to-r from-wood-200 to-wood-300 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                    {/* Traditional pattern */}
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-nepal-gold to-wood-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>

                    {/* Text */}
                    <span className="relative z-10 pl-4">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
