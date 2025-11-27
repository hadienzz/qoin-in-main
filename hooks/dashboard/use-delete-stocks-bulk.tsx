"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteStocksBulk = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (stockIds: string[]) => {
      const res = await axiosInstance.delete("/api/stocks", {
        data: { stock_ids: stockIds },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      toast.success("Produk terpilih berhasil dihapus.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menghapus produk terpilih.");
    },
  });

  return {
    deleteStocksBulk: mutateAsync,
    isDeletingBulk: isPending,
  };
};

export default useDeleteStocksBulk;
