
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calculator, Users, TrendingUp, FileText, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const getHeroTitle = () => {
    const path = location.pathname;
    if (path.includes('/category/healthcare')) return 'Healthcare Intelligence';
    if (path.includes('/category/pmi-insights')) return 'Private Medical Insurance Intelligence';
    if (path.includes('/category/industry-news')) return 'Industry News';
    if (path.includes('/about')) return 'About Insure My Health';
    return 'The Health Compass';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png" 
                  alt="The Health Compass Logo" 
                  className="h-10 w-auto mr-3"
                />
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

      <main>{children}</main>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="text-center p-8 border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#22aee1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d] text-2xl mb-4">Analysis & Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D] mb-6">
                  Get insights on employee benefits analysis, information, or need guidance?
                </p>
                <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                  Contact Information Team
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#20466d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d] text-2xl mb-4">InsureMyHealth Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D] mb-6">
                  Ready to compare and purchase employee benefits packages?
                </p>
                <Button 
                  className="w-full bg-[#20466d] hover:bg-[#22aee1]"
                  onClick={() => window.open('https://insure-health-made-simple.lovable.app/', '_blank')}
                >
                  Visit InsureMyHealth
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#20466d] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#22aee1]">InsureMyHealth</h3>
              <p className="text-gray-300 text-sm">
                Your trusted source for UK employee benefits intelligence and market analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-[#22aee1] transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-[#22aee1] transition-colors">About</Link></li>
                <li><Link to="/calculators" className="hover:text-[#22aee1] transition-colors">Calculators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/category/healthcare" className="hover:text-[#22aee1] transition-colors">Healthcare</Link></li>
                <li><Link to="/category/pmi-insights" className="hover:text-[#22aee1] transition-colors">PMI Insights</Link></li>
                <li><Link to="/category/industry-news" className="hover:text-[#22aee1] transition-colors">Industry News</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://insure-health-made-simple.lovable.app/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-[#22aee1] transition-colors">Cookies</a></li>
                <li><a href="https://insure-health-made-simple.lovable.app/terms" target="_blank" rel="noopener noreferrer" className="hover:text-[#22aee1] transition-colors">Terms</a></li>
                <li><a href="https://insure-health-made-simple.lovable.app/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-[#22aee1] transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 InsureMyHealth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
