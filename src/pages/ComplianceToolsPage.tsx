
import { useState } from "react";
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Calculator
} from "lucide-react";

const ComplianceToolsPage = () => {
  const [niAnnualBenefit, setNiAnnualBenefit] = useState(1200);

  const calculateClassNI = () => {
    const class1ANI = niAnnualBenefit * 0.138; // 13.8% Class 1A NI rate
    return Math.round(class1ANI);
  };

  const niCalculation = calculateClassNI();

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

      {/* Compliance Calendar & NI Calculator */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Deadline Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#20466d] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                2024/25 UK Compliance Calendar
              </CardTitle>
              <p className="text-[#79858D]">
                Key dates and deadlines for health insurance compliance in the UK. These dates are automatically updated annually for the current tax year.
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
              
              <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Annual Updates</h4>
                <p className="text-sm text-blue-700">
                  These compliance dates are updated annually to reflect the current UK tax year. The system automatically adjusts for the 2024-25 tax year with relevant deadlines for 2025.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* NI Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#20466d] flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Class 1A National Insurance Calculator
              </CardTitle>
              <p className="text-[#79858D]">
                Calculate your Class 1A National Insurance liability on health insurance benefits for the current tax year.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
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

                  <div>
                    <Label htmlFor="annual-benefit">Annual Benefit Value (£)</Label>
                    <Input
                      id="annual-benefit"
                      type="number"
                      value={niAnnualBenefit}
                      onChange={(e) => setNiAnnualBenefit(Number(e.target.value))}
                      className="mt-1"
                      placeholder="Enter total annual benefit value"
                    />
                    <p className="text-sm text-[#79858D] mt-1">
                      Enter the total annual value of health insurance benefits provided to all employees
                    </p>
                  </div>
                </div>

                <div className="bg-[#22aee1] text-white rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Calculation Result</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-lg">
                      <div className="text-3xl font-bold">£{niCalculation.toLocaleString()}</div>
                      <p className="text-sm text-blue-100">Class 1A NI Liability</p>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-100">Benefit Value:</span>
                        <span>£{niAnnualBenefit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-100">NI Rate:</span>
                        <span>13.8%</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 flex justify-between font-semibold">
                        <span>Total Due:</span>
                        <span>£{niCalculation.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-white/10 p-3 rounded text-xs">
                      <p className="text-blue-100 mb-1">Important:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-200">
                        <li>Payment due by 19 July 2025</li>
                        <li>P11D forms must be submitted by 6 July 2025</li>
                        <li>Late payments incur penalties and interest</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </BlogLayout>
  );
};

export default ComplianceToolsPage;
