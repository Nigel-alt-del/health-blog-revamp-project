
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Calculator, 
  FileText, 
  TrendingUp, 
  ArrowRight
} from "lucide-react";

const ExpertisePage = () => {
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
            Deep domain knowledge in UK health insurance markets, delivered through practical insights and analysis
          </p>
        </div>
      </section>

      {/* Core Areas */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#20466d] mb-4">What We Specialise In</h2>
            <p className="text-lg text-[#79858D] max-w-3xl mx-auto">
              Our focus areas span the full spectrum of health insurance challenges facing UK businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#22aee1] rounded-lg flex items-center justify-centre mr-4">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#20466d]">SME Health Insurance Strategy</CardTitle>
                </div>
                <p className="text-[#79858D]">Comprehensive guidance on building cost-effective health benefits packages for small to medium enterprises.</p>
              </CardHeader>
            </Card>

            <Card className="border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#22aee1] rounded-lg flex items-center justify-centre mr-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#20466d]">Market Intelligence</CardTitle>
                </div>
                <p className="text-[#79858D]">Deep analysis of UK health insurance market trends, pricing patterns, and emerging opportunities.</p>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#20466d] mb-4">Ready to Explore Our Resources?</h3>
            <p className="text-lg text-[#79858D] mb-8">
              Access our comprehensive library of tools and insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-centre">
              <Button asChild size="lg" className="bg-[#22aee1] hover:bg-[#20466d]">
                <Link to="/calculators">
                  Try Our Calculators <Calculator className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/resources">
                  Browse Resources <FileText className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default ExpertisePage;
