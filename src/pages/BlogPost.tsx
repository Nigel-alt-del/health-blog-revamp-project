
import { useParams, Link } from "react-router-dom";
import { Clock, User, ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlogLayout from "@/components/BlogLayout";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.id === slug);
  
  if (!post) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </BlogLayout>
    );
  }

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <BlogLayout>
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.authorRole}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </span>
              <span>{post.publishedAt}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Bookmark
            </Button>
          </div>
        </div>

        {/* Featured Image Placeholder */}
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">IH</span>
            </div>
            <p className="text-blue-700 font-medium">{post.category}</p>
          </div>
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Author Bio */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{post.author}</CardTitle>
                <p className="text-gray-600">{post.authorRole}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {post.author} is a leading expert in health insurance policy and consumer advocacy. 
              With over a decade of experience in the healthcare industry, they provide insights 
              that help consumers navigate the complex world of health insurance.
            </p>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
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
