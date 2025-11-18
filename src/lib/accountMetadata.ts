import { AccountCategory } from '@/types/finance';
import { Wallet, TrendingUp, CreditCard, Building2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface AccountCategoryMeta {
  label: string;
  subtitle: string;
  icon: LucideIcon;
  isAsset: boolean;
  isCurrent: boolean;
}

export const ACCOUNT_CATEGORY_META: Record<AccountCategory, AccountCategoryMeta> = {
  current_asset: {
    label: 'Current Assets',
    subtitle: 'Liquid assets accessible within 12 months',
    icon: Wallet,
    isAsset: true,
    isCurrent: true,
  },
  non_current_asset: {
    label: 'Non-Current Assets',
    subtitle: 'Long-term investments and property',
    icon: TrendingUp,
    isAsset: true,
    isCurrent: false,
  },
  current_liability: {
    label: 'Current Liabilities',
    subtitle: 'Debts due within 12 months',
    icon: CreditCard,
    isAsset: false,
    isCurrent: true,
  },
  non_current_liability: {
    label: 'Non-Current Liabilities',
    subtitle: 'Long-term debts and obligations',
    icon: Building2,
    isAsset: false,
    isCurrent: false,
  },
};

export const getCategoryMeta = (category: AccountCategory): AccountCategoryMeta => {
  return ACCOUNT_CATEGORY_META[category];
};
