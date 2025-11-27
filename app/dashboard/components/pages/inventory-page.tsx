"use client";

import { useState } from "react";
import { DataTable } from "@/app/dashboard/components/dashboard/data-table";
import { FilterBar } from "@/app/dashboard/components/dashboard/filter-bar";
import { ProductFormModal } from "../dashboard/product-form-modal";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import useAddProduct from "@/hooks/dashboard/use-add-product";
import useDeleteStock from "@/hooks/dashboard/use-delete-stock";
import useDeleteStocksBulk from "@/hooks/dashboard/use-delete-stocks-bulk";
import { Merchant } from "@/types";

interface InventoryPageProps {
  merchant?: Merchant | null;
  isLoading?: boolean;
}

export function InventoryPage({ merchant, isLoading }: InventoryPageProps) {
  const { formik, handleCloseModal, handleOpenModal, openModal } =
    useAddProduct();

  const [selectedStockIds, setSelectedStockIds] = useState<string[]>([]);
  const { deleteStock, isDeleting } = useDeleteStock();
  const { deleteStocksBulk, isDeletingBulk } = useDeleteStocksBulk();

  const merchantStocks = Array.isArray(merchant?.stocks) ? merchant.stocks : [];

  const handleSelectionChange = (nextSelectedRowIds: string[]) => {
    setSelectedStockIds(nextSelectedRowIds);
  };

  const handleBulkDelete = async () => {
    if (selectedStockIds.length === 0) return;
    await deleteStocksBulk(selectedStockIds);
    setSelectedStockIds([]);
  };

  const handleRowDelete = (ids: string[]) => {
    if (!ids.length) return;
    deleteStock(ids[0]);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground text-3xl font-bold">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            disabled={
              selectedStockIds.length === 0 || isDeleting || isDeletingBulk
            }
            onClick={handleBulkDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeletingBulk
              ? "Deleting..."
              : `Delete Selected (${selectedStockIds.length})`}
          </Button>

          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <FilterBar searchPlaceholder="Search products..." />

      <DataTable
        title="Products"
        columns={[
          { key: "name", label: "Product Name" },
          { key: "quantity", label: "Quantity" },
          { key: "price", label: "Price" },
        ]}
        data={merchantStocks}
        isLoading={isLoading}
        withSelection
        selectedRowIds={selectedStockIds}
        onSelectionChange={handleSelectionChange}
        getRowId={(row) => String((row as { id: string }).id)}
        onDeleteRows={handleRowDelete}
      />

      <ProductFormModal
        isOpen={openModal}
        onClose={handleCloseModal}
        formik={formik}
      />
    </div>
  );
}
