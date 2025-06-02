
import BlogNavigation from "./BlogNavigation";
import ContactSection from "./ContactSection";
import BlogFooter from "./BlogFooter";
import { useScrollToTop } from "../hooks/useScrollToTop";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white">
      <BlogNavigation />
      <main>{children}</main>
      <ContactSection />
      <BlogFooter />
    </div>
  );
};

export default BlogLayout;
