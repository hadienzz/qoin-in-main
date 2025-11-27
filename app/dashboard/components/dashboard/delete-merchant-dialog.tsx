"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

interface DeleteMerchantDialogProps {
  isOpen: boolean;
  merchantName: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteMerchantDialog({
  isOpen,
  merchantName,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteMerchantDialogProps) {
  const formik = useFormik({
    initialValues: {
      confirmationName: "",
    },
    enableReinitialize: true,
    onSubmit: () => {
      onConfirm();
    },
  });

  const isMatch = formik.values.confirmationName === merchantName;

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => !isOpen}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Merchant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Ketik nama merchant
              <span className="font-semibold"> {merchantName} </span>
              untuk mengkonfirmasi penghapusan.
            </p>
            <Input
              name="confirmationName"
              placeholder={merchantName}
              value={formik.values.confirmationName}
              onChange={formik.handleChange}
            />
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="flex-1"
                variant="destructive"
                disabled={isDeleting || !isMatch}
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </Button>
              <Button
                type="button"
                className="flex-1"
                variant="outline"
                onClick={onClose}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
