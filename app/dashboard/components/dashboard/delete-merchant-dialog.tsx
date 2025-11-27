"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Hapus Merchant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
