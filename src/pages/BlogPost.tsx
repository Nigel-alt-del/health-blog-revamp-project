
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import BlogLayout from "@/components/BlogLayout";
import { type BlogPost as BlogPostType, type BlogPostSummary } from "@/types/blog";
import { getPostById, loadAllPosts } from "@/utils/postManager";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostImage } from "@/components/blog/BlogPostImage";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogPostNotFound } from "@/components/blog/BlogPostNotFound";
import { useBlogPostActions } from "@/hooks/useBlogPostActions";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { handleShare, handleBookmark } = useBlogPostActions();
  const queryClient = useQueryClient();

  // Use cache for the posts list if available
  const initialAllPosts = queryClient.getQueryData<BlogPostSummary[]>(['posts']);

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostById(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allPosts = [] } = useQuery<BlogPostSummary[]>({
    queryKey: ['posts'],
    queryFn: loadAllPosts,
    staleTime: 5 * 60 * 1000,
    initialData: initialAllPosts,
  });

  const relatedPosts = post
    ? allPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3)
    : [];
  
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

