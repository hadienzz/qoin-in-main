"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const useSuccessTransaction = () => {
  const [showArrivedDialog, setShowArrivedDialog] = useState(false);
  const { paymentId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSuccssTransaction = async () => {
    const storedData = localStorage.getItem("qoin.cart");
    const items = storedData ? JSON.parse(storedData) : [];

    const response = await axiosInstance.post(
      `/api/stocks/selled-stock/${paymentId}`,
      { items },
    );

    return response.data;
  };

  const { mutate: handleSuccess, isPending } = useMutation({
    mutationFn: async () => await handleSuccssTransaction(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["success-transaction"] });
      toast.success("Transaksi berhasil!");
      localStorage.removeItem("orderStatus");
      localStorage.removeItem("qoin.cart");
      localStorage.removeItem("grandTotal");
      router.push("/");
    },
    onError: () => {
      toast.error("Terjadi kesalahan saat memproses transaksi.");
    },
  });

  return {
    showArrivedDialog,
    setShowArrivedDialog,
    handleSuccess,
    isPending,
  };
};

export default useSuccessTransaction;
