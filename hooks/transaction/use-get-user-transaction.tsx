"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useGetUserTransactions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-transactions"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/stocks/user/transactions");

      return response.data;
    },
  });

  return {
    data,
    isLoading,
  };
};

export default useGetUserTransactions;
