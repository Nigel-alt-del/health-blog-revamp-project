
import { Link } from "react-router-dom";

const BlogFooter = () => {
  return (
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
              <li><Link to="/category/pmi-insights" className="hover:text-[#22aee1] transition-colors">PMI Insights</Link></li>
              <li><Link to="/category/healthcare" className="hover:text-[#22aee1] transition-colors">Healthcare</Link></li>
              <li><Link to="/category/digital-health" className="hover:text-[#22aee1] transition-colors">Digital Health</Link></li>
              <li><Link to="/category/mental-health" className="hover:text-[#22aee1] transition-colors">Mental Health</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="https://insure-health-made-simple.lovable.app/cookies-policy" target="_blank" rel="noopener noreferrer" className="hover:text-[#22aee1] transition-colors">Cookies</a></li>
              <li><a href="https://insure-health-made-simple.lovable.app/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-[#22aee1] transition-colors">Terms</a></li>
              <li><a href="https://insure-health-made-simple.lovable.app/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-[#22aee1] transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 InsureMyHealth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
