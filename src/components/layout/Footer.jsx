import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#6e4b2b] text-white py-10">
      <div className="flex flex-col items-center space-y-6">

        {/* Logo Box */}
        <div className="border border-white px-6 py-2">
          <h1 className="text-2xl font-serif tracking-wide">YALA CARVES</h1>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 items-center text-white text-xl">
          <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
          <a href="#" aria-label="Google"><span className="text-lg font-bold">G</span></a>
          <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
          <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-10 text-base font-semibold">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/products" className="hover:underline">Products</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;
