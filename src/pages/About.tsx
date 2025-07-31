import Layout from "@/components/layout/Layout";
import { Award, Users, Heart, Globe } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Preserving the ancient art of Nepali wood carving for over five
            decades, connecting traditional craftsmanship with the modern world.
          </p>
        </div>

        {/* Content sections will be implemented later */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Master Craftsmen</h3>
            <p className="text-muted-foreground">
              Skilled artisans with decades of experience
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Cultural Heritage</h3>
            <p className="text-muted-foreground">
              Preserving traditional techniques and stories
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Community Support</h3>
            <p className="text-muted-foreground">
              Supporting local artisan families
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Global Reach</h3>
            <p className="text-muted-foreground">
              Sharing Nepali art with the world
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            More content coming soon... This page will be expanded with detailed
            information about our history, artisans, and mission.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
