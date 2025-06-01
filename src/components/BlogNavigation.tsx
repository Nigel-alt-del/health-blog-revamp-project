
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const BlogNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    console.log("Logo failed to load from: /lovable-uploads/136e3191-2c26-49ed-a729-90454a8efcce.png");
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log("Logo loaded successfully");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {!logoError ? (
                <img 
                  src="/lovable-uploads/136e3191-2c26-49ed-a729-90454a8efcce.png" 
                  alt="InsureMyHealth Logo" 
                  className="h-10 w-auto mr-3"
                  onError={handleLogoError}
                  onLoad={handleLogoLoad}
                />
              ) : (
                <div className="h-10 w-10 bg-[#20466d] rounded mr-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IMH</span>
                </div>
              )}
              <span className="text-2xl font-bold text-[#20466d]">
                The Health Compass
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                to="/" 
                className="text-[#79858D] hover:text-[#20466d] px-3 py-2 text-sm font-medium transition-colors"
              >
                HOME
              </Link>
              <Link 
                to="/category/healthcare" 
                className="text-[#79858D] hover:text-[#20466d] px-3 py-2 text-sm font-medium transition-colors"
              >
                HEALTHCARE
              </Link>
              <Link 
                to="/category/pmi-insights" 
                className="text-[#79858D] hover:text-[#20466d] px-3 py-2 text-sm font-medium transition-colors"
              >
                PMI INSIGHTS
              </Link>
              <Link 
                to="/category/industry-news" 
                className="text-[#79858D] hover:text-[#20466d] px-3 py-2 text-sm font-medium transition-colors"
              >
                INDUSTRY NEWS
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
              to="/category/healthcare" 
              className="text-[#79858D] hover:text-[#20466d] block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              HEALTHCARE
            </Link>
            <Link 
              to="/category/pmi-insights" 
              className="text-[#79858D] hover:text-[#20466d] block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              PMI INSIGHTS
            </Link>
            <Link 
              to="/category/industry-news" 
              className="text-[#79858D] hover:text-[#20466d] block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              INDUSTRY NEWS
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
