import { Table } from '@/types/pos';
import { formatCurrency, formatTime } from '@/lib/pos-utils';
import { Clock, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TableCardProps {
  table: Table;
  onViewDetails: (table: Table) => void;
  onPayBill: (table: Table) => void;
}

export function TableCard({ table, onViewDetails, onPayBill }: TableCardProps) {
  const displayedItems = table.items.slice(0, 4);
  const remainingCount = table.items.length - 4;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{table.name.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{table.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{table.id}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-status-open/10 text-status-open border-0">
          <Clock className="w-3 h-3 mr-1" />
          Open
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{formatTime(table.createdAt)}</p>

      {table.items.length > 0 ? (
        <div className="space-y-2 mb-4">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-xs text-muted-foreground font-medium">
            <span>Items</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
          </div>
          {displayedItems.map((item, index) => (
            <div key={`${item.description}-${index}`} className="grid grid-cols-[1fr_auto_auto] gap-2 text-sm">
              <span className="text-card-foreground truncate">{item.description}</span>
              <span className="text-center text-muted-foreground">{item.quantity}</span>
              <span className="text-right font-medium">{formatCurrency(item.unit_price * item.quantity)}</span>
            </div>
          ))}
          {remainingCount > 0 && (
            <p className="text-xs text-muted-foreground">+{remainingCount} more</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4 py-4 text-center">No items yet</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <span className="text-xs text-muted-foreground">Total</span>
          <p className="text-lg font-bold text-card-foreground">{formatCurrency(table.total)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(table)}>
            See Details
          </Button>
          <Button size="sm" onClick={() => onPayBill(table)} disabled={table.items.length === 0}>
            <Receipt className="w-4 h-4 mr-1" />
            Pay Bill
          </Button>
        </div>
      </div>
    </div>
  );
}
