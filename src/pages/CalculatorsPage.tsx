import { useState } from "react";
import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, FileText } from "lucide-react";

const CalculatorsPage = () => {
  const [pmiEmployees, setPmiEmployees] = useState(10);
  const [pmiAgeGroup, setPmiAgeGroup] = useState("25-35");
  const [pmiCoverageLevel, setPmiCoverageLevel] = useState("standard");
  const [pmiLocation, setPmiLocation] = useState("london");
  
  const [taxEmployeeSalary, setTaxEmployeeSalary] = useState(30000);
  const [taxBenefitValue, setTaxBenefitValue] = useState(1200);
  const [taxBandRate, setTaxBandRate] = useState(20);

  // ROI Calculator states
  const [roiEmployees, setRoiEmployees] = useState(50);
  const [roiCurrentSickDays, setRoiCurrentSickDays] = useState(8);
  const [roiAverageSalary, setRoiAverageSalary] = useState(35000);
  const [roiTurnoverRate, setRoiTurnoverRate] = useState(15);
  const [roiRecruitmentCost, setRoiRecruitmentCost] = useState(5000);

  const calculatePMICost = () => {
    let baseCost = pmiEmployees * 850; // Base annual cost per employee
    
    // Age group multiplier
    const ageMultiplier = {
      "18-25": 0.8,
      "25-35": 1.0,
      "35-45": 1.2,
      "45-55": 1.4,
      "55+": 1.6
    }[pmiAgeGroup] || 1.0;
    
    const locationMultiplier = {
      "london": 1.2,
      "southeast": 1.1,
      "southwest": 1.0,
      "midlands": 0.95,
      "north": 0.9,
      "scotland": 0.9,
      "wales": 0.9,
      "ni": 0.85
    }[pmiLocation] || 1.0;
    
    const coverageMultiplier = {
      "comprehensive": 1.5,
      "standard": 1.0,
      "basic": 0.7
    }[pmiCoverageLevel] || 1.0;
    
    const totalCost = baseCost * ageMultiplier * locationMultiplier * coverageMultiplier;
    return Math.round(totalCost);
  };

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

  const calculateROI = () => {
    // Current costs
    const sickDayCost = (roiAverageSalary / 250) * roiCurrentSickDays * roiEmployees; // Assuming 250 working days
    const turnoverCost = (roiTurnoverRate / 100) * roiEmployees * roiRecruitmentCost;
    const currentCosts = sickDayCost + turnoverCost;

    // Estimated improvements with health insurance
    const reducedSickDays = roiCurrentSickDays * 0.25; // 25% reduction
    const reducedTurnover = roiTurnoverRate * 0.15; // 15% reduction
    
    const improvedSickDayCost = (roiAverageSalary / 250) * (roiCurrentSickDays - reducedSickDays) * roiEmployees;
    const improvedTurnoverCost = ((roiTurnoverRate - reducedTurnover) / 100) * roiEmployees * roiRecruitmentCost;
    const improvedCosts = improvedSickDayCost + improvedTurnoverCost;

    const annualSavings = currentCosts - improvedCosts;
    const healthInsuranceCost = roiEmployees * 1200; // Estimated annual cost
    const netROI = annualSavings - healthInsuranceCost;

    return {
      currentCosts: Math.round(currentCosts),
      annualSavings: Math.round(annualSavings),
      healthInsuranceCost: Math.round(healthInsuranceCost),
      netROI: Math.round(netROI),
      roiPercentage: Math.round((netROI / healthInsuranceCost) * 100)
    };
  };

  const pmiCost = calculatePMICost();
  const taxCalculation = calculateTaxImplications();
  const roiCalculation = calculateROI();

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
            Health Insurance <span className="text-[#22aee1]">Calculators</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Interactive tools to help UK SMEs make informed health insurance decisions
          </p>
        </div>
      </section>

      {/* Calculator Tools */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="pmi-calculator" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
              <TabsTrigger value="pmi-calculator" className="flex items-center gap-2 p-4">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">PMI Cost Calculator</span>
                <span className="sm:hidden">PMI Cost</span>
              </TabsTrigger>
              <TabsTrigger value="tax-calculator" className="flex items-center gap-2 p-4">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Tax Impact Calculator</span>
                <span className="sm:hidden">Tax Impact</span>
              </TabsTrigger>
              <TabsTrigger value="roi-calculator" className="flex items-center gap-2 p-4">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">ROI Calculator</span>
                <span className="sm:hidden">ROI</span>
              </TabsTrigger>
            </TabsList>

            {/* PMI Cost Calculator */}
            <TabsContent value="pmi-calculator">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#20466d] flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      PMI Cost Calculator
                    </CardTitle>
                    <p className="text-[#79858D]">
                      Estimate your private medical insurance costs based on workforce demographics and coverage requirements.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="employees">Number of Employees</Label>
                      <Input
                        id="employees"
                        type="number"
                        value={pmiEmployees}
                        onChange={(e) => setPmiEmployees(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="age-group">Workforce Age Group</Label>
                      <Select value={pmiAgeGroup} onValueChange={setPmiAgeGroup}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18-25">18-25 years</SelectItem>
                          <SelectItem value="25-35">25-35 years</SelectItem>
                          <SelectItem value="35-45">35-45 years</SelectItem>
                          <SelectItem value="45-55">45-55 years</SelectItem>
                          <SelectItem value="55+">55+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="coverage">Coverage Level</Label>
                      <Select value={pmiCoverageLevel} onValueChange={setPmiCoverageLevel}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Coverage</SelectItem>
                          <SelectItem value="standard">Standard Coverage</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive Coverage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Business Location</Label>
                      <Select value={pmiLocation} onValueChange={setPmiLocation}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="london">London</SelectItem>
                          <SelectItem value="southeast">South East</SelectItem>
                          <SelectItem value="southwest">South West</SelectItem>
                          <SelectItem value="midlands">Midlands</SelectItem>
                          <SelectItem value="north">North England</SelectItem>
                          <SelectItem value="scotland">Scotland</SelectItem>
                          <SelectItem value="wales">Wales</SelectItem>
                          <SelectItem value="ni">Northern Ireland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#22aee1] to-[#20466d] text-white">
                  <CardHeader>
                    <CardTitle>Estimated Annual Cost</CardTitle>
                    <p className="text-blue-100">Based on current UK market rates</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        £{pmiCost.toLocaleString()}
                      </div>
                      <p className="text-blue-100">Total Annual Premium</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-white">
                          £{Math.round(pmiCost / pmiEmployees).toLocaleString()}
                        </div>
                        <p className="text-sm text-blue-100">Per Employee</p>
                      </div>
                      <div className="text-center p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-white">
                          £{Math.round(pmiCost / 12).toLocaleString()}
                        </div>
                        <p className="text-sm text-blue-100">Monthly Cost</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-blue-100">This estimate includes:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-200">
                        <li>Base premium costs</li>
                        <li>Age group adjustments</li>
                        <li>Regional pricing variations</li>
                        <li>Coverage level premiums</li>
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
                      Tax Impact Calculator
                    </CardTitle>
                    <p className="text-[#79858D]">
                      Calculate the tax implications of providing health insurance as a benefit-in-kind.
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
                    <p className="text-blue-100">Annual tax implications</p>
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

            {/* ROI Calculator */}
            <TabsContent value="roi-calculator">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#20466d] flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      ROI Calculator
                    </CardTitle>
                    <p className="text-[#79858D]">
                      Calculate the return on investment for your health insurance benefits package.
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
                      <Label htmlFor="sick-days">Average Annual Sick Days per Employee</Label>
                      <Input
                        id="sick-days"
                        type="number"
                        value={roiCurrentSickDays}
                        onChange={(e) => setRoiCurrentSickDays(Number(e.target.value))}
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
                      <Label htmlFor="turnover">Annual Turnover Rate (%)</Label>
                      <Input
                        id="turnover"
                        type="number"
                        value={roiTurnoverRate}
                        onChange={(e) => setRoiTurnoverRate(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="recruitment">Average Recruitment Cost per Employee (£)</Label>
                      <Input
                        id="recruitment"
                        type="number"
                        value={roiRecruitmentCost}
                        onChange={(e) => setRoiRecruitmentCost(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#22aee1] to-[#20466d] text-white">
                  <CardHeader>
                    <CardTitle>ROI Analysis Results</CardTitle>
                    <p className="text-blue-100">Annual impact of health insurance benefits</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.currentCosts.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Current Annual Costs</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.annualSavings.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Potential Annual Savings</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold">£{roiCalculation.healthInsuranceCost.toLocaleString()}</div>
                        <p className="text-sm text-blue-100">Health Insurance Investment</p>
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
                      <p className="text-blue-100">Assumptions:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-200">
                        <li>25% reduction in sick days</li>
                        <li>15% reduction in staff turnover</li>
                        <li>Improved employee satisfaction</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#20466d] mb-4">Need More Detailed Analysis?</h2>
          <p className="text-lg text-[#79858D] mb-8">
            Our calculators provide estimates based on market averages. For personalised quotes and detailed analysis, 
            explore our comprehensive insights or use our compliance tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#22aee1] hover:bg-[#20466d]">
              <Link to="/compliance-tools">
                Check Compliance
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                View Latest Insights
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
};

export default CalculatorsPage;
