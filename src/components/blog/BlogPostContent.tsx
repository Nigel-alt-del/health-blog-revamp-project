
import { Badge } from "@/components/ui/badge";
import { type BlogPost } from "@/utils/localStorage";

interface BlogPostContentProps {
  post: BlogPost;
}

export const BlogPostContent = ({ post }: BlogPostContentProps) => {
  return (
    <>
      <div 
        className="prose prose-lg prose-headings:text-[#20466d] prose-a:text-[#22aee1] prose-strong:text-[#20466d] mb-12 font-montserrat"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="border-[#22aee1] text-[#22aee1]">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
};
