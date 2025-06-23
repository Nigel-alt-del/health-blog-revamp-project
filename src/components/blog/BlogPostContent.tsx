
import { ChunkedContent } from "@/components/ChunkedContent";
import { type BlogPost } from "@/types/blog";

interface BlogPostContentProps {
  post: BlogPost;
}

export const BlogPostContent = ({ post }: BlogPostContentProps) => {
  return (
    <div className="mb-12">
      <ChunkedContent 
        content={post.content}
        chunkSize={3000}
        showProgress={true}
      />
    </div>
  );
};
