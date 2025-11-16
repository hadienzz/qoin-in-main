import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const STORAGE_KEY = "__qoin_user_cache__";

const readInitialUser = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? undefined;
  } catch {
    return undefined;
  }
};

const useGetUser = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/auth/user", {
          withCredentials: true, // kalau perlu
        });
        return response.data; // misal { id, name, email, ... }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // BUKAN error fatal, cuma artinya belum login
          return null;
        }
        throw error;
      }
    },
    initialData: typeof window !== "undefined" ? readInitialUser() : undefined,
    staleTime: 0, // selalu up-to-date dulu aja
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    gcTime: 5 * 60 * 1000,
  });

  // Sinkron ke localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (data) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data, updatedAt: Date.now() })
        );
      } else {
        // data === null -> belum login, hapus cache
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [data]);

  return { data, isLoading, isError, isLoggedIn: !!data };
};

export default useGetUser;
