
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, TrendingUp, CheckCircle } from "lucide-react";

const AboutPage = () => {
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
            About <span className="text-[#22aee1]">InsureMyHealth</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Empowering UK SMEs with expert health insurance insights, analysis, and practical guidance
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#20466d] mb-6">Our Mission</h2>
            <p className="text-lg text-[#79858D] max-w-3xl mx-auto">
              We exist to demystify the complex world of health insurance for UK small and medium enterprises. 
              Through rigorous analysis, practical tools, and expert insights, we help business owners make 
              informed decisions that protect their teams and their bottom line.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-[#79858D]/20">
              <CardHeader>
                <Shield className="h-12 w-12 text-[#22aee1] mx-auto mb-4" />
                <CardTitle className="text-[#20466d]">Expert Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  In-depth market analysis and policy breakdowns from industry professionals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#79858D]/20">
              <CardHeader>
                <Users className="h-12 w-12 text-[#22aee1] mx-auto mb-4" />
                <CardTitle className="text-[#20466d]">SME Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  Tailored specifically for the unique challenges facing UK small businesses
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#79858D]/20">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-[#22aee1] mx-auto mb-4" />
                <CardTitle className="text-[#20466d]">Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  Real-time insights on industry trends, regulatory changes, and best practices
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#20466d] mb-12 text-center">Our Approach</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-[#20466d] mb-6">Data-Driven Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#22aee1] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Market Research</h4>
                    <p className="text-[#79858D]">Regular surveys and analysis of UK health insurance trends</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#22aee1] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Industry Partnerships</h4>
                    <p className="text-[#79858D]">Collaborations with leading insurers and brokers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#22aee1] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Regulatory Monitoring</h4>
                    <p className="text-[#79858D]">Continuous tracking of UK health insurance regulations</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#20466d] mb-6">Practical Tools</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#22aee1] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Cost Calculators</h4>
                    <p className="text-[#79858D]">Interactive tools to estimate insurance costs and savings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#22aee1] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#20466d]">Resource Library</h4>
                    <p className="text-[#79858D]">Downloadable guides, templates, and checklists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default AboutPage;
