
import { useState } from "react";
import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, FileText, Mail, ExternalLink, Info } from "lucide-react";

const CalculatorsPage = () => {
  const [taxEmployeeSalary, setTaxEmployeeSalary] = useState(30000);
  const [taxBenefitValue, setTaxBenefitValue] = useState(1200);
  const [taxBandRate, setTaxBandRate] = useState(20);

  // Business ROI Calculator states - based on the correct formula
  const [roiEmployees, setRoiEmployees] = useState(50);
  const [roiAverageSalary, setRoiAverageSalary] = useState(35000);
  const [roiSickDaysPerEmployee, setRoiSickDaysPerEmployee] = useState(8);
  const [roiIndirectCostPercentage, setRoiIndirectCostPercentage] = useState([20]);

  const calculateTaxImplications = () => {
    const benefitInKind = taxBenefitValue * (taxBandRate / 100);
    const employerNI = taxBenefitValue * 0.138; // 13.8% employer NI
    const totalEmployerCost = taxBenefitValue + employerNI;
    
    return {
      employeeTax: Math.round(benefitInKind),
      employerNI: Math.round(employerNI),
      totalEmployerCost: Math.round(totalEmployerCost)
    };
  };

  const calculateBusinessROI = () => {
    // Calculate direct cost of sick days
    const averageDailySalary = roiAverageSalary / 250; // 250 working days per year
    const directCostOfSickDays = roiEmployees * averageDailySalary * roiSickDaysPerEmployee;
    
    // Calculate total cost including indirect costs
    const indirectCostMultiplier = 1 + (roiIndirectCostPercentage[0] / 100);
    const totalCostOfSickDays = directCostOfSickDays * indirectCostMultiplier;
    const indirectCosts = totalCostOfSickDays - directCostOfSickDays;

    return {
      directCost: Math.round(directCostOfSickDays),
      indirectCosts: Math.round(indirectCosts),
      totalCost: Math.round(totalCostOfSickDays),
      averageDailySalary: Math.round(averageDailySalary),
      indirectPercentage: roiIndirectCostPercentage[0]
    };
  };

  const taxCalculation = calculateTaxImplications();
  const roiCalculation = calculateBusinessROI();

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
            Employee Benefits <span className="text-[#22aee1]">Calculators</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Interactive tools to help UK SMEs make informed employee benefits decisions
          </p>
        </div>
      </section>

      {/* Calculator Tools */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="roi-calculator" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto">
              <TabsTrigger value="roi-calculator" className="flex items-center gap-2 p-4">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Business ROI Calculator</span>
                <span className="sm:hidden">ROI</span>
              </TabsTrigger>
              <TabsTrigger value="tax-calculator" className="flex items-center gap-2 p-4">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Tax Impact Calculator</span>
                <span className="sm:hidden">Tax Impact</span>
              </TabsTrigger>
            </TabsList>

            {/* Business ROI Calculator */}
            <TabsContent value="roi-calculator">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#20466d] flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Business ROI Calculator
                    </CardTitle>
                    <p className="text-[#79858D]">
                      Calculate the direct and indirect costs of sick days to your business.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="roi-employees">Number of Employees</Label>
                      <Input
                        id="roi-employees"
                        type="number"
                        value={roiEmployees}
                        onChange={(e) => setRoiEmployees(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="avg-salary">Average Employee Salary (£)</Label>
                      <Input
                        id="avg-salary"
                        type="number"
                        value={roiAverageSalary}
                        onChange={(e) => setRoiAverageSalary(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sick-days">Average Sick Days per Employee per Year</Label>
                      <Input
                        id="sick-days"
                        type="number"
                        value={roiSickDaysPerEmployee}
                        onChange={(e) => setRoiSickDaysPerEmployee(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="indirect-costs">Indirect Cost Percentage: {roiIndirectCostPercentage[0]}%</Label>
                      <Slider
                        id="indirect-costs"
                        min={20}
                        max={100}
                        step={5}
                        value={roiIndirectCostPercentage}
                        onValueChange={setRoiIndirectCostPercentage}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-[#79858D] mt-1">
                        <span>20%</span>
                        <span>100%</span>
                      </div>
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Indirect costs include:</p>
                            <ul className="text-xs space-y-1">
                              <li>• Loss of productivity, project delays</li>
                              <li>• Overtime for other staff</li>
                              <li>• Temporary staffing costs</li>
                              <li>• Reduced quality, administrative costs</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#22aee1] to-[#20466d] text-white">
                  <CardHeader>
                    <CardTitle>Cost of Sick Days Analysis</CardTitle>
                    <p className="text-blue-100">Annual impact on your business</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-lg font-bold">£{roiCalculation.averageDailySalary}</div>
                        <p className="text-sm text-blue-100">Average Daily Salary Cost</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.directCost.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Direct Cost of Sick Days</p>
                        <p className="text-xs text-blue-200">
                          {roiEmployees} employees × £{roiCalculation.averageDailySalary} × {roiSickDaysPerEmployee} days
                        </p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.indirectCosts.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Indirect Costs ({roiCalculation.indirectPercentage}%)</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-lg border-2 border-white/30">
                        <div className="text-3xl font-bold">£{roiCalculation.totalCost.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Total Annual Cost</p>
                        <p className="text-xs text-blue-200">
                          Direct + Indirect costs
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-blue-100">Formula used:</p>
                      <div className="text-xs text-blue-200 bg-white/10 p-2 rounded">
                        Total Cost = (Employees × Daily Salary × Sick Days) × (1 + Indirect %)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tax Impact Calculator */}
            <TabsContent value="tax-calculator">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#20466d] flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Employee Benefits Tax Calculator
                    </CardTitle>
                    <p className="text-[#79858D]">
                      Calculate the tax implications of providing employee benefits as benefit-in-kind.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="salary">Employee Annual Salary (£)</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={taxEmployeeSalary}
                        onChange={(e) => setTaxEmployeeSalary(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="benefit">Annual Benefit Value (£)</Label>
                      <Input
                        id="benefit"
                        type="number"
                        value={taxBenefitValue}
                        onChange={(e) => setTaxBenefitValue(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="taxband">Employee Tax Rate (%)</Label>
                      <Select value={taxBandRate.toString()} onValueChange={(value) => setTaxBandRate(Number(value))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">Basic Rate (20%)</SelectItem>
                          <SelectItem value="40">Higher Rate (40%)</SelectItem>
                          <SelectItem value="45">Additional Rate (45%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#22aee1] to-[#20466d] text-white">
                  <CardHeader>
                    <CardTitle>Tax Calculation Results</CardTitle>
                    <p className="text-blue-100">Annual tax implications for employee benefits</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{taxCalculation.employeeTax}</div>
                        <p className="text-sm text-blue-100">Employee Income Tax</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{taxCalculation.employerNI}</div>
                        <p className="text-sm text-blue-100">Employer National Insurance</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-lg border-2 border-white/30">
                        <div className="text-3xl font-bold">£{taxCalculation.totalEmployerCost}</div>
                        <p className="text-sm text-blue-100">Total Employer Cost</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-blue-100">Important notes:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-200">
                        <li>P11D reporting required</li>
                        <li>Class 1A NI payable by April 19th</li>
                        <li>Employee pays tax via PAYE or Self Assessment</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </BlogLayout>
  );
};

export default CalculatorsPage;
