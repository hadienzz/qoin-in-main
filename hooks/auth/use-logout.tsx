import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      return toast.success("Logout berhasil!");
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
