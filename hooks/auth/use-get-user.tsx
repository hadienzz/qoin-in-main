import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const useGetUser = () => {
  const handleGetUser = async () => {
    const response = await axiosInstance.get("/api/auth/user");

    return response.data;
  };

  // Read any previously cached user snapshot from localStorage (client-only)
  let initialData: unknown | undefined = undefined;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("__qoin_user_cache__");
      if (raw) {
        const parsed = JSON.parse(raw);
        initialData = parsed?.data;
      }
    } catch {}
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: handleGetUser,
    // Use cached data immediately to prevent UI flicker, then refresh in background
    initialData,
    staleTime: 60_000, // 1 minute
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't spam retries on unauthorized
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    gcTime: 5 * 60 * 1000,
  });

  // Persist fresh snapshot for next page load whenever data changes
  useEffect(() => {
    if (!data) return;

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "__qoin_user_cache__",
          JSON.stringify({ data, updatedAt: Date.now() })
        );
      }
    } catch {}
  }, [data]);

  // Clear cache on auth errors
  useEffect(() => {
    if (!isError) return;

    // We don't have direct error object here, but if you want
    // to clear on any error, you can keep this simple.
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("__qoin_user_cache__");
      }
    } catch {}
  }, [isError]);
  return { data, isLoading, isError };
};

export default useGetUser;
