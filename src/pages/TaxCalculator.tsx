
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TaxCalculator, { TaxDetails } from '@/components/dashboard/tax/TaxCalculator';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { saveTaxCalculation, getTaxCalculation } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const TaxCalculatorPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '₹';
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

  // Fetch saved tax calculation if available
  const { data: savedTaxDetails, isLoading } = useQuery({
    queryKey: ['taxCalculation'],
    queryFn: async () => {
      try {
        return await getTaxCalculation();
      } catch (error: any) {
        console.error('Error fetching tax calculation:', error);
        // We don't show an error toast here as it's normal not to have a saved calculation
        return null;
      }
    }
  });

  const handleSaveTaxDetails = async (details: TaxDetails) => {
    try {
      await saveTaxCalculation(details);
      queryClient.invalidateQueries({ queryKey: ['taxCalculation'] });
      
      // Also invalidate transactions and other related queries to ensure synchronization
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgetData'] });
      
      toast({
        title: "Tax Calculation Saved",
        description: "Your tax calculation has been saved and will be reflected in your financial reports.",
      });
    } catch (error: any) {
      console.error('Error saving tax calculation:', error);
      toast({
        title: "Error Saving Calculation",
        description: error.message || "There was a problem saving your tax calculation.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tax Calculator</h1>
          <p className="text-muted-foreground">Calculate and compare your tax liability under different tax regimes</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {savedTaxDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Previously Saved Calculation</CardTitle>
                <CardDescription>
                  Your last saved tax calculation from {new Date(savedTaxDetails.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Regime:</span>
                    <span className="font-medium">{savedTaxDetails.regime === 'old' ? 'Old' : 'New'} Regime</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Income:</span>
                    <span className="font-medium">{selectedCurrency}{savedTaxDetails.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Amount:</span>
                    <span className="font-medium">{selectedCurrency}{savedTaxDetails.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In-hand Income:</span>
                    <span className="font-medium">{selectedCurrency}{savedTaxDetails.in_hand.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <TaxCalculator 
            onSaveTaxDetails={handleSaveTaxDetails}
            currency={selectedCurrency}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaxCalculatorPage;
