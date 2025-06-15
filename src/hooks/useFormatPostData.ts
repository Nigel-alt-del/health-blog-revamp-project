
import { useCallback } from "react";
import { type BlogPost } from "@/types/blog";

interface FormatArgs {
  savedDraftId: string | null;
  isEditMode: boolean;
  initialPost?: BlogPost | null;
  generateId: (title: string) => string;
}

export const useFormatPostData = ({ savedDraftId, isEditMode, initialPost, generateId }: FormatArgs) => {
  return useCallback(
    (data: any, isDraft: boolean = false) => {
      const commonData = {
        id: savedDraftId || (isEditMode ? initialPost?.id : generateId(data.title)),
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
        image: data.image,
        imageSize: data.imageSize,
        metaDescription: data.excerpt,
        isDraft: isDraft,
      };

      if (isEditMode && initialPost) {
        return {
          ...commonData,
          publishedAt: initialPost.publishedAt,
          readTime: initialPost.readTime || "5 min read",
          featured: initialPost.featured || false,
          author: initialPost.author || "InsureMyHealth Team",
          authorRole: initialPost.authorRole || "Healthcare Policy Analyst",
          authorLinkedin: initialPost.authorLinkedin || "",
          authorBio: initialPost.authorBio || "",
          seoKeywords: (initialPost as any).seoKeywords || "",
        };
      }

      return {
        ...commonData,
        publishedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        readTime: "5 min read",
        featured: false,
        author: "InsureMyHealth Team",
        authorRole: "Healthcare Policy Analyst",
        authorLinkedin: "",
        authorBio: "",
        seoKeywords: "",
      };
    },
    [savedDraftId, isEditMode, initialPost, generateId]
  );
};
