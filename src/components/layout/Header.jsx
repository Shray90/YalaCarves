import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Search, User, LogIn, LogOut, Crown } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import SearchDialog from "../SearchDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Decorative top border with traditional pattern */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-blue-800"></div>

      {/* Main header */}
      <div className="relative bg-gradient-to-r from-amber-50 via-background to-amber-50 backdrop-blur-xl bg-opacity-80 border-b border-amber-200/50 shadow-lg">
        {/* Traditional pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-r from-amber-200/20 via-transparent to-amber-200/20"></div>
        </div>

        <div className="container relative">
          <div className="flex h-20 items-center justify-between">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center gap-3 text-inherit no-underline">
              <div className="relative">
                {/* Decorative ring around logo */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-amber-600 to-red-600 rounded-xl opacity-75 blur-sm transition-opacity duration-300 hover:opacity-100"></div>

                {/* Main logo container */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-xl flex items-center justify-center shadow-lg border border-amber-300/20">
                  {/* Traditional carved pattern background */}
                  <div className="absolute inset-0 rounded-xl opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                  </div>

                  {/* Logo text */}
                  <span className="relative text-yellow-500 font-bold text-lg leading-7 drop-shadow-sm">YC</span>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                </div>
              </div>

              {/* Brand name with enhanced typography */}
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-wide transition-colors duration-300 hover:text-amber-800">Yala Carves</span>
                <span className="text-xs font-medium tracking-widest uppercase text-amber-600 opacity-80">Traditional Nepali Art</span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className="relative px-4 py-2 text-amber-700 font-medium text-sm tracking-wide no-underline transition-all duration-300 hover:text-amber-800">
                  {/* Background highlight on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg opacity-0 scale-95 transition-all duration-300 hover:opacity-100 hover:scale-100"></div>

                  {/* Traditional underline */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-300 hover:w-3/4"></div>

                  {/* Text */}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <SearchDialog>
                <button className="relative w-10 h-10 border-none bg-transparent rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-amber-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                  <Search className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 hover:text-amber-800" />
                </button>
              </SearchDialog>

              {/* Show Login or Profile based on authentication state */}
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="relative w-10 h-10 border-none bg-transparent rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-amber-100 no-underline text-inherit" title={`Welcome, ${user?.name}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                    <User className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 hover:text-amber-800" />
                  </Link>
                  
                  {/* Admin Dashboard Link */}
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="relative w-10 h-10 border-none bg-transparent rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-amber-100 no-underline text-inherit" title="Admin Dashboard">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                      <Crown className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 hover:text-amber-800" />
                    </Link>
                  )}
                </>
              ) : (
                <Link to="/login" className="relative w-10 h-10 border-none bg-transparent rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-amber-100 no-underline text-inherit" title="Login">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                  <LogIn className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 hover:text-amber-800" />
                </Link>
              )}

              {/* Cart Button with Enhanced Badge */}
              <Link to="/cart" className="relative w-10 h-10 border-none bg-transparent rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-amber-100 no-underline text-inherit">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                <ShoppingBag className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 hover:text-amber-800" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
                    {state.itemCount}
                  </span>
                )}
              </Link>

              {/* Enhanced Mobile menu button */}
              <button
                className="relative w-10 h-10 border-none bg-transparent rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-amber-100 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 hover:text-amber-800" />
                ) : (
                  <Menu className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 hover:text-amber-800" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          <div className={`block overflow-hidden transition-all duration-500 ease-in-out md:hidden ${isMenuOpen ? "max-h-96 pb-6" : "max-h-0"}`}>
            <div className="bg-gradient-to-b from-amber-50 to-amber-100 mx-4 rounded-lg border border-amber-200/50 shadow-inner">
              <nav className="flex flex-col gap-2 p-4">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative px-4 py-3 text-amber-700 font-medium rounded-lg no-underline transition-all duration-300 hover:text-amber-800"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Background highlight */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-50"></div>

                    {/* Traditional pattern */}
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-sm opacity-0 transition-opacity duration-300 hover:opacity-100"></div>

                    {/* Text */}
                    <span className="relative z-10 pl-4">{item.name}</span>
                  </Link>
                ))}
                
                {/* Admin Dashboard Link for Mobile */}
                {isAuthenticated && isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="relative px-4 py-3 text-amber-700 font-medium rounded-lg no-underline transition-all duration-300 hover:text-amber-800 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
