import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const useFollowMerchant = (overrideId?: string) => {
  const params = useParams();
  const queryClient = useQueryClient();
  let merchantId =
    overrideId ?? (params?.merchantId as string | string[] | undefined);
  if (Array.isArray(merchantId)) merchantId = merchantId[0];

  const handleFollow = (id: string) => {
    mutate(id);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(`/api/merchant/${id}/follow`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Merchant followed successfully");
      queryClient.invalidateQueries({
        queryKey: ["merchant-follow-status", merchantId],
      });
    },
    onError: (error) => {
      console.error("Error following merchant:", error);
      toast.error("Failed to follow merchant");
    },
  });

  return {
    handleFollow,
    isPending,
  };
};

export default useFollowMerchant;
