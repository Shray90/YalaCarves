import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#6e4b2b] text-white py-10">
      <div className="flex flex-col items-center space-y-6">

        {/* Logo Box */}
        <div className="border-2 border-white px-16 py-6 bg-white/5 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/10 transition-all duration-300">
          <h1 className="text-5xl lg:text-6xl font-serif tracking-wider font-bold text-white drop-shadow-lg">YALA CARVES</h1>
          <p className="text-sm text-white/80 text-center mt-2 tracking-wide">Handcrafted Excellence</p>
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
