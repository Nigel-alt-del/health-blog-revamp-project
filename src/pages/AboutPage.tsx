
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award, TrendingUp, Shield, Heart } from "lucide-react";

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
            About <span className="text-[#22aee1]">Insure My Health</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your trusted source for UK employee benefits intelligence, market analysis, and strategic insights for small and medium enterprises.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#20466d] mb-6">Our Mission</h2>
            <p className="text-lg text-[#79858D] max-w-3xl mx-auto">
              We empower UK small and medium enterprises with analysis, practical tools, and strategic insights 
              to make informed decisions about employee benefits and private medical insurance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#22aee1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d]">Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  In-depth analysis of UK employee benefits trends, pricing, and regulatory changes affecting SMEs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#20466d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d]">Compliance Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  Clear guidance on regulatory requirements, deadlines, and best practices for employee benefits administration.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#22aee1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d]">SME Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  Tailored insights specifically designed for the unique needs and challenges of small and medium businesses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">Our Approach</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-[#79858D]/20">
              <CardHeader>
                <CardTitle className="text-[#20466d] flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  Our team provides comprehensive analysis of employee benefits trends, 
                  regulatory changes, and market developments affecting UK SMEs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#79858D]/20">
              <CardHeader>
                <CardTitle className="text-[#20466d] flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Practical Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  Interactive calculators and compliance tools help you make data-driven decisions 
                  about employee benefits investments and implementation strategies.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Card className="border-[#79858D]/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-[#20466d] flex items-center justify-center gap-2">
                  <Award className="h-5 w-5" />
                  Quality Commitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D]">
                  We maintain the highest standards of accuracy and relevance in our reporting, 
                  ensuring you receive reliable intelligence to support your business decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#20466d] mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#20466d] mb-4">Transparency</h3>
              <p className="text-[#79858D]">
                Clear, honest reporting with full disclosure of sources, methodologies, and potential conflicts of interest.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#20466d] mb-4">Accuracy</h3>
              <p className="text-[#79858D]">
                Rigorous fact-checking and verification processes ensure the reliability of our analysis and recommendations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#20466d] mb-4">Relevance</h3>
              <p className="text-[#79858D]">
                Focus on practical, actionable insights that directly impact UK SME decision-making processes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default AboutPage;
