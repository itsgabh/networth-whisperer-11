export type Currency = 'USD' | 'EUR' | 'GBP';

export type AccountCategory = 
  | 'current_asset'
  | 'non_current_asset'
  | 'current_liability'
  | 'non_current_liability';

export interface Account {
  id: string;
  name: string;
  category: AccountCategory;
  currency: Currency;
  balance: number;
  lastUpdated: Date;
}

export interface NetWorthSummary {
  totalAssets: Record<Currency, number>;
  totalLiabilities: Record<Currency, number>;
  netWorth: Record<Currency, number>;
}
