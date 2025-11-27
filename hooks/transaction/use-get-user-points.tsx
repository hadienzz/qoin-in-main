import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useGetUserPoints = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-points"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/auth/user/points");

      return response.data;
    },
  });

  const qoinBalance =
    data?.data.reduce(
      (acc: number, cur: { amount?: number }) => acc + (cur.amount ?? 0),
      0,
    ) ?? 0;
  return {
    pointData: data?.data,
    pointLoading: isLoading,
    qoinBalance,
  };
};

export default useGetUserPoints;
