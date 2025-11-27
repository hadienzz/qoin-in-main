"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const useGetMerchantHasFollowed = (overrideId?: string) => {
  const params = useParams();
  let merchantId =
    overrideId ?? (params?.merchantId as string | string[] | undefined);
  if (Array.isArray(merchantId)) merchantId = merchantId[0];

  const enabled = !!merchantId && typeof merchantId === "string";

  const handleGetMerchantHasFollowed = async () => {
    const response = await axiosInstance.get(
      `/api/merchant/follow-status/${merchantId}`,
    );

    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryFn: handleGetMerchantHasFollowed,
    queryKey: ["merchant-follow-status", merchantId],
    enabled,
  });

  return {
    data,
    isLoading,
    isError,
    isEnabled: enabled,
  };
};

export default useGetMerchantHasFollowed;
