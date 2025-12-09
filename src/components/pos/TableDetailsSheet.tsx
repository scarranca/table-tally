import { Table, MenuItem } from '@/types/pos';
import { formatCurrency } from '@/lib/pos-utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { defaultMenuItems } from '@/lib/pos-utils';

interface TableDetailsSheetProps {
  table: Table | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (tableId: string, item: Omit<MenuItem, 'category' | 'id'>) => void;
  onRemoveItem: (tableId: string, itemDescription: string) => void;
}

export function TableDetailsSheet({
  table,
  open,
  onOpenChange,
  onAddItem,
  onRemoveItem,
}: TableDetailsSheetProps) {
  const [search, setSearch] = useState('');

  const filteredMenuItems = useMemo(() => {
    if (!search.trim()) return defaultMenuItems;
    return defaultMenuItems.filter((item) =>
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    filteredMenuItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredMenuItems]);

  if (!table) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {table.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="block">{table.name}</span>
              <span className="text-xs text-muted-foreground font-mono font-normal">
                {table.id}
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Current Order */}
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold mb-3">Current Order</h3>
            {table.items.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {table.items.map((item, index) => (
                  <div key={`${item.description}-${index}`} className="flex items-center justify-between bg-card rounded-lg p-2">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.description}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatCurrency(item.unit_price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onRemoveItem(table.id, item.description)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onAddItem(table.id, { description: item.description, unit_price: item.unit_price, product_key: item.product_key, unit_key: item.unit_key })}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No items added yet. Add items from the menu below.
              </p>
            )}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold">{formatCurrency(table.total)}</span>
            </div>
          </div>

          {/* Menu Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Menu Items */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {category}
                  </h4>
                  <div className="grid gap-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onAddItem(table.id, { description: item.description, unit_price: item.unit_price, product_key: item.product_key, unit_key: item.unit_key })}
                        className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <span className="font-medium text-sm">{item.description}</span>
                        <span className="text-sm text-muted-foreground">{formatCurrency(item.unit_price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
