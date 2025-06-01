
import BlogNavigation from "./BlogNavigation";
import ContactSection from "./ContactSection";
import BlogFooter from "./BlogFooter";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
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
