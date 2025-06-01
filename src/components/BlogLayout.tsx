import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Search, Menu, Settings, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogLayoutProps {
  children: ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about" },
    { name: "Our Expertise", href: "/expertise" },
    { name: "Calculators", href: "/calculators" },
    { name: "Compliance Tools", href: "/compliance-tools" },
    { name: "Contact", href: "/contact" },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  const ContactPage = () => (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <section 
        className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(32, 70, 109, 0.8), rgba(32, 70, 109, 0.8)), url('/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Contact <span className="text-[#22aee1]">Us</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get in touch with our team for inquiries about our reports or InsureMyHealth services
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="text-center p-8 border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#22aee1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d] text-2xl mb-4">Reports & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D] mb-6">
                  Questions about our health insurance reports, analysis, or want to contribute insights?
                </p>
                <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                  Contact Reports Team
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
                  Need help with health insurance comparison, quotes, or our main services?
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
    </div>
  );

  if (location.pathname === '/contact') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#20466d] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IMH</span>
                </div>
                <div>
                  <h1 className="font-bold text-xl text-[#20466d]">InsureMyHealth</h1>
                  <p className="text-sm text-[#79858D]">Health Insurance Insights</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-[#22aee1] ${
                      isActive(item.href) ? "text-[#22aee1]" : "text-[#20466d]"
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
                        className={`text-lg font-medium transition-colors hover:text-[#22aee1] ${
                          isActive(item.href) ? "text-[#22aee1]" : "text-[#20466d]"
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

        <ContactPage />

        {/* Footer */}
        <footer className="bg-[#20466d] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#22aee1] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">IMH</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">InsureMyHealth Reports</h3>
                    <p className="text-[#22aee1]">Health Insurance Insights</p>
                  </div>
                </div>
                <p className="text-gray-300 max-w-md">
                  Providing analysis and insights on health insurance trends, 
                  policy changes, and best practices for consumers and industry professionals.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/category/health-policy" className="hover:text-[#22aee1]">Healthcare</Link></li>
                  <li><Link to="/category/insurance-tips" className="hover:text-[#22aee1]">PMI Insights</Link></li>
                  <li><Link to="/category/industry-news" className="hover:text-[#22aee1]">Industry News</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/contact" className="hover:text-[#22aee1]">Contact Us</Link></li>
                  <li><a href="https://insure-health-made-simple.lovable.app/" className="hover:text-[#22aee1]">Main Website</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-[#79858D] mt-8 pt-8 text-center text-gray-300">
              <p>&copy; 2024 InsureMyHealth. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#20466d] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IMH</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-[#20466d]">InsureMyHealth</h1>
                <p className="text-sm text-[#79858D]">UK Health Insurance Insights</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-[#22aee1] ${
                    isActive(item.href) ? "text-[#22aee1]" : "text-[#20466d]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
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
                      className={`text-lg font-medium transition-colors hover:text-[#22aee1] ${
                        isActive(item.href) ? "text-[#22aee1]" : "text-[#20466d]"
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
      <footer className="bg-[#20466d] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#22aee1] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IMH</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">InsureMyHealth Reports</h3>
                  <p className="text-[#22aee1]">UK Health Insurance Insights</p>
                </div>
              </div>
              <p className="text-gray-300 max-w-md">
                Empowering UK SMEs with expert health insurance analysis, interactive tools, 
                and practical guidance for informed decision-making.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools & Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/calculators" className="hover:text-[#22aee1]">Cost Calculators</Link></li>
                <li><Link to="/compliance-tools" className="hover:text-[#22aee1]">Compliance Tools</Link></li>
                <li><Link to="/expertise" className="hover:text-[#22aee1]">Our Expertise</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/about" className="hover:text-[#22aee1]">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#22aee1]">Contact</Link></li>
                <li><a href="https://insure-health-made-simple.lovable.app/" className="hover:text-[#22aee1]">InsureMyHealth Platform</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#79858D] mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 InsureMyHealth. All rights reserved. | Empowering UK SMEs with health insurance expertise.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
