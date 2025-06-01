
import { useState } from "react";
import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, FileText, Mail, ExternalLink } from "lucide-react";

const CalculatorsPage = () => {
  const [taxEmployeeSalary, setTaxEmployeeSalary] = useState(30000);
  const [taxBenefitValue, setTaxBenefitValue] = useState(1200);
  const [taxBandRate, setTaxBandRate] = useState(20);

  // ROI Calculator states - focused on sick days and business cost
  const [roiEmployees, setRoiEmployees] = useState(50);
  const [roiAverageSalary, setRoiAverageSalary] = useState(35000);
  const [roiCurrentSickDays, setRoiCurrentSickDays] = useState(8);
  const [roiEmployeeBenefitsCost, setRoiEmployeeBenefitsCost] = useState(1200);
  const [roiProductivityLoss, setRoiProductivityLoss] = useState(25);

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
    // Calculate current costs from sick days
    const dailySalaryCost = roiAverageSalary / 250; // 250 working days per year
    const currentSickDayCosts = roiEmployees * roiCurrentSickDays * dailySalaryCost;
    
    // Additional productivity loss (covering work, overtime, temp staff)
    const productivityLossCost = currentSickDayCosts * (roiProductivityLoss / 100);
    
    // Total current annual cost
    const totalCurrentCost = currentSickDayCosts + productivityLossCost;
    
    // Potential improvements with employee benefits (PMI)
    const expectedSickDayReduction = 30; // 30% reduction with good healthcare
    const reducedSickDays = roiCurrentSickDays * (1 - expectedSickDayReduction / 100);
    
    // Calculate costs with benefits
    const improvedSickDayCosts = roiEmployees * reducedSickDays * dailySalaryCost;
    const improvedProductivityLoss = improvedSickDayCosts * (roiProductivityLoss / 100);
    const totalImprovedCost = improvedSickDayCosts + improvedProductivityLoss;
    
    // Calculate savings and ROI
    const annualSavings = totalCurrentCost - totalImprovedCost;
    const totalBenefitsCost = roiEmployees * roiEmployeeBenefitsCost;
    const netROI = annualSavings - totalBenefitsCost;
    const roiPercentage = totalBenefitsCost > 0 ? (netROI / totalBenefitsCost) * 100 : 0;

    return {
      currentSickDayCosts: Math.round(currentSickDayCosts),
      productivityLossCost: Math.round(productivityLossCost),
      totalCurrentCost: Math.round(totalCurrentCost),
      annualSavings: Math.round(annualSavings),
      totalBenefitsCost: Math.round(totalBenefitsCost),
      netROI: Math.round(netROI),
      roiPercentage: Math.round(roiPercentage),
      reducedSickDays: Math.round(reducedSickDays * 10) / 10
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
          
          {/* Contact Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-[#22aee1]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reports & Analysis</h3>
              <p className="text-sm opacity-90 mb-4">Get expert insights on employee benefits</p>
              <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                Contact Our Team
              </Button>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <ExternalLink className="h-8 w-8 text-[#22aee1]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">InsureMyHealth Services</h3>
              <p className="text-sm opacity-90 mb-4">Compare and purchase insurance</p>
              <Button 
                className="w-full bg-[#20466d] hover:bg-[#22aee1]"
                onClick={() => window.open('https://insure-health-made-simple.lovable.app/', '_blank')}
              >
                Visit Platform
              </Button>
            </div>
          </div>
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
                      Calculate the return on investment for employee benefits based on salary costs, sick days, and productivity.
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
                      <Label htmlFor="sick-days">Current Average Sick Days per Employee/Year</Label>
                      <Input
                        id="sick-days"
                        type="number"
                        value={roiCurrentSickDays}
                        onChange={(e) => setRoiCurrentSickDays(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="benefits-cost">Annual Employee Benefits Cost per Employee (£)</Label>
                      <Input
                        id="benefits-cost"
                        type="number"
                        value={roiEmployeeBenefitsCost}
                        onChange={(e) => setRoiEmployeeBenefitsCost(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="productivity-loss">Additional Productivity Loss (%)</Label>
                      <Input
                        id="productivity-loss"
                        type="number"
                        value={roiProductivityLoss}
                        onChange={(e) => setRoiProductivityLoss(Number(e.target.value))}
                        className="mt-1"
                        placeholder="25"
                      />
                      <p className="text-sm text-[#79858D] mt-1">Covering work, overtime, temporary staff costs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#22aee1] to-[#20466d] text-white">
                  <CardHeader>
                    <CardTitle>Business Impact Analysis</CardTitle>
                    <p className="text-blue-100">Annual costs and potential savings</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.currentSickDayCosts.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Current Sick Day Salary Costs</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.productivityLossCost.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Additional Productivity Costs</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.totalCurrentCost.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Total Current Annual Cost</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.annualSavings.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Potential Annual Savings</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-lg border-2 border-white/30">
                        <div className="text-3xl font-bold">
                          {roiCalculation.netROI >= 0 ? '+' : ''}£{roiCalculation.netROI.toLocaleString()}
                        </div>
                        <p className="text-sm text-blue-100">Net Annual ROI</p>
                        <p className="text-xs text-blue-200 mt-1">
                          {roiCalculation.roiPercentage}% return on investment
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-blue-100">Key metrics:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-200">
                        <li>Projected sick days: {roiCalculation.reducedSickDays} per employee</li>
                        <li>30% reduction in sick leave expected</li>
                        <li>Improved employee satisfaction & retention</li>
                      </ul>
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

          {/* Contact Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <Card className="text-center p-8 border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#22aee1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d] text-2xl mb-4">Reports & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D] mb-6">
                  Questions about our employee benefits analysis, reports, or want expert guidance?
                </p>
                <Button className="w-full bg-[#22aee1] hover:bg-[#20466d]">
                  Contact Reports Team
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-[#79858D]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#20466d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#20466d] text-2xl mb-4">InsureMyHealth Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#79858D] mb-6">
                  Ready to compare and purchase employee benefits packages?
                </p>
                <Button 
                  className="w-full bg-[#20466d] hover:bg-[#22aee1]"
                  onClick={() => window.open('https://insure-health-made-simple.lovable.app/', '_blank')}
                >
                  Visit InsureMyHealth
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default CalculatorsPage;
