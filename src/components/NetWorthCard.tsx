import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface NetWorthCardProps {
  assetsEUR: number;
  liabilitiesEUR: number;
  isMainCard?: boolean;
}

export const NetWorthCard = ({ assetsEUR, liabilitiesEUR, isMainCard = false }: NetWorthCardProps) => {
  const netWorth = assetsEUR - liabilitiesEUR;
  const isPositive = netWorth >= 0;

  return (
    <Card className={`p-6 ${isMainCard ? 'border-4 border-primary bg-gradient-to-br from-primary/5 to-primary/10' : 'border-2 bg-gradient-to-br from-card to-secondary/20'}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMainCard && <Wallet className="h-5 w-5 text-primary" />}
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {isMainCard ? 'Total Net Worth (EUR)' : 'Net Worth (EUR)'}
            </h3>
          </div>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-success" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
        </div>
        
        <div>
          <p className={`${isMainCard ? 'text-5xl' : 'text-4xl'} font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(netWorth, 'EUR')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
            <p className={`${isMainCard ? 'text-xl' : 'text-lg'} font-semibold text-foreground`}>
              {formatCurrency(assetsEUR, 'EUR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
            <p className={`${isMainCard ? 'text-xl' : 'text-lg'} font-semibold text-foreground`}>
              {formatCurrency(liabilitiesEUR, 'EUR')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
