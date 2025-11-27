"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FormikProps } from "formik";
import type { EditStockForm } from "@/hooks/dashboard/use-edit-stock";

interface EditProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<EditStockForm>;
}

export function EditProductFormModal({
  isOpen,
  onClose,
  formik,
}: EditProductFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-full max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Product Name
            </label>
            <input
              type="text"
              value={formik.values.name}
              name="name"
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <input
              type="text"
              value={formik.values.description}
              name="description"
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Price</label>
            <input
              type="number"
              value={formik.values.price}
              name="price"
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Stock</label>
            <input
              type="number"
              value={formik.values.quantity}
              name="quantity"
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
