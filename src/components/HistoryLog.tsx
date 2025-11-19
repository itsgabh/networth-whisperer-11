import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { HistorySnapshot } from '@/types/history';
import { Currency, ConversionRate } from '@/types/finance';
import { formatCurrency } from '@/lib/currency';
import { History, TrendingUp, TrendingDown, Trash2, TrashIcon, Copy } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryLogProps {
  snapshots: HistorySnapshot[];
  onDelete: (id: string) => void;
  onDuplicate: (snapshot: HistorySnapshot) => void;
  onClearAll: () => void;
  displayCurrency?: Currency;
  conversionRates?: ConversionRate[];
}

const convertFromEURTo = (amountEUR: number, targetCurrency: Currency, conversionRates: ConversionRate[]): number => {
  if (targetCurrency === 'EUR') return amountEUR;
  const rate = conversionRates.find((r) => r.currency === targetCurrency);
  if (!rate || rate.rate === 0) return amountEUR;
  return amountEUR / rate.rate;
};

export const HistoryLog = ({ snapshots, onDelete, onDuplicate, onClearAll, displayCurrency = 'EUR', conversionRates = [] }: HistoryLogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snapshotToDelete, setSnapshotToDelete] = useState<string | null>(null);
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleDeleteClick = (id: string) => {
    setSnapshotToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (snapshotToDelete) {
      onDelete(snapshotToDelete);
      setSnapshotToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  if (snapshots.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">History Log</h2>
        </div>
        {sortedSnapshots.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearAll}
            className="gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {sortedSnapshots.map((snapshot, index) => {
          const prevSnapshot = sortedSnapshots[index + 1];
          const change = prevSnapshot
            ? snapshot.netWorthEUR - prevSnapshot.netWorthEUR
            : 0;
          const changePercent = prevSnapshot
            ? ((change / prevSnapshot.netWorthEUR) * 100)
            : 0;

          return (
            <div
              key={snapshot.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(snapshot.timestamp), 'PPpp')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {snapshot.accountCount} accounts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {prevSnapshot && change !== 0 && (
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {change > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {change > 0 ? '+' : ''}
                      {formatCurrency(convertFromEURTo(change, displayCurrency, conversionRates), displayCurrency)} ({changePercent.toFixed(1)}%)
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicate(snapshot)}
                    className="h-8 w-8 p-0"
                    title="Duplicate snapshot"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(snapshot.id)}
                    className="h-8 w-8 p-0"
                    title="Delete snapshot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Net Worth</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(convertFromEURTo(snapshot.netWorthEUR, displayCurrency, conversionRates), displayCurrency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assets</p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(convertFromEURTo(snapshot.totalAssetsEUR, displayCurrency, conversionRates), displayCurrency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Liabilities</p>
                  <p className="text-sm font-semibold text-red-600">
                    {formatCurrency(convertFromEURTo(snapshot.totalLiabilitiesEUR, displayCurrency, conversionRates), displayCurrency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Liquid Net Worth</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatCurrency(convertFromEURTo(snapshot.liquidNetWorthEUR, displayCurrency, conversionRates), displayCurrency)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Snapshot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this snapshot? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
