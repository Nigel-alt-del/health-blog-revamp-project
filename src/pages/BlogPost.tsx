
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  
  // Optimized post loading with better error handling
  useEffect(() => {
    const loadPostData = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      console.log("BlogPost - Loading post for slug:", slug);
      
      try {
        // Check for admin view flags
        const forceRefresh = sessionStorage.getItem('forceRefresh');
        const viewFromAdmin = sessionStorage.getItem('viewFromAdmin');
        
        if (forceRefresh || viewFromAdmin === slug) {
          console.log("BlogPost - Force refreshing from admin for:", slug);
          sessionStorage.removeItem('forceRefresh');
          if (viewFromAdmin === slug) {
            sessionStorage.removeItem('viewFromAdmin');
          }
        }
        
        // Parallel loading for better performance
        const [foundPost, allPosts] = await Promise.all([
          getPostById(slug),
          loadAllPosts(true) // Use cache for related posts
        ]);
        
        console.log("BlogPost - Found post:", foundPost);
        
        if (foundPost) {
          setPost(foundPost);
          
          // Find related posts efficiently
          const related = allPosts
            .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("BlogPost - Error loading post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPostData();
  }, [slug]);
  
  // Check if user came from admin
  const cameFromAdmin = document.referrer.includes('/admin') || 
                        sessionStorage.getItem('cameFromAdmin') === 'true';

  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <BlogLayout>
        <LoadingSkeleton />
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
