import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BlogLayout from "@/components/BlogLayout";
import BlogCard from "@/components/BlogCard";
import { getStoredPosts, type BlogPost } from "@/utils/localStorage";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  
  // Load posts from localStorage on component mount
  useEffect(() => {
    console.log("Loading posts in BlogPost");
    const storedPosts = getStoredPosts();
    console.log("Stored posts:", storedPosts);
    
    // Convert blogPosts to match our simplified BlogPost interface - safely handle optional properties
    const simplifiedBlogPosts = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      category: post.category,
      tags: post.tags,
      featured: post.featured,
      image: post.image,
      seoKeywords: (post as any).seoKeywords || '',
      metaDescription: (post as any).metaDescription || post.excerpt
    }));

    if (storedPosts.length > 0) {
      const combinedPosts = [
        ...storedPosts,
        ...simplifiedBlogPosts.filter(p => !storedPosts.some(sp => sp.id === p.id))
      ];
      setAllPosts(combinedPosts);
    } else {
      setAllPosts(simplifiedBlogPosts);
    }
  }, []);

  const post = allPosts.find(p => p.id === slug);
  
  // Check if user came from admin
  const cameFromAdmin = document.referrer.includes('/admin') || 
                        sessionStorage.getItem('cameFromAdmin') === 'true';
  
  if (!post) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-[#20466d] mb-4">Report Not Found</h1>
          <p className="text-[#79858D] mb-8">The report you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="bg-[#22aee1] hover:bg-[#20466d]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </Link>
        </div>
      </BlogLayout>
    );
  }

  const handleShare = async () => {
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

  const handleBookmark = () => {
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

  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <BlogLayout>
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          {cameFromAdmin ? (
            <Link 
              to="/admin" 
              className="inline-flex items-center text-[#22aee1] hover:text-[#20466d] mb-6"
              onClick={() => sessionStorage.removeItem('cameFromAdmin')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          ) : (
            <Link to="/" className="inline-flex items-center text-[#22aee1] hover:text-[#20466d] mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Link>
          )}
          
          <Badge variant="secondary" className="mb-4 bg-[#22aee1] text-white">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl font-bold text-[#20466d] mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-sm text-[#79858D] mb-8">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </span>
            <span>{post.publishedAt}</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#22aee1] text-[#22aee1] hover:bg-[#22aee1] hover:text-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#22aee1] text-[#22aee1] hover:bg-[#22aee1] hover:text-white"
              onClick={handleBookmark}
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Bookmark
            </Button>
          </div>
        </div>

        {/* Featured Image */}
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

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 prose-headings:text-[#20466d] prose-a:text-[#22aee1] prose-strong:text-[#20466d]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags at the end */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-[#22aee1] text-[#22aee1]">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-[#20466d] mb-8">Related Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
