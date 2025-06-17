
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ContactSection = () => {
  const handleContactClick = () => {
    // Ensure we scroll to top when navigating to contact page
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">Get In Touch</h2>
        <div className="flex justify-center">
          <Card className="text-center p-8 border-[#79858D]/20 hover:shadow-lg transition-shadow max-w-md">
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
              <Link to="/contact" onClick={handleContactClick}>
                <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                  Contact Information Team
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
