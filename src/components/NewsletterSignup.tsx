
import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate subscription
    setIsSubscribed(true);
    toast({
      title: "Successfully subscribed!",
      description: "You'll receive our latest health insurance insights in your inbox.",
    });
    setEmail("");
  };

  if (isSubscribed) {
    return (
      <section className="py-16 px-4 bg-[#20466d]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-[#22aee1]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">You're all set!</h2>
          <p className="text-[#22aee1] text-lg">
            Thank you for subscribing to our newsletter. You'll receive the latest insights directly in your inbox.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#20466d]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-[#22aee1]" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Stay Informed</h2>
        <p className="text-[#22aee1] text-lg mb-8 max-w-2xl mx-auto">
          Get the latest health insurance insights, policy updates, and analysis 
          delivered directly to your inbox.
        </p>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-center border-[#79858D] focus:border-[#22aee1] focus:ring-[#22aee1]"
              />
              <Button type="submit" className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                Subscribe to Newsletter
              </Button>
            </form>
            <p className="text-xs text-[#79858D] mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSignup;
