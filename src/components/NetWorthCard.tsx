import { Card } from '@/components/ui/card';
import { Currency } from '@/types/finance';
import { formatCurrency } from '@/lib/currency';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface NetWorthCardProps {
  currency: Currency;
  assets: number;
  liabilities: number;
}

export const NetWorthCard = ({ currency, assets, liabilities }: NetWorthCardProps) => {
  const netWorth = assets - liabilities;
  const isPositive = netWorth >= 0;

  return (
    <Card className="p-6 border-2 bg-gradient-to-br from-card to-secondary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Net Worth ({currency})
          </h3>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-success" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
        </div>
        
        <div>
          <p className={`text-4xl font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(netWorth, currency)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(assets, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(liabilities, currency)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
