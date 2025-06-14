
import { useToast } from "@/hooks/use-toast";

export const useBlogPostActions = () => {
  const { toast } = useToast();

  const handleShare = async (post: { title: string; excerpt: string }) => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "The report has been shared."
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Report link has been copied to clipboard."
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to share or copy link.",
          variant: "destructive"
        });
      }
    }
  };

  const handleBookmark = (post: { id: string; title: string }) => {
    try {
      // Save to localStorage
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedReports') || '[]');
      const isBookmarked = bookmarks.some((b: any) => b.id === post.id);
      
      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter((b: any) => b.id !== post.id);
        localStorage.setItem('bookmarkedReports', JSON.stringify(updatedBookmarks));
        toast({
          title: "Bookmark removed",
          description: "Report has been removed from bookmarks."
        });
      } else {
        bookmarks.push({ id: post.id, title: post.title, url: window.location.href });
        localStorage.setItem('bookmarkedReports', JSON.stringify(bookmarks));
        toast({
          title: "Bookmarked",
          description: "Report has been added to bookmarks."
        });
      }
    } catch (error) {
      toast({
        title: "Bookmark failed",
        description: "Unable to bookmark this report.",
        variant: "destructive"
      });
    }
  };

  return { handleShare, handleBookmark };
};
