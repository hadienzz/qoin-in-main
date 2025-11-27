import axiosInstance from "@/lib/axios";
import { LikedMerchant } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useGetFollowedMerchant = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/api/merchant/user/followed-merchant",
      );
      const { data } = response.data;
      return data;
    },
    queryKey: ["merchant-followed"],
  });

  const dataMerchant = data?.map((item: LikedMerchant) => item.merchant);

  return {
    data: dataMerchant,
    isLoading,
  };
};

export default useGetFollowedMerchant;
