import { useState } from 'react';
import { Account, AccountCategory } from '@/types/finance';
import { formatCurrency } from '@/lib/currency';
import { ACCOUNT_CATEGORY_META } from '@/lib/accountMetadata';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  showCurrentAssets?: boolean;
  showNonCurrentAssets?: boolean;
  showCurrentLiabilities?: boolean;
  showNonCurrentLiabilities?: boolean;
}

export const AccountList = ({
  accounts, 
  onEdit, 
  onDelete,
  showCurrentAssets = true,
  showNonCurrentAssets = true,
  showCurrentLiabilities = true,
  showNonCurrentLiabilities = true,
}: AccountListProps) => {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [liabilitiesOpen, setLiabilitiesOpen] = useState(true);
  
  const visibilityMap: Record<AccountCategory, boolean> = {
    current_asset: showCurrentAssets,
    non_current_asset: showNonCurrentAssets,
    current_liability: showCurrentLiabilities,
    non_current_liability: showNonCurrentLiabilities,
  };

  if (accounts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No accounts yet. Add your first account to get started.</p>
      </Card>
    );
  }

  const assetCategories: AccountCategory[] = ['current_asset', 'non_current_asset'];
  const liabilityCategories: AccountCategory[] = ['current_liability', 'non_current_liability'];
  
  const hasAssets = assetCategories.some(cat => 
    visibilityMap[cat] && accounts.some(acc => acc.category === cat)
  );
  
  const hasLiabilities = liabilityCategories.some(cat => 
    visibilityMap[cat] && accounts.some(acc => acc.category === cat)
  );

  const renderCategorySection = (category: AccountCategory) => {
    if (!visibilityMap[category]) return null;
    
    const categoryAccounts = accounts.filter(acc => acc.category === category);
    if (categoryAccounts.length === 0) return null;

    const meta = ACCOUNT_CATEGORY_META[category];
    const Icon = meta.icon;

    return (
      <div key={category} className="mb-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="h-5 w-5 text-primary" />
            <h4 className="text-base font-semibold text-foreground">
              {meta.label}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground ml-7">
            {meta.subtitle}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {categoryAccounts.map((account) => (
            <div
              key={account.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors gap-3 sm:gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">
                    {account.name}
                  </p>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {account.currency}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Updated: {new Date(account.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <p className="text-base sm:text-lg font-semibold text-foreground flex-shrink-0">
                  {formatCurrency(account.balance, account.currency)}
                </p>
                
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(account)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(account.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <ScrollArea className="h-[600px] pr-2 sm:pr-4">
        <div className="space-y-6">
          {/* Assets Section */}
          {hasAssets && (
            <Collapsible open={assetsOpen} onOpenChange={setAssetsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-lg font-bold">A</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-foreground">Assets</h3>
                      <p className="text-sm text-muted-foreground">
                        {accounts.filter(a => a.category.includes('asset')).length} accounts
                      </p>
                    </div>
                  </div>
                  {assetsOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-0 animate-accordion-down">
                {assetCategories.map(category => renderCategorySection(category))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Separator between Assets and Liabilities */}
          {hasAssets && hasLiabilities && <Separator />}

          {/* Liabilities Section */}
          {hasLiabilities && (
            <Collapsible open={liabilitiesOpen} onOpenChange={setLiabilitiesOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 text-lg font-bold">L</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-foreground">Liabilities</h3>
                      <p className="text-sm text-muted-foreground">
                        {accounts.filter(a => a.category.includes('liability')).length} accounts
                      </p>
                    </div>
                  </div>
                  {liabilitiesOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-0 animate-accordion-down">
                {liabilityCategories.map(category => renderCategorySection(category))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
