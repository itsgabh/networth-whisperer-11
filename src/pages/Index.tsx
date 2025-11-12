import { useState, useMemo } from 'react';
import { Account, Currency, NetWorthSummary, ConversionRate } from '@/types/finance';
import { NetWorthCard } from '@/components/NetWorthCard';
import { AccountList } from '@/components/AccountList';
import { AccountDialog } from '@/components/AccountDialog';
import { ConversionRateDialog } from '@/components/ConversionRateDialog';
import { Button } from '@/components/ui/button';
import { Plus, Wallet, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { defaultConversionRates } from '@/lib/currency';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [ratesDialogOpen, setRatesDialogOpen] = useState(false);
  const [conversionRates, setConversionRates] = useState<ConversionRate[]>(defaultConversionRates);
  const { toast } = useToast();

  const summary: NetWorthSummary = useMemo(() => {
    const currencies: Currency[] = ['EUR', 'USD', 'GBP', 'PHP'];
    const result: NetWorthSummary = {
      totalAssets: {} as Record<Currency, number>,
      totalLiabilities: {} as Record<Currency, number>,
      netWorth: {} as Record<Currency, number>,
      totalAssetsEUR: 0,
      totalLiabilitiesEUR: 0,
      netWorthEUR: 0,
    };

    const getRateToEUR = (currency: Currency): number => {
      const rate = conversionRates.find((r) => r.currency === currency);
      return rate?.rate || 1;
    };

    currencies.forEach((currency) => {
      const assets = accounts
        .filter((acc) => acc.currency === currency && acc.category.includes('asset'))
        .reduce((sum, acc) => sum + acc.balance, 0);

      const liabilities = accounts
        .filter((acc) => acc.currency === currency && acc.category.includes('liability'))
        .reduce((sum, acc) => sum + acc.balance, 0);

      result.totalAssets[currency] = assets;
      result.totalLiabilities[currency] = liabilities;
      result.netWorth[currency] = assets - liabilities;

      // Convert to EUR
      const rate = getRateToEUR(currency);
      result.totalAssetsEUR += assets * rate;
      result.totalLiabilitiesEUR += liabilities * rate;
    });

    result.netWorthEUR = result.totalAssetsEUR - result.totalLiabilitiesEUR;

    return result;
  }, [accounts, conversionRates]);

  const handleSaveAccount = (accountData: Omit<Account, 'id' | 'lastUpdated'>) => {
    if (editAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editAccount.id
            ? { ...accountData, id: acc.id, lastUpdated: new Date() }
            : acc
        )
      );
      toast({
        title: 'Account updated',
        description: `${accountData.name} has been updated successfully.`,
      });
    } else {
      const newAccount: Account = {
        ...accountData,
        id: crypto.randomUUID(),
        lastUpdated: new Date(),
      };
      setAccounts((prev) => [...prev, newAccount]);
      toast({
        title: 'Account added',
        description: `${accountData.name} has been added successfully.`,
      });
    }
    setEditAccount(null);
  };

  const handleEditAccount = (account: Account) => {
    setEditAccount(account);
    setDialogOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    const account = accounts.find((acc) => acc.id === id);
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    toast({
      title: 'Account deleted',
      description: `${account?.name} has been removed.`,
      variant: 'destructive',
    });
  };

  const handleAddNew = () => {
    setEditAccount(null);
    setDialogOpen(true);
  };

  const handleSaveRates = (rates: ConversionRate[]) => {
    setConversionRates(rates);
    toast({
      title: 'Conversion rates updated',
      description: 'Your currency conversion rates have been saved.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Wallet className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">Net Worth Tracker</h1>
                <p className="text-muted-foreground">
                  Track your financial position across multiple currencies
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setRatesDialogOpen(true)}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Conversion Rates
            </Button>
          </div>
        </div>

        {/* Net Worth Summary Card */}
        <div className="mb-8">
          <NetWorthCard
            assetsEUR={summary.totalAssetsEUR}
            liabilitiesEUR={summary.totalLiabilitiesEUR}
            isMainCard={true}
          />
        </div>

        {/* Add Account Button */}
        <div className="mb-6">
          <Button onClick={handleAddNew} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Account
          </Button>
        </div>

        {/* Account Lists */}
        {accounts.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Assets</h2>
                <AccountList
                  accounts={accounts}
                  category="current_asset"
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
                <AccountList
                  accounts={accounts}
                  category="non_current_asset"
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Liabilities</h2>
                <AccountList
                  accounts={accounts}
                  category="current_liability"
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
                <AccountList
                  accounts={accounts}
                  category="non_current_liability"
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No accounts yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your net worth by adding your first account
            </p>
            <Button onClick={handleAddNew} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Your First Account
            </Button>
          </div>
        )}

        {/* Dialogs */}
        <AccountDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveAccount}
          editAccount={editAccount}
        />
        
        <ConversionRateDialog
          open={ratesDialogOpen}
          onOpenChange={setRatesDialogOpen}
          rates={conversionRates}
          onSave={handleSaveRates}
        />
      </div>
    </div>
  );
};

export default Index;
