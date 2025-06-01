import { useState } from "react";
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Users,
  Calculator,
  Clock
} from "lucide-react";

const ComplianceToolsPage = () => {
  const [companySize, setCompanySize] = useState("");
  const [hasP11D, setHasP11D] = useState(false);
  const [hasPayroll, setHasPayroll] = useState(false);
  const [hasHR, setHasHR] = useState(false);
  const [benefitValue, setBenefitValue] = useState(0);

  const complianceChecks = [
    {
      id: 1,
      title: "P11D Reporting Requirements",
      description: "Ensure you're correctly reporting health insurance benefits",
      status: hasP11D ? "compliant" : "action-needed",
      priority: "high",
      deadline: "July 6, 2024"
    },
    {
      id: 2,
      title: "Class 1A National Insurance",
      description: "Calculate and pay employer National Insurance on benefits",
      status: benefitValue > 0 ? "compliant" : "pending",
      priority: "high",
      deadline: "July 19, 2024"
    },
    {
      id: 3,
      title: "Employee Communication",
      description: "Inform employees about benefit-in-kind taxation",
      status: hasHR ? "compliant" : "action-needed",
      priority: "medium",
      deadline: "Ongoing"
    },
    {
      id: 4,
      title: "Payroll Integration",
      description: "Ensure benefits are correctly integrated into payroll systems",
      status: hasPayroll ? "compliant" : "action-needed",
      priority: "medium",
      deadline: "Before first payment"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'action-needed':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'action-needed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
            Compliance <span className="text-[#22aee1]">Tools</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Ensure your health insurance benefits meet all UK regulatory requirements with our comprehensive compliance toolkit
          </p>
        </div>
      </section>

      {/* Compliance Tools */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="checker" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
              <TabsTrigger value="checker" className="flex items-center gap-2 p-4">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Compliance Checker</span>
                <span className="sm:hidden">Checker</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2 p-4">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Deadline Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="p11d" className="flex items-center gap-2 p-4">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">P11D Helper</span>
                <span className="sm:hidden">P11D</span>
              </TabsTrigger>
              <TabsTrigger value="ni-calculator" className="flex items-center gap-2 p-4">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">NI Calculator</span>
                <span className="sm:hidden">NI Calc</span>
              </TabsTrigger>
            </TabsList>

            {/* Compliance Checker */}
            <TabsContent value="checker">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#20466d] flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Compliance Health Check
                    </CardTitle>
                    <p className="text-[#79858D]">
                      Answer a few questions to assess your current compliance status and get personalized recommendations.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="company-size">Company Size</Label>
                      <Select value={companySize} onValueChange={setCompanySize}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-250">51-250 employees</SelectItem>
                          <SelectItem value="250+">250+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Current Compliance Status</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="p11d" 
                            checked={hasP11D}
                            onCheckedChange={(checked) => setHasP11D(checked as boolean)}
                          />
                          <Label htmlFor="p11d" className="text-sm">
                            We submit P11D forms for employee benefits
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="payroll" 
                            checked={hasPayroll}
                            onCheckedChange={(checked) => setHasPayroll(checked as boolean)}
                          />
                          <Label htmlFor="payroll" className="text-sm">
                            Benefits are integrated into our payroll system
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hr" 
                            checked={hasHR}
                            onCheckedChange={(checked) => setHasHR(checked as boolean)}
                          />
                          <Label htmlFor="hr" className="text-sm">
                            Employees are informed about benefit taxation
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="benefit-value">Annual Benefit Value per Employee (£)</Label>
                      <Input
                        id="benefit-value"
                        type="number"
                        value={benefitValue}
                        onChange={(e) => setBenefitValue(Number(e.target.value))}
                        className="mt-1"
                        placeholder="e.g., 1200"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-[#20466d]">Compliance Status</CardTitle>
                    <p className="text-[#79858D]">Based on your current setup</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complianceChecks.map((check) => (
                      <div key={check.id} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                        {getStatusIcon(check.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#20466d] text-sm">{check.title}</h4>
                            <Badge className={getPriorityColor(check.priority)} variant="secondary">
                              {check.priority}
                            </Badge>
                          </div>
                          <p className="text-[#79858D] text-xs mb-2">{check.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(check.status)} variant="secondary">
                              {check.status.replace('-', ' ')}
                            </Badge>
                            <span className="text-xs text-[#79858D]">Due: {check.deadline}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-[#20466d] text-white rounded-lg">
                      <h4 className="font-semibold mb-2">Overall Compliance Score</h4>
                      <div className="text-2xl font-bold text-[#22aee1]">
                        {Math.round((complianceChecks.filter(c => c.status === 'compliant').length / complianceChecks.length) * 100)}%
                      </div>
                      <p className="text-sm text-gray-200 mt-1">
                        {complianceChecks.filter(c => c.status === 'action-needed').length} items need attention
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Deadline Calendar */}
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#20466d] flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    2024 Compliance Calendar
                  </CardTitle>
                  <p className="text-[#79858D]">
                    Key dates and deadlines for health insurance compliance in the UK.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        date: "April 19, 2024",
                        title: "Class 1A National Insurance Payment Due",
                        description: "Final deadline for paying employer National Insurance on benefits provided in the previous tax year.",
                        type: "payment",
                        status: "past"
                      },
                      {
                        date: "May 31, 2024",
                        title: "P60 Issue Deadline",
                        description: "Provide P60s to all employees, including benefit-in-kind information if processed through payroll.",
                        type: "reporting",
                        status: "past"
                      },
                      {
                        date: "July 6, 2024",
                        title: "P11D Submission Deadline",
                        description: "Submit P11D forms to HMRC for all employees who received benefits-in-kind during 2023-24.",
                        type: "reporting",
                        status: "upcoming"
                      },
                      {
                        date: "July 6, 2024",
                        title: "P11D Copy to Employees",
                        description: "Provide copies of P11D forms to employees who received benefits-in-kind.",
                        type: "communication",
                        status: "upcoming"
                      },
                      {
                        date: "July 19, 2024",
                        title: "Class 1A NI Return Deadline",
                        description: "Submit Class 1A National Insurance return for benefits provided during 2023-24.",
                        type: "reporting",
                        status: "upcoming"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-20 h-20 bg-[#22aee1] rounded-lg flex flex-col items-center justify-center text-white text-center flex-shrink-0">
                          <div className="text-xs font-semibold">
                            {new Date(item.date).toLocaleDateString('en-GB', { month: 'short' })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(item.date).getDate()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#20466d]">{item.title}</h4>
                            <Badge 
                              className={item.status === 'past' ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'}
                              variant="secondary"
                            >
                              {item.status}
                            </Badge>
                            <Badge 
                              className={
                                item.type === 'payment' ? 'bg-red-100 text-red-800' :
                                item.type === 'reporting' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }
                              variant="secondary"
                            >
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-[#79858D] text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* P11D Helper */}
            <TabsContent value="p11d">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#20466d] flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    P11D Form Helper
                  </CardTitle>
                  <p className="text-[#79858D]">
                    Guidance and templates for completing P11D forms for health insurance benefits.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-[#22aee1] mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-[#20466d] mb-4">P11D Form Helper</h3>
                    <p className="text-[#79858D] mb-6 max-w-2xl mx-auto">
                      Coming soon - Step-by-step guidance for completing P11D forms, including which sections to complete 
                      for different types of health insurance benefits and automatic calculations.
                    </p>
                    <Button className="bg-[#22aee1] hover:bg-[#20466d]">
                      Notify Me When Available
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NI Calculator */}
            <TabsContent value="ni-calculator">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#20466d] flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    National Insurance Calculator
                  </CardTitle>
                  <p className="text-[#79858D]">
                    Calculate Class 1A National Insurance liability on health insurance benefits.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-[#22aee1] mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-[#20466d] mb-4">NI Calculator</h3>
                    <p className="text-[#79858D] mb-6 max-w-2xl mx-auto">
                      Calculate your exact Class 1A National Insurance liability based on the benefits you provide. 
                      This tool will be available soon with automatic rate updates and detailed breakdowns.
                    </p>
                    <Button className="bg-[#22aee1] hover:bg-[#20466d]">
                      Notify Me When Available
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">Need Immediate Help?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#79858D]/20">
              <CardHeader>
                <CardTitle className="text-[#20466d] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Download Compliance Checklist
                </CardTitle>
                <p className="text-[#79858D]">
                  Get our comprehensive compliance checklist covering all aspects of health insurance regulation.
                </p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                  Download Free Checklist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[#79858D]/20">
              <CardHeader>
                <CardTitle className="text-[#20466d] flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Book Compliance Consultation
                </CardTitle>
                <p className="text-[#79858D]">
                  Schedule a free 30-minute consultation with our compliance experts.
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Book Free Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default ComplianceToolsPage;
