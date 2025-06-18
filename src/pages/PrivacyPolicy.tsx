import BlogLayout from "@/components/BlogLayout";

const PrivacyPolicy = () => {
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#20466d] mb-8">Privacy Policy</h1>
          {/* Paste your Termly privacy policy HTML content here */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-[#79858D] text-center">
              Please paste your Termly privacy policy HTML content here to replace this placeholder.
            </p>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default PrivacyPolicy;
