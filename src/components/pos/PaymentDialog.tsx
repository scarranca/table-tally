import { useState } from 'react';
import { Table, PaymentMethod } from '@/types/pos';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Banknote, CreditCard, Wallet, CheckCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDialogProps {
  table: Table | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmPayment: (tableId: string, paymentMethod: PaymentMethod, currency: string, email?: string) => void;
  isLoading?: boolean;
}

const paymentMethods: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'credit', label: 'Credit Card', icon: CreditCard },
  { id: 'debit', label: 'Debit Card', icon: Wallet },
];

const currencies = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'MXN', symbol: '$', label: 'Mexican Peso' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CAD', symbol: '$', label: 'Canadian Dollar' },
];

const formatCurrencyWithCode = (amount: number, currencyCode: string) => {
  const currency = currencies.find(c => c.code === currencyCode);
  return `${currency?.symbol || '$'}${amount.toFixed(2)} ${currencyCode}`;
};

const isValidEmail = (email: string) => {
  if (!email) return true; // Empty is valid since it's optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function PaymentDialog({ table, open, onOpenChange, onConfirmPayment, isLoading }: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !isValidEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleConfirm = () => {
    if (table && selectedMethod) {
      if (email && !isValidEmail(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      onConfirmPayment(table.id, selectedMethod, selectedCurrency, email || undefined);
      setSelectedMethod(null);
      setSelectedCurrency('USD');
      setEmail('');
      setEmailError('');
      onOpenChange(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEmail('');
      setEmailError('');
    }
    onOpenChange(isOpen);
  };

  if (!table) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Select a payment method to close {table.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Items</span>
              <span className="text-sm">{table.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Due</span>
              <span className="text-2xl font-bold text-primary">{formatCurrencyWithCode(table.total, selectedCurrency)}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Currency</label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Customer Email <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={cn("pl-9", emailError && "border-destructive")}
                maxLength={255}
              />
            </div>
            {emailError && (
              <p className="text-xs text-destructive mt-1">{emailError}</p>
            )}
          </div>

          <label className="text-sm font-medium mb-2 block">Payment Method</label>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all',
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    selectedMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <method.icon className="w-5 h-5" />
                </div>
                <span className="font-medium flex-1 text-left">{method.label}</span>
                {selectedMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedMethod || !!emailError || isLoading}>
            {isLoading ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
