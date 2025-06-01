
import { Users, Target, Award, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogLayout from "@/components/BlogLayout";

const AboutBlog = () => {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Providing expert insights and thought leadership on health insurance 
            trends, policy changes, and consumer advocacy.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To demystify health insurance and empower consumers with the knowledge 
                  they need to make informed healthcare decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Healthcare policy experts, insurance professionals, and consumer advocates 
                  working together to provide valuable insights.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Our Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Decades of combined experience in healthcare policy, insurance regulation, 
                  and consumer protection advocacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Focus */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Cover</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Policy Analysis</h3>
              <p className="text-gray-600 mb-6">
                In-depth analysis of healthcare legislation, policy changes, and their 
                impact on consumers and the healthcare system.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consumer Guidance</h3>
              <p className="text-gray-600">
                Practical tips and strategies for navigating health insurance options, 
                understanding benefits, and maximizing coverage value.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Trends</h3>
              <p className="text-gray-600 mb-6">
                Coverage of emerging trends in healthcare delivery, insurance innovation, 
                and technology's impact on the industry.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Insights</h3>
              <p className="text-gray-600">
                Thought leadership from industry experts, policymakers, and healthcare 
                professionals on current and future healthcare challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about health insurance or suggestions for topics you'd like us to cover? 
            We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Contact Our Team
            </Button>
            <Button variant="outline" size="lg">
              Suggest a Topic
            </Button>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default AboutBlog;
