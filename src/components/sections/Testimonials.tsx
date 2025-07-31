import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "The Buddha statue I ordered exceeded all my expectations. The intricate details and craftsmanship are absolutely stunning. It's become the centerpiece of my meditation room.",
      product: "Buddha Meditation Statue",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Vancouver, Canada",
      rating: 5,
      text: "Exceptional quality and authentic craftsmanship. The Ganesh sculpture arrived perfectly packaged and the attention to detail is remarkable. Highly recommend Yala Carves!",
      product: "Traditional Ganesh Sculpture",
    },
    {
      id: 3,
      name: "Emma Thompson",
      location: "London, UK",
      rating: 5,
      text: "I'm amazed by the beauty of the window panel. It adds such an authentic Nepali touch to my home. The customer service was also outstanding throughout the process.",
      product: "Nepali Window Panel",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read stories from art lovers around the world who have brought
            Nepali heritage into their homes.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="relative group hover:shadow-lg transition-all duration-300 border border-border/50"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-between items-start">
                  <Quote className="h-8 w-8 text-primary/20" />
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-nepal-gold text-nepal-gold"
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-muted-foreground leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Product */}
                <div className="text-sm text-primary font-medium">
                  Product: {testimonial.product}
                </div>

                {/* Customer Info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 bg-gradient-to-br from-wood-300 to-wood-500 rounded-full flex items-center justify-center text-wood-50 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">
              Verified Reviews
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">50+</div>
            <div className="text-sm text-muted-foreground">
              Countries Served
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">98%</div>
            <div className="text-sm text-muted-foreground">
              Customer Satisfaction
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
