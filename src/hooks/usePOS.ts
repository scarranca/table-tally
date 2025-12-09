import { useState, useCallback } from "react";
import { Table, OrderItem, PaymentMethod } from "@/types/pos";
import { generateOrderId, calculateTotal } from "@/lib/pos-utils";

export function usePOS() {
  const [tables, setTables] = useState<Table[]>([]);

  const createTable = useCallback((name: string): Table => {
    const newTable: Table = {
      id: generateOrderId(),
      name,
      status: "open",
      items: [],
      createdAt: new Date(),
      total: 0,
    };
    setTables((prev) => [...prev, newTable]);
    return newTable;
  }, []);

  const addItemToTable = useCallback(
    (tableId: string, item: Omit<OrderItem, "id" | "quantity">) => {
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== tableId) return table;

          const existingItem = table.items.find(
            (i) => i.description === item.description
          );
          let newItems: OrderItem[];

          if (existingItem) {
            newItems = table.items.map((i) =>
              i.description === item.description
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          } else {
            newItems = [...table.items, { ...item, id: null, quantity: 1 }];
          }

          return {
            ...table,
            items: newItems,
            total: calculateTotal(newItems),
          };
        })
      );
    },
    []
  );

  const removeItemFromTable = useCallback(
    (tableId: string, itemDescription: string) => {
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== tableId) return table;

          const newItems = table.items
            .map((item) => {
              if (item.description !== itemDescription) return item;
              return item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : null;
            })
            .filter(Boolean) as OrderItem[];

          return {
            ...table,
            items: newItems,
            total: calculateTotal(newItems),
          };
        })
      );
    },
    []
  );

  const closeTable = useCallback(
    (tableId: string, paymentMethod: PaymentMethod) => {
      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? {
                ...table,
                status: "paid" as const,
                closedAt: new Date(),
                paymentMethod,
              }
            : table
        )
      );
    },
    []
  );

  const deleteTable = useCallback((tableId: string) => {
    setTables((prev) => prev.filter((table) => table.id !== tableId));
  }, []);

  const openTables = tables.filter((t) => t.status === "open");
  const closedTables = tables.filter((t) => t.status === "paid");

  return {
    tables,
    openTables,
    closedTables,
    createTable,
    addItemToTable,
    removeItemFromTable,
    closeTable,
    deleteTable,
  };
}
