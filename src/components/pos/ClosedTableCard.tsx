import { Table } from '@/types/pos';
import { formatCurrency, formatTime, formatDate } from '@/lib/pos-utils';
import { CheckCircle2, CreditCard, Banknote, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClosedTableCardProps {
  table: Table;
}

const paymentIcons = {
  cash: Banknote,
  credit: CreditCard,
  debit: Wallet,
};

const paymentLabels = {
  cash: 'Cash',
  credit: 'Credit Card',
  debit: 'Debit Card',
};

export function ClosedTableCard({ table }: ClosedTableCardProps) {
  const PaymentIcon = table.paymentMethod ? paymentIcons[table.paymentMethod] : CreditCard;
  const paymentLabel = table.paymentMethod ? paymentLabels[table.paymentMethod] : 'Unknown';

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <span className="text-sm font-bold text-success">{table.name.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{table.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{table.id}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      </div>

      <div className="text-xs text-muted-foreground mb-3 space-y-1">
        <p>Opened: {formatTime(table.createdAt)}</p>
        {table.closedAt && <p>Closed: {formatTime(table.closedAt)}</p>}
      </div>

      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/50">
        <PaymentIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{paymentLabel}</span>
      </div>

      <div className="space-y-1 mb-4 max-h-32 overflow-y-auto">
        {table.items.map((item, index) => (
          <div key={`${item.description}-${index}`} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.description} x{item.quantity}
            </span>
            <span className="font-medium">{formatCurrency(item.unit_price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">Total Paid</span>
        <p className="text-xl font-bold text-success">{formatCurrency(table.total)}</p>
      </div>
    </div>
  );
}
