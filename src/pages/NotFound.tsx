// 404 Not Found page component with helpful navigation and woodworking theme
// Features creative 404 design, navigation options, and helpful links for lost users
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

// NotFound component with woodworking-themed 404 page and user-friendly navigation
const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-wood-50 to-wood-100">
        <div className="text-center space-y-8 px-4">
          {/* 404 Art */}
          <div className="space-y-4">
            <div className="text-8xl lg:text-9xl font-serif font-bold text-wood-300">
              404
            </div>
            <div className="text-6xl">🪵</div>
          </div>

          {/* Content */}
          <div className="space-y-4 max-w-md mx-auto">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              It seems like this page has been carved away! The page you're
              looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              You might be looking for:
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/products"
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                Our Products
              </Link>
              <Link
                to="/about"
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
