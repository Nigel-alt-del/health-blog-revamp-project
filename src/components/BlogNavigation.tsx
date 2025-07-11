
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminAccess from "./AdminAccess";

const BlogNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#20466d]">
                Healthcare Insights
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-8">
              <Link 
                to="/" 
                className="text-[#79858D] hover:text-[#20466d] px-3 py-2 text-sm font-medium transition-colors"
              >
                HOME
              </Link>
              <Link 
                to="/about" 
                className="text-[#79858D] hover:text-[#20466d] px-3 py-2 text-sm font-medium transition-colors"
              >
                ABOUT
              </Link>
              <Link 
                to="/calculators" 
                className="text-[#79858D] hover:text-[#20466d] px-3 py-2 text-sm font-medium transition-colors"
              >
                CALCULATORS
              </Link>
            </div>
            
            {/* Admin Access - Discreet settings icon */}
            <AdminAccess />
          </div>

          {/* Mobile menu button and admin access */}
          <div className="md:hidden flex items-center space-x-2">
            <AdminAccess />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#79858D] hover:text-[#20466d] inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#22aee1]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link 
              to="/" 
              className="text-[#79858D] hover:text-[#20466d] block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </Link>
            <Link 
              to="/about" 
              className="text-[#79858D] hover:text-[#20466d] block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link 
              to="/calculators" 
              className="text-[#79858D] hover:text-[#20466d] block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              CALCULATORS
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BlogNavigation;
