import { Table } from '@/types/pos';
import { ClosedTableCard } from './ClosedTableCard';
import { formatCurrency, formatDate } from '@/lib/pos-utils';
import { Search, Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';

interface ClosedTablesViewProps {
  tables: Table[];
}

export function ClosedTablesView({ tables }: ClosedTablesViewProps) {
  const [search, setSearch] = useState('');

  const filteredTables = useMemo(() => {
    if (!search.trim()) return tables;
    const query = search.toLowerCase();
    return tables.filter(
      (table) =>
        table.name.toLowerCase().includes(query) ||
        table.id.toLowerCase().includes(query)
    );
  }, [tables, search]);

  const totalRevenue = tables.reduce((sum, t) => sum + t.total, 0);
  const todaysTables = tables.filter(
    (t) => t.closedAt && new Date(t.closedAt).toDateString() === new Date().toDateString()
  );
  const todaysRevenue = todaysTables.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground">{formatDate(new Date())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Today's Orders</p>
          <p className="text-2xl font-bold">{todaysTables.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Today's Revenue</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(todaysRevenue)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTables
            .sort((a, b) => (b.closedAt?.getTime() || 0) - (a.closedAt?.getTime() || 0))
            .map((table) => (
              <ClosedTableCard key={table.id} table={table} />
            ))}
        </div>
      ) : tables.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No closed tables match your search.</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No Order History</h3>
          <p className="text-muted-foreground">Closed orders will appear here.</p>
        </div>
      )}
    </div>
  );
}
