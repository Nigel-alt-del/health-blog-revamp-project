
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Calculator, 
  FileText, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const ExpertisePage = () => {
  const expertiseAreas = [
    {
      icon: Building2,
      title: "SME Health Insurance Strategy",
      description: "Comprehensive guidance on building cost-effective health benefits packages for small to medium enterprises.",
      capabilities: [
        "Multi-insurer comparison analysis",
        "Cost optimization strategies",
        "Employee benefit design",
        "Renewal negotiation tactics"
      ]
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Expert navigation of UK health insurance regulations and compliance requirements for businesses.",
      capabilities: [
        "HMRC benefit-in-kind guidance",
        "P11D reporting requirements",
        "Auto-enrolment compliance",
        "Data protection (GDPR) compliance"
      ]
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Deep analysis of UK health insurance market trends, pricing patterns, and emerging opportunities.",
      capabilities: [
        "Quarterly market trend reports",
        "Insurer financial strength analysis",
        "Product innovation tracking",
        "Regulatory impact assessments"
      ]
    },
    {
      icon: Calculator,
      title: "Financial Impact Analysis",
      description: "Quantitative analysis of health insurance decisions on business finances and employee satisfaction.",
      capabilities: [
        "ROI calculations for health benefits",
        "Tax efficiency analysis",
        "Cash flow impact modeling",
        "Total cost of ownership studies"
      ]
    }
  ];

  const tools = [
    {
      title: "PMI Cost Calculator",
      description: "Estimate private medical insurance costs for your workforce",
      link: "/calculators"
    },
    {
      title: "Compliance Checker",
      description: "Ensure your health benefits meet UK regulatory requirements",
      link: "/compliance-tools"
    },
    {
      title: "Benefit Comparison Tool",
      description: "Compare different health insurance packages side-by-side",
      link: "/calculators"
    }
  ];

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
            Our <span className="text-[#22aee1]">Expertise</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Deep domain knowledge in UK health insurance markets, delivered through practical tools and actionable insights
          </p>
        </div>
      </section>

      {/* Core Expertise Areas */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#20466d] mb-4">Core Expertise Areas</h2>
            <p className="text-lg text-[#79858D] max-w-3xl mx-auto">
              Our specialized knowledge spans the full spectrum of health insurance challenges facing UK businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {expertiseAreas.map((area, index) => (
              <Card key={index} className="border-[#79858D]/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#22aee1] rounded-lg flex items-center justify-center mr-4">
                      <area.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-[#20466d]">{area.title}</CardTitle>
                  </div>
                  <p className="text-[#79858D]">{area.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {area.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-[#22aee1] mr-2 flex-shrink-0" />
                        <span className="text-sm text-[#79858D]">{capability}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#20466d] mb-4">Interactive Tools & Calculators</h2>
            <p className="text-lg text-[#79858D]">
              Put our expertise to work with practical tools designed for busy SME owners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="border-[#79858D]/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#20466d] text-lg">{tool.title}</CardTitle>
                  <p className="text-[#79858D] text-sm">{tool.description}</p>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                    <Link to={tool.link}>
                      Use Tool <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Analysis */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#20466d] mb-6">Research & Analysis Methodology</h2>
              <p className="text-[#79858D] mb-6">
                Our insights are backed by rigorous research methodology and continuous market monitoring.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#22aee1] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Data Collection</h4>
                    <p className="text-[#79858D] text-sm">Monthly surveys of 500+ UK SMEs on health insurance experiences</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#22aee1] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Market Analysis</h4>
                    <p className="text-[#79858D] text-sm">Comprehensive review of insurer products, pricing, and policy changes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#22aee1] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Expert Validation</h4>
                    <p className="text-[#79858D] text-sm">Peer review by certified insurance professionals and industry experts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#20466d] text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Latest Research</h3>
              <p className="text-gray-200 mb-6">
                Access our latest market research and industry reports
              </p>
              <div className="space-y-3 mb-6">
                <Badge variant="secondary" className="bg-[#22aee1] text-white">Q4 2024 Market Report</Badge>
                <Badge variant="secondary" className="bg-[#22aee1] text-white">SME Benefits Benchmark</Badge>
                <Badge variant="secondary" className="bg-[#22aee1] text-white">Regulatory Impact Analysis</Badge>
              </div>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/resources">
                  Download Reports <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-[#22aee1]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Leverage Our Expertise?</h2>
          <p className="text-lg mb-8 opacity-90">
            Get personalized insights for your business or explore our comprehensive resource library
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/calculators">
                Try Our Tools <Calculator className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#22aee1]">
              <Link to="/resources">
                Browse Resources <FileText className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default ExpertisePage;
