import { useState } from "react";
import { usePOS } from "@/hooks/usePOS";
import { useGigstack } from "@/hooks/useGigstack";
import { Table, PaymentMethod } from "@/types/pos";
import { POSSidebar } from "@/components/pos/POSSidebar";
import { OpenTablesView } from "@/components/pos/OpenTablesView";
import { ClosedTablesView } from "@/components/pos/ClosedTablesView";
import { CreateTableDialog } from "@/components/pos/CreateTableDialog";
import { TableDetailsSheet } from "@/components/pos/TableDetailsSheet";
import { PaymentDialog } from "@/components/pos/PaymentDialog";
import { toast } from "@/hooks/use-toast";

const PAYMENT_FORM_CODES: Record<PaymentMethod, string> = {
  cash: "01",
  credit: "04",
  debit: "28",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<"tables" | "history">("tables");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const {
    openTables,
    closedTables,
    createTable,
    addItemToTable,
    removeItemFromTable,
    closeTable,
  } = usePOS();
  const { registerPayment, isLoading: isPaymentLoading } = useGigstack();

  const handleCreateTable = (name: string) => {
    const newTable = createTable(name);
    toast({
      title: "Table Created",
      description: `${name} (${newTable.id}) is now open.`,
    });
  };

  const handleViewDetails = (table: Table) => {
    setSelectedTable(table);
    setDetailsSheetOpen(true);
  };

  const handlePayBill = (table: Table) => {
    setSelectedTable(table);
    setPaymentDialogOpen(true);
  };

  const handleConfirmPayment = async (
    tableId: string,
    paymentMethod: PaymentMethod,
    currency: string,
    email?: string
  ) => {
    const table = openTables.find((t) => t.id === tableId);
    if (!table) return;

    const client = email
      ? {
          search: {
            on_value: email || null,
            on_key: "email",
            auto_create: email ? true : false,
          },
          name: table.name,
        }
      : {
          name: table.name,
        };
    // Call Gigstack registerPayment
    const result = await registerPayment({
      client,
      currency,
      payment_form: PAYMENT_FORM_CODES[paymentMethod],
      metadata: {
        orderId: table.id,
        orderID: table.id,
      },
      items: table.items.map((item) => ({
        id: null,
        quantity: item.quantity,
        description: item.description,
        // name: item.description,
        unit_price: item.unit_price,
        product_key: item.product_key,
        unit_key: item.unit_key,
        taxes: [
          {
            factor: "Tasa",
            inclusive: true,
            rate: 0.16,
            type: "IVA",
            withholding: false,
          },
        ],
      })),
    });

    if (result.success) {
      closeTable(tableId, paymentMethod);
      setDetailsSheetOpen(false);
      toast({
        title: "Payment Complete",
        description: `Table closed successfully with ${paymentMethod} payment in ${currency}.${
          email ? ` Receipt will be sent to ${email}.` : ""
        }`,
      });
    } else {
      toast({
        title: "Payment Failed",
        description: result.error || "Failed to register payment",
        variant: "destructive",
      });
    }
  };

  // Keep selectedTable in sync with tables state
  const currentSelectedTable = selectedTable
    ? openTables.find((t) => t.id === selectedTable.id) ||
      closedTables.find((t) => t.id === selectedTable.id) ||
      null
    : null;

  return (
    <div className="flex min-h-screen bg-background">
      <POSSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "tables" ? (
        <OpenTablesView
          tables={openTables}
          onCreateTable={() => setCreateDialogOpen(true)}
          onViewDetails={handleViewDetails}
          onPayBill={handlePayBill}
        />
      ) : (
        <ClosedTablesView tables={closedTables} />
      )}

      <CreateTableDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateTable={handleCreateTable}
      />

      <TableDetailsSheet
        table={currentSelectedTable}
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        onAddItem={addItemToTable}
        onRemoveItem={removeItemFromTable}
      />

      <PaymentDialog
        table={currentSelectedTable}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onConfirmPayment={handleConfirmPayment}
        isLoading={isPaymentLoading}
      />
    </div>
  );
};

export default Index;
