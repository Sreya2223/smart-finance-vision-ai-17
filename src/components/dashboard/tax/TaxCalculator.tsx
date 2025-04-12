
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Calculator } from 'lucide-react';

type TaxRegime = 'old' | 'new';

type TaxSlabsType = {
  [key in TaxRegime]: { 
    min: number;
    max: number | null;
    rate: number;
  }[];
};

// Define tax slabs for both regimes
const TAX_SLABS: TaxSlabsType = {
  old: [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.20 },
    { min: 1000000, max: null, rate: 0.30 },
  ],
  new: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 600000, rate: 0.05 },
    { min: 600000, max: 900000, rate: 0.10 },
    { min: 900000, max: 1200000, rate: 0.15 },
    { min: 1200000, max: 1500000, rate: 0.20 },
    { min: 1500000, max: null, rate: 0.30 },
  ],
};

// Define deductions available in old regime
const DEDUCTIONS = [
  { id: 'standard', name: 'Standard Deduction', max: 50000 },
  { id: '80c', name: 'Section 80C (PF, LIC, etc.)', max: 150000 },
  { id: '80d', name: 'Section 80D (Medical Insurance)', max: 25000 },
  { id: 'hra', name: 'House Rent Allowance (HRA)', max: null },
  { id: 'other', name: 'Other Deductions', max: null },
];

const calculateTax = (income: number, regime: TaxRegime, deductions: Record<string, number> = {}) => {
  // Calculate taxable income after deductions for old regime
  let taxableIncome = income;
  if (regime === 'old') {
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    taxableIncome = Math.max(0, income - totalDeductions);
  }
  
  // Calculate tax based on slabs
  const slabs = TAX_SLABS[regime];
  let tax = 0;
  
  for (const slab of slabs) {
    const { min, max, rate } = slab;
    if (taxableIncome > min) {
      const slabIncome = max ? Math.min(taxableIncome, max) - min : taxableIncome - min;
      tax += slabIncome * rate;
    }
  }
  
  // Add cess (4% on tax amount)
  tax = tax * 1.04;
  
  return {
    taxableIncome,
    tax,
    effectiveRate: tax / income * 100,
    inHand: income - tax
  };
};

export interface TaxDetails {
  regime: TaxRegime;
  income: number;
  taxableIncome: number;
  tax: number;
  effectiveRate: number;
  inHand: number;
}

interface TaxCalculatorProps {
  onSaveTaxDetails?: (details: TaxDetails) => void;
  currency?: string;
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onSaveTaxDetails, currency = '₹' }) => {
  const { toast } = useToast();
  const [income, setIncome] = useState<number>(0);
  const [regime, setRegime] = useState<TaxRegime>('new');
  const [deductions, setDeductions] = useState<Record<string, number>>({
    standard: 50000,
    '80c': 0,
    '80d': 0,
    hra: 0,
    other: 0,
  });
  const [results, setResults] = useState<{
    old: ReturnType<typeof calculateTax>;
    new: ReturnType<typeof calculateTax>;
  }>({
    old: { taxableIncome: 0, tax: 0, effectiveRate: 0, inHand: 0 },
    new: { taxableIncome: 0, tax: 0, effectiveRate: 0, inHand: 0 },
  });

  const handleCalculate = () => {
    const oldRegimeTax = calculateTax(income, 'old', deductions);
    const newRegimeTax = calculateTax(income, 'new');
    
    setResults({
      old: oldRegimeTax,
      new: newRegimeTax
    });
    
    toast({
      title: "Tax Calculation Complete",
      description: `Based on your income of ${currency}${income.toLocaleString()}, we've calculated your tax liability.`,
    });
  };

  const handleSave = () => {
    const selectedResult = results[regime];
    
    if (onSaveTaxDetails) {
      onSaveTaxDetails({
        regime,
        income,
        taxableIncome: selectedResult.taxableIncome,
        tax: selectedResult.tax,
        effectiveRate: selectedResult.effectiveRate,
        inHand: selectedResult.inHand
      });
      
      toast({
        title: "Tax Details Saved",
        description: `Your ${regime === 'old' ? 'Old' : 'New'} Regime tax calculation has been saved.`,
      });
    }
  };

  const handleDeductionChange = (id: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setDeductions(prev => ({
      ...prev,
      [id]: numValue
    }));
  };

  // Update calculations whenever inputs change
  useEffect(() => {
    if (income > 0) {
      handleCalculate();
    }
  }, [income, regime, deductions]);

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString('en-IN', {
      maximumFractionDigits: 0
    })}`;
  };

  const getBetterRegime = () => {
    if (results.old.tax < results.new.tax) return 'old';
    return 'new';
  };

  const betterRegime = getBetterRegime();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <CardTitle>Income Tax Calculator</CardTitle>
        </div>
        <CardDescription>
          Compare tax liability under Old vs New tax regime
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="annual-income">Annual Income (Gross)</Label>
          <Input
            id="annual-income"
            type="number"
            placeholder="Enter your annual income"
            value={income || ''}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>

        <div>
          <Label className="mb-2 block">Select Tax Regime</Label>
          <RadioGroup
            value={regime}
            onValueChange={(value) => setRegime(value as TaxRegime)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="old" id="old-regime" />
              <Label htmlFor="old-regime">Old Regime (with deductions)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new-regime" />
              <Label htmlFor="new-regime">New Regime (no deductions, lower rates)</Label>
            </div>
          </RadioGroup>
        </div>

        {regime === 'old' && (
          <div className="space-y-4">
            <h3 className="font-medium">Eligible Deductions</h3>
            {DEDUCTIONS.map((deduction) => (
              <div key={deduction.id} className="grid grid-cols-2 gap-4 items-center">
                <Label htmlFor={`deduction-${deduction.id}`}>
                  {deduction.name}
                  {deduction.max && <span className="text-xs text-muted-foreground ml-1">(Max {formatCurrency(deduction.max)})</span>}
                </Label>
                <Input
                  id={`deduction-${deduction.id}`}
                  type="number"
                  placeholder="0"
                  value={deductions[deduction.id] || ''}
                  onChange={(e) => handleDeductionChange(deduction.id, e.target.value)}
                  className="max-w-xs"
                />
              </div>
            ))}
          </div>
        )}

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="old-regime">Old Regime</TabsTrigger>
            <TabsTrigger value="new-regime">New Regime</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center font-medium">Details</div>
              <div className="text-center font-medium">Old Regime</div>
              <div className="text-center font-medium">New Regime</div>
              
              <div>Taxable Income</div>
              <div className={`text-right ${betterRegime === 'old' ? 'font-medium text-green-600' : ''}`}>
                {formatCurrency(results.old.taxableIncome)}
              </div>
              <div className={`text-right ${betterRegime === 'new' ? 'font-medium text-green-600' : ''}`}>
                {formatCurrency(results.new.taxableIncome)}
              </div>
              
              <div>Tax Amount</div>
              <div className={`text-right ${betterRegime === 'old' ? 'font-medium text-green-600' : ''}`}>
                {formatCurrency(results.old.tax)}
              </div>
              <div className={`text-right ${betterRegime === 'new' ? 'font-medium text-green-600' : ''}`}>
                {formatCurrency(results.new.tax)}
              </div>
              
              <div>Effective Tax Rate</div>
              <div className={`text-right ${betterRegime === 'old' ? 'font-medium text-green-600' : ''}`}>
                {results.old.effectiveRate.toFixed(2)}%
              </div>
              <div className={`text-right ${betterRegime === 'new' ? 'font-medium text-green-600' : ''}`}>
                {results.new.effectiveRate.toFixed(2)}%
              </div>
              
              <div>In-hand Income</div>
              <div className={`text-right ${betterRegime === 'old' ? 'font-medium text-green-600' : ''}`}>
                {formatCurrency(results.old.inHand)}
              </div>
              <div className={`text-right ${betterRegime === 'new' ? 'font-medium text-green-600' : ''}`}>
                {formatCurrency(results.new.inHand)}
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                Recommendation: {betterRegime === 'old' ? 'Old' : 'New'} Tax Regime
              </p>
              <p className="text-sm text-muted-foreground">
                {betterRegime === 'old' 
                  ? `You save ${formatCurrency(results.new.tax - results.old.tax)} with the Old Regime.`
                  : `You save ${formatCurrency(results.old.tax - results.new.tax)} with the New Regime.`
                }
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="old-regime" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Annual Income:</span>
                <span className="font-medium">{formatCurrency(income)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deductions:</span>
                <span className="font-medium">{formatCurrency(Object.values(deductions).reduce((a, b) => a + b, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span className="font-medium">{formatCurrency(results.old.taxableIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Amount:</span>
                <span className="font-medium">{formatCurrency(results.old.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Effective Tax Rate:</span>
                <span className="font-medium">{results.old.effectiveRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>In-hand Income:</span>
                <span className="font-medium">{formatCurrency(results.old.inHand)}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="new-regime" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Annual Income:</span>
                <span className="font-medium">{formatCurrency(income)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span className="font-medium">{formatCurrency(results.new.taxableIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Amount:</span>
                <span className="font-medium">{formatCurrency(results.new.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Effective Tax Rate:</span>
                <span className="font-medium">{results.new.effectiveRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>In-hand Income:</span>
                <span className="font-medium">{formatCurrency(results.new.inHand)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleCalculate}>Recalculate</Button>
        <Button onClick={handleSave}>Save Calculation</Button>
      </CardFooter>
    </Card>
  );
};

export default TaxCalculator;
