
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Search, 
  BookOpen,
  Calculator,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const resources = [
    {
      id: 1,
      title: "UK SME Health Insurance Buyer's Guide 2024",
      description: "Comprehensive guide covering everything SMEs need to know about purchasing health insurance in the UK.",
      type: "guide",
      category: "Insurance Basics",
      downloadCount: "2,847",
      pages: 45,
      format: "PDF"
    },
    {
      id: 2,
      title: "Health Insurance Market Report Q4 2024",
      description: "Latest market analysis including pricing trends, new products, and regulatory updates affecting UK SMEs.",
      type: "report",
      category: "Market Intelligence",
      downloadCount: "3,421",
      pages: 28,
      format: "PDF"
    }
  ];

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'report': return TrendingUp;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <BlogLayout>
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(32, 70, 109, 0.8), rgba(32, 70, 109, 0.8)), url('/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Resource <span className="text-[#22aee1]">Library</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Practical guides and tools to help UK SMEs navigate health insurance decisions
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#79858D] h-5 w-5" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-[#79858D] focus:border-[#22aee1] focus:ring-[#22aee1]"
            />
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {filteredResources.map((resource) => {
              const IconComponent = getTypeIcon(resource.type);
              return (
                <Card key={resource.id} className="border-[#79858D]/20 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#22aee1] rounded-lg flex items-center justify-centre">
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-[#20466d] text-lg">{resource.title}</CardTitle>
                    <p className="text-[#79858D] text-sm">{resource.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-[#79858D]">
                        <span>{resource.pages} pages • {resource.format}</span>
                        <span>{resource.downloadCount} downloads</span>
                      </div>
                      <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                        <Download className="mr-2 h-4 w-4" />
                        Download Free
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#20466d] mb-4">Looking for Interactive Tools?</h3>
            <p className="text-lg text-[#79858D] mb-8">
              Try our calculators and compliance tools for personalised insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-centre">
              <Button asChild size="lg" className="bg-[#22aee1] hover:bg-[#20466d]">
                <Link to="/calculators">
                  Try Calculators <Calculator className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/compliance-tools">
                  Compliance Tools <FileText className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default ResourcesPage;
