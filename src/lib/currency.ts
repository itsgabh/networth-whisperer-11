import { Currency, ConversionRate } from '@/types/finance';

export const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  PHP: '₱',
  OTHER: '',
};

export const defaultConversionRates: ConversionRate[] = [
  { currency: 'EUR', rate: 1 },
  { currency: 'USD', rate: 0.92 },
  { currency: 'GBP', rate: 1.17 },
  { currency: 'PHP', rate: 0.016 },
];

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = currencySymbols[currency];
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    current_asset: 'Current Assets',
    non_current_asset: 'Non-Current Assets',
    current_liability: 'Current Liabilities',
    non_current_liability: 'Non-Current Liabilities',
  };
  return labels[category] || category;
};
