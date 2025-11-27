"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useToggleDisplayStock = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (params: { id: string; is_display: boolean }) => {
      const res = await axiosInstance.patch(`/api/stocks/change-display`, {
        stock_id: params.id,
        is_display: params.is_display,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      toast.success("Status display produk diperbarui.");
    },
  });

  return {
    toggleDisplay: mutateAsync,
  };
};

export default useToggleDisplayStock;
