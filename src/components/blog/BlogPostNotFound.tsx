
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPostNotFoundProps {
  slug?: string;
  cameFromAdmin: boolean;
}

export const BlogPostNotFound = ({ slug, cameFromAdmin }: BlogPostNotFoundProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-[#20466d] mb-4">Report Not Found</h1>
      <p className="text-[#79858D] mb-4">The report you're looking for doesn't exist or may have been moved.</p>
      <p className="text-sm text-[#79858D] mb-8">Searched for: {slug}</p>
      {cameFromAdmin ? (
        <Link to="/admin">
          <Button className="bg-[#22aee1] hover:bg-[#20466d]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </Link>
      ) : (
        <Link to="/">
          <Button className="bg-[#22aee1] hover:bg-[#20466d]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </Link>
      )}
    </div>
  );
};
