import axiosInstance from "@/lib/axios";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const useUnfollowMerchant = (overrideId?: string) => {
  const params = useParams();
  const queryClient = useQueryClient();
  let merchantId =
    overrideId ?? (params?.merchantId as string | string[] | undefined);
  if (Array.isArray(merchantId)) merchantId = merchantId[0];

  const handleUnfollow = (id: string) => {
    mutate(id);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(
        `/api/merchant/${id}/unfollow`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Merchant unfollowed successfully");
      queryClient.invalidateQueries({
        queryKey: ["merchant-follow-status", merchantId],
      });
    },
    onError: (error) => {
      console.error("Error unfollowing merchant:", error);
      toast.error("Failed to unfollow merchant. Please try again.");
    },
  });

  return {
    handleUnfollow,
    isPending,
  };
};

export default useUnfollowMerchant;
