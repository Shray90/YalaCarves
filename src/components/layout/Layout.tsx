// Main layout wrapper component for the Yala Carves application
// Provides consistent header and footer across all pages with flexible content area
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

// TypeScript interface for layout component props
interface LayoutProps {
  children: ReactNode;
}

// Layout component that wraps all pages with header and footer
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
