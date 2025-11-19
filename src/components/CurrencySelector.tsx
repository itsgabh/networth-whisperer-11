import { Currency } from '@/types/finance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencySymbols } from '@/lib/currency';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  availableCurrencies?: Currency[];
}

export const CurrencySelector = ({ 
  value, 
  onChange,
  availableCurrencies = ['EUR', 'USD', 'PHP']
}: CurrencySelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px] bg-card">
        <SelectValue>
          {currencySymbols[value]} {value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-card z-50">
        {availableCurrencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currencySymbols[currency]} {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
