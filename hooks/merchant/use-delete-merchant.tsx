"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useDeleteMerchant = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (merchantId: string) => {
      const res = await axiosInstance.delete(`/api/merchant/delete/${merchantId}`);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      toast.success("Merchant berhasil dihapus.");
      router.push("/user/merchant");
      
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menghapus merchant.");
    },
  });

  return {
    deleteMerchant: mutate,
    isDeletingMerchant: isPending,
  };
};

export default useDeleteMerchant;
