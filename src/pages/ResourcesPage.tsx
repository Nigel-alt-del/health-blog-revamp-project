
import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  BookOpen,
  Calculator,
  Shield,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const resources = [
    {
      id: 1,
      title: "UK SME Health Insurance Buyer's Guide 2024",
      description: "Comprehensive 45-page guide covering everything SMEs need to know about purchasing health insurance in the UK.",
      type: "guide",
      category: "Insurance Basics",
      downloadCount: "2,847",
      pages: 45,
      format: "PDF",
      featured: true
    },
    {
      id: 2,
      title: "PMI Tax Compliance Checklist",
      description: "Essential checklist ensuring your private medical insurance benefits comply with HMRC requirements.",
      type: "checklist",
      category: "Compliance",
      downloadCount: "1,923",
      pages: 8,
      format: "PDF",
      featured: false
    },
    {
      id: 3,
      title: "Employee Benefits Communication Templates",
      description: "Ready-to-use email templates and materials to communicate health insurance benefits to your team.",
      type: "template",
      category: "HR Resources",
      downloadCount: "1,654",
      pages: 12,
      format: "Word/PDF",
      featured: false
    },
    {
      id: 4,
      title: "Health Insurance Market Report Q4 2024",
      description: "Latest market analysis including pricing trends, new products, and regulatory updates affecting UK SMEs.",
      type: "report",
      category: "Market Intelligence",
      downloadCount: "3,421",
      pages: 28,
      format: "PDF",
      featured: true
    },
    {
      id: 5,
      title: "Cost-Benefit Analysis Spreadsheet",
      description: "Excel template to calculate the true cost and benefits of different health insurance options for your business.",
      type: "calculator",
      category: "Financial Planning",
      downloadCount: "987",
      pages: 1,
      format: "Excel",
      featured: false
    },
    {
      id: 6,
      title: "Regulatory Compliance Calendar 2024",
      description: "Important dates and deadlines for health insurance compliance, P11D submissions, and regulatory changes.",
      type: "calendar",
      category: "Compliance",
      downloadCount: "2,156",
      pages: 4,
      format: "PDF",
      featured: false
    }
  ];

  const webinars = [
    {
      id: 1,
      title: "Health Insurance Trends for UK SMEs in 2024",
      speaker: "Sarah Mitchell, Health Insurance Analyst",
      duration: "45 minutes",
      date: "Available On-Demand",
      description: "Comprehensive overview of market trends, pricing changes, and what SMEs should expect in 2024.",
      featured: true
    },
    {
      id: 2,
      title: "Navigating PMI Tax Implications",
      speaker: "David Thompson, Tax Specialist",
      duration: "30 minutes",
      date: "Available On-Demand",
      description: "Deep dive into benefit-in-kind taxation, P11D reporting, and compliance requirements.",
      featured: false
    },
    {
      id: 3,
      title: "Building Cost-Effective Employee Benefits",
      speaker: "Emma Roberts, Benefits Consultant",
      duration: "60 minutes",
      date: "Live: Dec 15, 2024",
      description: "Strategies for creating attractive benefits packages while managing costs effectively.",
      featured: false
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
      case 'checklist': return CheckCircle;
      case 'template': return FileText;
      case 'report': return TrendingUp;
      case 'calculator': return Calculator;
      case 'calendar': return Shield;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'checklist': return 'bg-green-100 text-green-800';
      case 'template': return 'bg-purple-100 text-purple-800';
      case 'report': return 'bg-orange-100 text-orange-800';
      case 'calculator': return 'bg-yellow-100 text-yellow-800';
      case 'calendar': return 'bg-red-100 text-red-800';
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
            Practical guides, templates, and tools to help UK SMEs navigate health insurance decisions
          </p>
        </div>
      </section>

      {/* Search and Filter */}
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

      {/* Resources Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="downloads" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
              <TabsTrigger value="downloads" className="flex items-center gap-2 p-4">
                <Download className="h-4 w-4" />
                Downloads & Guides
              </TabsTrigger>
              <TabsTrigger value="webinars" className="flex items-center gap-2 p-4">
                <Users className="h-4 w-4" />
                Webinars & Videos
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2 p-4">
                <Calculator className="h-4 w-4" />
                Interactive Tools
              </TabsTrigger>
            </TabsList>

            {/* Downloads & Guides */}
            <TabsContent value="downloads">
              <div className="space-y-8">
                {/* Featured Resources */}
                <div>
                  <h2 className="text-2xl font-bold text-[#20466d] mb-6">Featured Resources</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredResources.filter(resource => resource.featured).map((resource) => {
                      const IconComponent = getTypeIcon(resource.type);
                      return (
                        <Card key={resource.id} className="border-[#22aee1]/30 shadow-lg">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#22aee1] rounded-lg flex items-center justify-center">
                                  <IconComponent className="h-5 w-5 text-white" />
                                </div>
                                <Badge className={getTypeColor(resource.type)}>
                                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                </Badge>
                              </div>
                              <Badge variant="outline">{resource.downloadCount} downloads</Badge>
                            </div>
                            <CardTitle className="text-[#20466d]">{resource.title}</CardTitle>
                            <p className="text-[#79858D]">{resource.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex gap-4 text-sm text-[#79858D]">
                                <span>{resource.pages} pages</span>
                                <span>{resource.format}</span>
                                <span>{resource.category}</span>
                              </div>
                            </div>
                            <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                              <Download className="mr-2 h-4 w-4" />
                              Download Free
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* All Resources */}
                <div>
                  <h2 className="text-2xl font-bold text-[#20466d] mb-6">All Resources</h2>
                  <div className="grid lg:grid-cols-3 gap-6">
                    {filteredResources.filter(resource => !resource.featured).map((resource) => {
                      const IconComponent = getTypeIcon(resource.type);
                      return (
                        <Card key={resource.id} className="border-[#79858D]/20 hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-[#22aee1] rounded-lg flex items-center justify-center">
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <Badge className={getTypeColor(resource.type)} variant="secondary">
                                {resource.type}
                              </Badge>
                            </div>
                            <CardTitle className="text-[#20466d] text-lg">{resource.title}</CardTitle>
                            <p className="text-[#79858D] text-sm">{resource.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm text-[#79858D]">
                                <span>{resource.pages} pages</span>
                                <span>{resource.downloadCount} downloads</span>
                              </div>
                              <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Webinars & Videos */}
            <TabsContent value="webinars">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#20466d] mb-4">Expert Webinars & Video Content</h2>
                  <p className="text-[#79858D] max-w-3xl mx-auto">
                    Learn from industry experts through our comprehensive video library covering all aspects of health insurance for UK SMEs.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {webinars.map((webinar) => (
                    <Card key={webinar.id} className={`border-[#79858D]/20 hover:shadow-lg transition-shadow ${webinar.featured ? 'ring-2 ring-[#22aee1] ring-opacity-50' : ''}`}>
                      <CardHeader>
                        {webinar.featured && (
                          <Badge className="w-fit mb-3 bg-[#22aee1] text-white">Featured</Badge>
                        )}
                        <CardTitle className="text-[#20466d]">{webinar.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm text-[#79858D]">
                          <span>By {webinar.speaker}</span>
                          <span>•</span>
                          <span>{webinar.duration}</span>
                          <span>•</span>
                          <span>{webinar.date}</span>
                        </div>
                        <p className="text-[#79858D]">{webinar.description}</p>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                          Watch Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Interactive Tools */}
            <TabsContent value="tools">
              <div className="text-center py-12">
                <Calculator className="h-16 w-16 text-[#22aee1] mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-[#20466d] mb-4">Interactive Tools</h2>
                <p className="text-[#79858D] mb-8 max-w-2xl mx-auto">
                  Access our suite of interactive calculators and tools to help you make informed health insurance decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-[#22aee1] hover:bg-[#20466d]">
                    <Link to="/calculators">
                      View All Calculators
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/compliance-tools">
                      Compliance Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-[#20466d]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with New Resources</h2>
          <p className="text-lg mb-8 opacity-90">
            Be the first to access new guides, reports, and tools as soon as they're released.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              placeholder="Enter your email"
              className="bg-white text-[#20466d]"
            />
            <Button className="bg-[#22aee1] hover:bg-white hover:text-[#20466d]">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default ResourcesPage;
