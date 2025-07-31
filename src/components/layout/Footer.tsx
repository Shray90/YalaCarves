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
    <footer className="bg-wood-900 text-wood-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-nepal-gold to-wood-600 rounded-lg flex items-center justify-center">
                <span className="text-wood-900 font-bold text-sm">YC</span>
              </div>
              <span className="font-serif text-xl font-bold">Yala Carves</span>
            </div>
            <p className="text-wood-200 text-sm leading-relaxed">
              Preserving the ancient art of Nepali wood carving through
              authentic, handcrafted masterpieces that tell stories of our rich
              cultural heritage.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-wood-300 hover:text-nepal-gold transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-wood-300 hover:text-nepal-gold transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-wood-300 hover:text-nepal-gold transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-wood-50 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Products", "About Us", "Contact", "FAQ"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replace(" ", "-")}`}
                      className="text-wood-300 hover:text-nepal-gold transition-colors duration-200 text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-wood-50 mb-4">Categories</h3>
            <ul className="space-y-2">
              {[
                "Traditional Masks",
                "Religious Sculptures",
                "Decorative Panels",
                "Home Decor",
                "Custom Orders",
              ].map((category) => (
                <li key={category}>
                  <Link
                    to="/products"
                    className="text-wood-300 hover:text-nepal-gold transition-colors duration-200 text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-wood-50 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-nepal-gold flex-shrink-0" />
                <span className="text-wood-300 text-sm">
                  Patan, Lalitpur
                  <br />
                  Nepal
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-nepal-gold flex-shrink-0" />
                <span className="text-wood-300 text-sm">+977-1-5555555</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-nepal-gold flex-shrink-0" />
                <span className="text-wood-300 text-sm">
                  info@yalacarves.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-wood-700 mt-8 pt-8 text-center">
          <p className="text-wood-400 text-sm">
            © {new Date().getFullYear()} Yala Carves. All rights reserved.
            Handcrafted with ❤️ in Nepal.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
