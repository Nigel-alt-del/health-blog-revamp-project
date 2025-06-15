
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loadAllPosts, getPostById } from "@/utils/postManager";
import { type BlogPost, type BlogPostSummary } from "@/types/blog";

/**
 * Hook for loading all blog post summaries.
 */
export function useAllPosts() {
  return useQuery<BlogPostSummary[], Error>({
    queryKey: ['posts'],
    queryFn: loadAllPosts,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for loading a single blog post by id.
 */
export function useSinglePost(postId: string | null) {
  return useQuery<BlogPost | undefined, Error>({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
}
