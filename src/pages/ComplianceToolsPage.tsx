
import { useState } from "react";
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  FileText, 
  Calculator
} from "lucide-react";

const ComplianceToolsPage = () => {
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
            Stay on top of UK regulatory requirements with our compliance resources and deadline tracking
          </p>
        </div>
      </section>

      {/* Compliance Tools */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="calendar" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
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

            {/* Deadline Calendar */}
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#20466d] flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    2024/25 UK Compliance Calendar
                  </CardTitle>
                  <p className="text-[#79858D]">
                    Key dates and deadlines for health insurance compliance in the UK.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        date: "19 April 2025",
                        title: "Class 1A National Insurance Payment Due",
                        description: "Final deadline for paying employer National Insurance on benefits provided in the previous tax year (2023-24).",
                        type: "payment",
                        status: "upcoming"
                      },
                      {
                        date: "31 May 2025",
                        title: "P60 Issue Deadline",
                        description: "Provide P60s to all employees, including benefit-in-kind information if processed through payroll.",
                        type: "reporting",
                        status: "upcoming"
                      },
                      {
                        date: "6 July 2025",
                        title: "P11D Submission Deadline",
                        description: "Submit P11D forms to HMRC for all employees who received benefits-in-kind during 2024-25.",
                        type: "reporting",
                        status: "upcoming"
                      },
                      {
                        date: "6 July 2025",
                        title: "P11D Copy to Employees",
                        description: "Provide copies of P11D forms to employees who received benefits-in-kind.",
                        type: "communication",
                        status: "upcoming"
                      },
                      {
                        date: "19 July 2025",
                        title: "Class 1A NI Return Deadline",
                        description: "Submit Class 1A National Insurance return for benefits provided during 2024-25.",
                        type: "reporting",
                        status: "upcoming"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-20 h-20 bg-[#22aee1] rounded-lg flex flex-col items-center justify-centre text-white text-center flex-shrink-0">
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
                    Step-by-step guidance for completing P11D forms for health insurance benefits.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-[#22aee1]/10 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#20466d] mb-3">P11D Completion Guide</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#20466d] mb-2">Section A - Assets transferred</h4>
                          <p className="text-sm text-[#79858D]">Not applicable for health insurance benefits</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#20466d] mb-2">Section I - Medical treatment</h4>
                          <p className="text-sm text-[#79858D]">Enter the total annual cost of private medical insurance premiums paid by your company for each employee</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#20466d] mb-2">Cash equivalent calculation</h4>
                          <p className="text-sm text-[#79858D]">For PMI, the cash equivalent is typically the gross premium cost</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-800 mb-2">Important Reminder</h4>
                      <p className="text-sm text-amber-700">
                        P11D forms must be submitted to HMRC and copies provided to employees by 6 July following the end of the tax year.
                      </p>
                    </div>
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
                    Class 1A National Insurance Calculator
                  </CardTitle>
                  <p className="text-[#79858D]">
                    Calculate your Class 1A National Insurance liability on health insurance benefits.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-[#20466d]/5 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#20466d] mb-3">Class 1A NI Rate for 2024-25</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-2xl font-bold text-[#22aee1]">13.8%</div>
                          <p className="text-sm text-[#79858D]">Standard rate for all benefit values</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-2xl font-bold text-[#22aee1]">Annual</div>
                          <p className="text-sm text-[#79858D]">Payment due by 19 July 2025</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Quick Calculation</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Class 1A NI = Total benefit value × 13.8%
                      </p>
                      <p className="text-xs text-blue-600">
                        Example: £1,000 health insurance benefit = £138 Class 1A NI liability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </BlogLayout>
  );
};

export default ComplianceToolsPage;
