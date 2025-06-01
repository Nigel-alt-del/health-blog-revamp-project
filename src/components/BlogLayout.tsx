
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface BlogLayoutProps {
  children: ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Health Policy", href: "/category/health-policy" },
    { name: "Insurance Tips", href: "/category/insurance-tips" },
    { name: "Industry News", href: "/category/industry-news" },
    { name: "About", href: "/about", icon: User },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IH</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">InsureMyHealth</h1>
                <p className="text-sm text-gray-500">Expert Insights</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive(item.href) ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`text-lg font-medium transition-colors hover:text-blue-600 ${
                        isActive(item.href) ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IH</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">InsureMyHealth Blog</h3>
                  <p className="text-gray-400">Expert Health Insurance Insights</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Providing expert analysis and insights on health insurance trends, 
                policy changes, and best practices for consumers and industry professionals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/category/health-policy" className="hover:text-white">Health Policy</Link></li>
                <li><Link to="/category/insurance-tips" className="hover:text-white">Insurance Tips</Link></li>
                <li><Link to="/category/industry-news" className="hover:text-white">Industry News</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><a href="https://insure-health-made-simple.lovable.app/" className="hover:text-white">Main Website</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InsureMyHealth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
