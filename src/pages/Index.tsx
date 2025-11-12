import { useState, useMemo } from 'react';
import { Account, Currency, NetWorthSummary } from '@/types/finance';
import { NetWorthCard } from '@/components/NetWorthCard';
import { AccountList } from '@/components/AccountList';
import { AccountDialog } from '@/components/AccountDialog';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const { toast } = useToast();

  const summary: NetWorthSummary = useMemo(() => {
    const currencies: Currency[] = ['USD', 'EUR', 'GBP'];
    const result: NetWorthSummary = {
      totalAssets: {} as Record<Currency, number>,
      totalLiabilities: {} as Record<Currency, number>,
      netWorth: {} as Record<Currency, number>,
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
    });

    return result;
  }, [accounts]);

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

  const activeCurrencies = useMemo(() => {
    return (['USD', 'EUR', 'GBP'] as Currency[]).filter(
      (currency) =>
        summary.totalAssets[currency] > 0 || summary.totalLiabilities[currency] > 0
    );
  }, [summary]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Net Worth Tracker</h1>
          </div>
          <p className="text-muted-foreground">
            Track your financial position across multiple currencies
          </p>
        </div>

        {/* Net Worth Summary Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {activeCurrencies.length > 0 ? (
            activeCurrencies.map((currency) => (
              <NetWorthCard
                key={currency}
                currency={currency}
                assets={summary.totalAssets[currency]}
                liabilities={summary.totalLiabilities[currency]}
              />
            ))
          ) : (
            <div className="col-span-full">
              <NetWorthCard
                currency="USD"
                assets={0}
                liabilities={0}
              />
            </div>
          )}
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

        {/* Account Dialog */}
        <AccountDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveAccount}
          editAccount={editAccount}
        />
      </div>
    </div>
  );
};

export default Index;
