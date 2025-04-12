import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { saveTaxCalculation, getTaxCalculation } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const TaxCalculator: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '₹';
  });

  // Tax calculation state
  const [regime, setRegime] = useState<'old' | 'new'>('new');
  const [income, setIncome] = useState<number>(1000000);
  const [deductions, setDeductions] = useState<number>(150000);
  const [taxableIncome, setTaxableIncome] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [inHandAmount, setInHandAmount] = useState<number>(0);

  // Fetch saved tax calculation
  const { data: savedTaxData, isLoading } = useQuery({
    queryKey: ['taxCalculation'],
    queryFn: async () => {
      try {
        return await getTaxCalculation();
      } catch (error) {
        console.error('Error fetching tax calculation:', error);
        return null;
      }
    }
  });

  // Listen for currency changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setSelectedCurrency(e.newValue || '₹');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load saved tax data if available
  useEffect(() => {
    if (savedTaxData) {
      setRegime(savedTaxData.regime as 'old' | 'new');
      setIncome(savedTaxData.income);
      setTaxAmount(savedTaxData.tax);
      setEffectiveRate(savedTaxData.effective_rate);
      setInHandAmount(savedTaxData.in_hand);
      setTaxableIncome(savedTaxData.taxable_income);
    }
  }, [savedTaxData]);

  // Calculate tax whenever inputs change
  useEffect(() => {
    calculateTax();
  }, [income, deductions, regime]);

  const calculateTax = () => {
    let taxable = income;
    let tax = 0;
    
    if (regime === 'old') {
      // Apply deductions in old regime
      taxable = Math.max(0, income - deductions);
      
      // Old regime tax slabs (2023-24)
      if (taxable <= 250000) {
        tax = 0;
      } else if (taxable <= 500000) {
        tax = (taxable - 250000) * 0.05;
      } else if (taxable <= 1000000) {
        tax = 12500 + (taxable - 500000) * 0.2;
      } else {
        tax = 112500 + (taxable - 1000000) * 0.3;
      }
    } else {
      // New regime tax slabs (2023-24)
      if (taxable <= 300000) {
        tax = 0;
      } else if (taxable <= 600000) {
        tax = (taxable - 300000) * 0.05;
      } else if (taxable <= 900000) {
        tax = 15000 + (taxable - 600000) * 0.1;
      } else if (taxable <= 1200000) {
        tax = 45000 + (taxable - 900000) * 0.15;
      } else if (taxable <= 1500000) {
        tax = 90000 + (taxable - 1200000) * 0.2;
      } else {
        tax = 150000 + (taxable - 1500000) * 0.3;
      }
    }
    
    // Add cess (4%)
    tax = tax * 1.04;
    
    // Calculate effective rate and in-hand amount
    const effectiveRate = (tax / income) * 100;
    const inHand = income - tax;
    
    setTaxableIncome(taxable);
    setTaxAmount(tax);
    setEffectiveRate(effectiveRate);
    setInHandAmount(inHand);
  };

  const handleSave = async () => {
    try {
      await saveTaxCalculation({
        regime,
        income,
        tax: taxAmount,
        effective_rate: effectiveRate,
        in_hand: inHandAmount,
        taxable_income: taxableIncome
      });
      
      queryClient.invalidateQueries({ queryKey: ['taxCalculation'] });
      
      toast({
        title: "Tax calculation saved",
        description: "Your tax calculation has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving calculation",
        description: error.message || "Failed to save tax calculation",
        variant: "destructive",
      });
    }
  };

  // Data for charts
  const pieData = [
    { name: 'Tax', value: taxAmount },
    { name: 'In-Hand', value: inHandAmount },
  ];
  
  const barData = [
    { name: 'Income', amount: income },
    { name: 'Taxable', amount: taxableIncome },
    { name: 'Tax', amount: taxAmount },
    { name: 'In-Hand', amount: inHandAmount },
  ];
  
  const COLORS = ['#FF8042', '#00C49F'];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tax Calculator</h1>
        <p className="text-muted-foreground">Estimate your income tax and plan your finances</p>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Regime Comparison</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Tax Calculator</CardTitle>
              <CardDescription>Calculate your income tax based on your annual income</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="regime">Tax Regime</Label>
                    <Select value={regime} onValueChange={(value: 'old' | 'new') => setRegime(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select regime" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="old">Old Regime (with deductions)</SelectItem>
                        <SelectItem value="new">New Regime (without deductions)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="income">Annual Income ({selectedCurrency})</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="income"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {regime === 'old' && (
                    <div>
                      <Label htmlFor="deductions">Total Deductions ({selectedCurrency})</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="deductions"
                          type="number"
                          value={deductions}
                          onChange={(e) => setDeductions(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button onClick={handleSave}>Save Calculation</Button>
                  </div>
                </div>

                <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">Tax Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxable Income:</p>
                      <p className="font-medium">{selectedCurrency}{taxableIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tax Amount:</p>
                      <p className="font-medium text-red-600">{selectedCurrency}{taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Effective Tax Rate:</p>
                      <p className="font-medium">{effectiveRate.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">In-Hand Income:</p>
                      <p className="font-medium text-green-600">{selectedCurrency}{inHandAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${selectedCurrency}${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${selectedCurrency}${Number(value).toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Tax Regime Comparison</CardTitle>
              <CardDescription>Compare old vs new tax regimes to find the best option for you</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Old Regime</TableHead>
                    <TableHead>New Regime</TableHead>
                    <TableHead>Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Tax Calculation</TableCell>
                    <TableCell>With deductions & exemptions</TableCell>
                    <TableCell>Without deductions & exemptions</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tax Slabs</TableCell>
                    <TableCell>3 slabs</TableCell>
                    <TableCell>6 slabs</TableCell>
                    <TableCell>More granular in new regime</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Standard Deduction</TableCell>
                    <TableCell>₹50,000</TableCell>
                    <TableCell>₹50,000</TableCell>
                    <TableCell>Same</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Section 80C</TableCell>
                    <TableCell>Up to ₹1,50,000</TableCell>
                    <TableCell>Not available</TableCell>
                    <TableCell className="text-red-500">Loss in new regime</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">HRA Exemption</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Not available</TableCell>
                    <TableCell className="text-red-500">Loss in new regime</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Best For</TableCell>
                    <TableCell>People with significant investments & housing loans</TableCell>
                    <TableCell>People with minimal investments or deductions</TableCell>
                    <TableCell>Depends on individual case</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Tax Calculation History</CardTitle>
              <CardDescription>View your previous tax calculations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : savedTaxData ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Regime</TableHead>
                      <TableHead>Income</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Effective Rate</TableHead>
                      <TableHead>In-Hand</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{new Date(savedTaxData.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="capitalize">{savedTaxData.regime}</TableCell>
                      <TableCell>{selectedCurrency}{savedTaxData.income.toLocaleString()}</TableCell>
                      <TableCell>{selectedCurrency}{savedTaxData.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                      <TableCell>{savedTaxData.effective_rate.toFixed(2)}%</TableCell>
                      <TableCell>{selectedCurrency}{savedTaxData.in_hand.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No tax calculation history found. Save a calculation to see it here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TaxCalculator;
