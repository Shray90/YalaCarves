// Hero section with main banner and CTA
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-wood-50 to-wood-100 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className={
            'absolute top-0 left-0 w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
          }
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-nepal-gold text-nepal-gold" />
                <span>Authentic Nepali Craftsmanship</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                Timeless
                <span className="text-primary block">Wood Carvings</span>
                from Nepal
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Discover the ancient art of Nepali wood carving through our
                collection of handcrafted masterpieces. Each piece tells a story
                of tradition, skill, and cultural heritage passed down through
                generations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link to="/products">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base">
                Learn Our Story
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">
                  Years of Tradition
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Handcrafted</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-in">
            <div className="relative z-10">
              <div className="aspect-square bg-gradient-to-br from-wood-200 to-wood-300 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/src/components/pictures/homepage.png"
                  alt="Traditional Nepali Wood Carving"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-nepal-gold/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-nepal-red/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-0 w-12 h-12 bg-wood-500/30 rounded-full blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
