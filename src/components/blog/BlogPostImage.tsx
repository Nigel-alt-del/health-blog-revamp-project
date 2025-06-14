
import { type BlogPost } from "@/utils/localStorage";

interface BlogPostImageProps {
  post: BlogPost;
}

export const BlogPostImage = ({ post }: BlogPostImageProps) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-[#22aee1] to-[#20466d] rounded-lg mb-12 flex items-center justify-center">
      {post.image && post.image !== "/placeholder.svg" ? (
        <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-[#20466d] font-bold text-xl">IMH</span>
          </div>
          <p className="text-white font-medium">{post.category}</p>
        </div>
      )}
    </div>
  );
};
