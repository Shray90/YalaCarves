import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient-circle-at-20-80-from-yellow-400/10-to-transparent-50 bg-radial-gradient-circle-at-80-20-from-yellow-400/5-to-transparent-50 pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-yellow-500 from-red-600 via-yellow-500 to-transparent opacity-80"></div>
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <div className="flex flex-col gap-12">
          {/* Brand Section */}
          <div className="text-center mb-5">
            <div className="inline-block border-3 border-white p-6 px-12 rounded-lg bg-white/5 backdrop-blur-xl shadow-2xl transition-all duration-300 relative hover:-translate-y-1 hover:shadow-3xl">
              <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 bg-gradient-to-45deg-from-yellow-500-via-transparent-to-yellow-500 rounded-xl -z-10 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
              <h2 className="font-serif text-3xl font-semibold tracking-widest text-white m-0 drop-shadow-lg">YALA CARVES</h2>
            </div>
            <p className="text-lg text-yellow-400 mt-4 mb-2.5 font-medium tracking-wide">Authentic Nepali Wood Carvings</p>
            <p className="text-base text-white/80 max-w-lg mx-auto leading-relaxed">
              Preserving traditional craftsmanship through timeless art pieces
              carved by master artisans from the heart of Nepal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center my-5 animate-fadeInUp">
            <nav className="flex gap-10 justify-center items-center flex-wrap">
              <Link to="/" className="text-white/90 no-underline text-base font-normal transition-all duration-300 relative px-4 py-2 rounded-full bg-white/5 hover:text-white hover:translate-x-1">
                <div className="absolute inset-0 bg-gradient-to-45deg-from-yellow-500-to-red-600 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-20 -z-10"></div>
                Home
              </Link>
              <Link to="/products" className="text-white/90 no-underline text-base font-normal transition-all duration-300 relative px-4 py-2 rounded-full bg-white/5 hover:text-white hover:translate-x-1">
                <div className="absolute inset-0 bg-gradient-to-45deg-from-yellow-500-to-red-600 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-20 -z-10"></div>
                Products
              </Link>
              <Link to="/about" className="text-white/90 no-underline text-base font-normal transition-all duration-300 relative px-4 py-2 rounded-full bg-white/5 hover:text-white hover:translate-x-1">
                <div className="absolute inset-0 bg-gradient-to-45deg-from-yellow-500-to-red-600 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-20 -z-10"></div>
                About
              </Link>
              <Link to="/contact" className="text-white/90 no-underline text-base font-normal transition-all duration-300 relative px-4 py-2 rounded-full bg-white/5 hover:text-white hover:translate-x-1">
                <div className="absolute inset-0 bg-gradient-to-45deg-from-yellow-500-to-red-600 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-20 -z-10"></div>
                Contact
              </Link>
            </nav>
          </div>

          {/* Social & Bottom */}
          <div className="border-t border-white/10 pt-8 text-center">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-5">Follow Our Journey</h3>
              <div className="flex gap-5 justify-center mt-5">
                <a
                  href="#"
                  className="text-white transition-all duration-400 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br-from-white/10-to-white/5 border-2 border-white/20 relative overflow-hidden hover:bg-gradient-to-br-from-yellow-500-to-red-600 hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:border-yellow-500"
                  aria-label="Instagram"
                >
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r-from-transparent-via-yellow-400/40-to-transparent transition-left duration-500 ease-in-out hover:left-full"></div>
                  <Instagram className="w-6 h-6 z-10" />
                </a>
                <a href="#" className="text-white transition-all duration-400 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br-from-white/10-to-white/5 border-2 border-white/20 relative overflow-hidden hover:bg-gradient-to-br-from-yellow-500-to-red-600 hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:border-yellow-500" aria-label="Google">
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r-from-transparent-via-yellow-400/40-to-transparent transition-left duration-500 ease-in-out hover:left-full"></div>
                  <svg
                    className="w-6 h-6 z-10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </a>
                <a href="#" className="text-white transition-all duration-400 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br-from-white/10-to-white/5 border-2 border-white/20 relative overflow-hidden hover:bg-gradient-to-br-from-yellow-500-to-red-600 hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:border-yellow-500" aria-label="Twitter">
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r-from-transparent-via-yellow-400/40-to-transparent transition-left duration-500 ease-in-out hover:left-full"></div>
                  <Twitter className="w-6 h-6 z-10" />
                </a>
                <a
                  href="#"
                  className="text-white transition-all duration-400 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br-from-white/10-to-white/5 border-2 border-white/20 relative overflow-hidden hover:bg-gradient-to-br-from-yellow-500-to-red-600 hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:border-yellow-500"
                  aria-label="Facebook"
                >
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r-from-transparent-via-yellow-400/40-to-transparent transition-left duration-500 ease-in-out hover:left-full"></div>
                  <Facebook className="w-6 h-6 z-10" />
                </a>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r-from-transparent-via-white/30-to-transparent my-8"></div>

            <div className="text-white/70 text-sm text-center">
              <p className="m-0 py-4">
                &copy; 2024 Yala Carves. All rights reserved. | Crafted with ❤️
                in Nepal
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
