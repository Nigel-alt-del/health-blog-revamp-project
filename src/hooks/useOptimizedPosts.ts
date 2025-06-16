
import { useQuery } from "@tanstack/react-query";
import { loadPostsPaginated, loadPostSummaries } from "@/utils/optimizedPostManager";
import { getPostById } from "@/utils/postManager";
import { type BlogPost, type BlogPostSummary } from "@/types/blog";

/**
 * Optimized hooks for better performance and reduced data usage
 */

export function useOptimizedPosts(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['posts-paginated', page, limit],
    queryFn: () => loadPostsPaginated({ page, limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
  });
}

export function usePostSummaries() {
  return useQuery<BlogPostSummary[], Error>({
    queryKey: ['post-summaries'],
    queryFn: loadPostSummaries,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useOptimizedPost(postId: string | null) {
  return useQuery<BlogPost | undefined, Error>({
    queryKey: ['post-optimized', postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
}
