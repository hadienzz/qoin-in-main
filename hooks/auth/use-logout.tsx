"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      toast.success("Logout berhasil!");

      // Redirect to home page
      router.push("/");
      router.refresh();
    },
    onError: () => {
      return toast.error("Logout gagal!");
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return {
    handleLogout,
    isPending,
  };
};

export default useLogout;
