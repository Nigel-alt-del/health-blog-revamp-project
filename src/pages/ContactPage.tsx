
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogLayout from "@/components/BlogLayout";
import ContactForm from "@/components/ContactForm";

const ContactPage = () => {
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-[#22aee1] hover:text-[#20466d] mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Link>
          
          <h1 className="text-4xl font-bold text-[#20466d] mb-4">Contact Us</h1>
          <p className="text-xl text-[#79858D]">
            Get expert insights and analysis on employee benefits and health insurance policies.
          </p>
        </div>

        <ContactForm />
      </div>
    </BlogLayout>
  );
};

export default ContactPage;
