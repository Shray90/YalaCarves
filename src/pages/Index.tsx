// Main homepage component for Yala Carves e-commerce platform
// Combines hero section, featured products, about section, and customer testimonials
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";

// Index page component serving as the main landing page
const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProducts />
      <About />
      <Testimonials />
    </Layout>
  );
};

export default Index;
