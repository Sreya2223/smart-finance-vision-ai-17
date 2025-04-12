
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TaxSummaryCardProps {
  taxData?: {
    regime: string;
    income: number;
    tax: number;
    inHand: number;
  };
  currency?: string;
  isLoading?: boolean;
}

const TaxSummaryCard: React.FC<TaxSummaryCardProps> = ({ 
  taxData, 
  currency = '₹',
  isLoading = false 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Tax Summary
        </CardTitle>
        <CardDescription>
          {taxData ? `${taxData.regime === 'old' ? 'Old' : 'New'} Tax Regime` : 'No tax calculation yet'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
          </div>
        ) : taxData ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Annual Income</span>
              <span className="font-medium">{currency}{taxData.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tax Amount</span>
              <span className="font-medium text-red-600">{currency}{taxData.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">In-hand Income</span>
              <span className="font-medium text-green-600">{currency}{taxData.inHand.toLocaleString()}</span>
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/tax-calculator">
                  View Details <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Calculate your taxes to see how much you could save
            </p>
            <Button asChild>
              <Link to="/tax-calculator">
                Calculate Taxes
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxSummaryCard;
