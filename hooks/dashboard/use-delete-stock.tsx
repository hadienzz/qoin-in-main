"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteStock = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (stockId: string) => {
      const res = await axiosInstance.delete(`/api/stocks/${stockId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      toast.success("Produk berhasil dihapus.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menghapus produk.");
    },
  });

  return {
    deleteStock: mutateAsync,
    isDeleting: isPending,
  };
};

export default useDeleteStock;
