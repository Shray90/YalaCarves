import { Check, Award, Users, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Award,
      title: "Master Craftsmen",
      description:
        "Our artisans have honed their skills over decades, carrying forward ancient traditions.",
    },
    {
      icon: Heart,
      title: "Passionate Creation",
      description:
        "Every piece is crafted with love and dedication to preserve Nepali heritage.",
    },
    {
      icon: Users,
      title: "Family Legacy",
      description:
        "Techniques passed down through generations of skilled woodworking families.",
    },
  ];

  const values = [
    "100% authentic handcrafted pieces",
    "Sustainable sourcing practices",
    "Supporting local artisan communities",
    "Preserving traditional techniques",
    "Quality guaranteed craftsmanship",
    "Worldwide shipping available",
  ];

  return (
    <section className="py-20 bg-wood-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Preserving Nepal's
                <span className="text-primary block">Ancient Art</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For over five decades, Yala Carves has been at the forefront of
                preserving and promoting the traditional art of Nepali wood
                carving. Our journey began in the historic city of Patan, where
                master craftsmen have been creating magnificent wooden
                sculptures for centuries.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each piece in our collection is not just a decorative item, but
                a testament to the rich cultural heritage of Nepal. From
                intricate religious sculptures to elaborate architectural
                panels, our artisans breathe life into wood, creating timeless
                pieces that connect the past with the present.
              </p>
            </div>

            {/* Values List */}
            <div className="space-y-3">
              {values.map((value, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            {/* Image placeholder */}
            <div className="aspect-square bg-gradient-to-br from-wood-200 to-wood-400 rounded-2xl p-8 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-wood-500 to-wood-700 rounded-xl flex items-center justify-center text-wood-50">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🏛️</div>
                  <div className="text-lg font-semibold">
                    Traditional Workshop
                  </div>
                  <div className="text-sm opacity-80">Patan, Nepal</div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-background rounded-lg shadow-sm border border-border/50"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
