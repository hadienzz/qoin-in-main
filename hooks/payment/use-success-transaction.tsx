import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const useSuccessTransaction = () => {
  const [showArrivedDialog, setShowArrivedDialog] = useState(false);

  const queryClient = useQueryClient();
  const handleSuccssTransaction = () => {
    const response = axiosInstance.post("/");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => handleSuccssTransaction,
    onSuccess: () => {
      localStorage.removeItem("orderStatus");
      localStorage.removeItem("qoin.cart");
      localStorage.removeItem("grandTotal");
    },
    onError: () => {},
  });

  return {
    showArrivedDialog,
    setShowArrivedDialog,
  };
};

export default useSuccessTransaction;
