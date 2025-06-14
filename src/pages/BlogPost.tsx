
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import BlogLayout from "@/components/BlogLayout";
import { type BlogPost as BlogPostType } from "@/utils/localStorage";
import { loadAllPosts, getPostById } from "@/utils/postManager";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostImage } from "@/components/blog/BlogPostImage";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogPostNotFound } from "@/components/blog/BlogPostNotFound";
import { useBlogPostActions } from "@/hooks/useBlogPostActions";

const BlogPost = () => {
  const { slug } = useParams();
  const { handleShare, handleBookmark } = useBlogPostActions();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load posts using centralized function
  useEffect(() => {
    if (slug) {
      console.log("BlogPost - Loading post for slug:", slug);
      
      // CRITICAL FIX: Check for admin view flags and force refresh
      const forceRefresh = sessionStorage.getItem('forceRefresh');
      const viewFromAdmin = sessionStorage.getItem('viewFromAdmin');
      
      if (forceRefresh || viewFromAdmin === slug) {
        console.log("BlogPost - Force refreshing post data from admin for:", slug);
        // Clear the flags after use
        sessionStorage.removeItem('forceRefresh');
        if (viewFromAdmin === slug) {
          sessionStorage.removeItem('viewFromAdmin');
        }
      }
      
      // Load the specific post using centralized function
      const foundPost = getPostById(slug);
      console.log("BlogPost - Found post:", foundPost);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Load related posts
        const allPosts = loadAllPosts();
        const related = allPosts
          .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
          .slice(0, 3);
        setRelatedPosts(related);
      }
      
      setIsLoading(false);
    }
  }, [slug]);
  
  // Check if user came from admin
  const cameFromAdmin = document.referrer.includes('/admin') || 
                        sessionStorage.getItem('cameFromAdmin') === 'true';

  if (isLoading) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-[#20466d] mb-4">Loading Report...</h1>
          <p className="text-[#79858D] mb-8">Please wait while we load the report content.</p>
        </div>
      </BlogLayout>
    );
  }

  if (!post) {
    console.error("BlogPost - Post not found for slug:", slug);
    
    return (
      <BlogLayout>
        <BlogPostNotFound slug={slug} cameFromAdmin={cameFromAdmin} />
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <BlogPostHeader 
          post={post}
          cameFromAdmin={cameFromAdmin}
          onShare={() => handleShare(post)}
          onBookmark={() => handleBookmark(post)}
        />

        <BlogPostImage post={post} />

        <BlogPostContent post={post} />

        <Separator className="my-12" />

        <RelatedPosts relatedPosts={relatedPosts} />
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
