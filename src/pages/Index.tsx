import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";

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
