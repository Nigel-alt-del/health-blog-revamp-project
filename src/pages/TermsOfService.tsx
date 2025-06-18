
import BlogLayout from "@/components/BlogLayout";

const TermsOfService = () => {
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#20466d] mb-8">Terms of Service</h1>
          {/* Paste your Termly terms of service HTML content here */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-[#79858D] text-center">
              Please paste your Termly terms of service HTML content here to replace this placeholder.
            </p>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default TermsOfService;
