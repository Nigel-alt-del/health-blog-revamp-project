
import BlogCard from "@/components/BlogCard";
import { type BlogPostSummary } from "@/types/blog";

interface RelatedPostsProps {
  relatedPosts: BlogPostSummary[];
}

export const RelatedPosts = ({ relatedPosts }: RelatedPostsProps) => {
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-[#20466d] mb-8">Related Reports</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((relatedPost) => (
          <BlogCard key={relatedPost.id} post={relatedPost} />
        ))}
      </div>
    </section>
  );
};
