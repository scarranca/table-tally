import { Table } from '@/types/pos';
import { TableCard } from './TableCard';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';

interface OpenTablesViewProps {
  tables: Table[];
  onCreateTable: () => void;
  onViewDetails: (table: Table) => void;
  onPayBill: (table: Table) => void;
}

export function OpenTablesView({ tables, onCreateTable, onViewDetails, onPayBill }: OpenTablesViewProps) {
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

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Open Tables</h1>
          <p className="text-muted-foreground">
            {tables.length} table{tables.length !== 1 ? 's' : ''} currently open
          </p>
        </div>
        <Button onClick={onCreateTable} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          New Table
        </Button>
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
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onViewDetails={onViewDetails}
              onPayBill={onPayBill}
            />
          ))}
        </div>
      ) : tables.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tables match your search.</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No Open Tables</h3>
          <p className="text-muted-foreground mb-4">Create a new table to start taking orders.</p>
          <Button onClick={onCreateTable}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Table
          </Button>
        </div>
      )}
    </div>
  );
}
