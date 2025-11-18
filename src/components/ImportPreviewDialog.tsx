import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Database, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

interface ImportPreviewData {
  schemaVersion?: number;
  accountCount: number;
  snapshotCount: number;
  currencies: string[];
  hasMonthlyExpenses: boolean;
  hasRetirementInputs: boolean;
}

interface ImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewData: ImportPreviewData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ImportPreviewDialog = ({
  open,
  onOpenChange,
  previewData,
  onConfirm,
  onCancel,
}: ImportPreviewDialogProps) => {
  if (!previewData) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Preview</DialogTitle>
          <DialogDescription>
            Review the data before importing. This will replace your current data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {previewData.schemaVersion !== 1 && (
            <Card className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Schema Version Mismatch
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Expected version 1, found {previewData.schemaVersion ?? 'unknown'}. Import may fail.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Schema Version</p>
                <p className="text-sm text-muted-foreground">
                  {previewData.schemaVersion ?? 'Not specified'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-foreground">Accounts</p>
                <p className="text-sm text-muted-foreground">
                  {previewData.accountCount} account{previewData.accountCount !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-foreground">History Snapshots</p>
                <p className="text-sm text-muted-foreground">
                  {previewData.snapshotCount} snapshot{previewData.snapshotCount !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold text-foreground">Currencies</p>
                <p className="text-sm text-muted-foreground">
                  {previewData.currencies.length > 0 
                    ? previewData.currencies.join(', ') 
                    : 'None'}
                </p>
              </div>
            </div>
          </Card>

          {previewData.hasMonthlyExpenses && (
            <p className="text-xs text-muted-foreground">✓ Monthly expenses included</p>
          )}
          {previewData.hasRetirementInputs && (
            <p className="text-xs text-muted-foreground">✓ Retirement planning inputs included</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
