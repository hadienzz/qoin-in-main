import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { schema } from "./use-signup";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

interface LoginValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogin = async (values: LoginValues) => {
    const response = await axiosInstance.post("/api/auth/signin", values, {
      withCredentials: true, // kalau backend beda domain/port
    });
    return response.data; // pastikan backend balikin data user di sini
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleLogin,
    onSuccess: (data) => {
      // 1. Update cache React Query
      queryClient.setQueryData(["user"], data);

      // 2. (opsional) sync ke localStorage biar konsisten
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "__qoin_user_cache__",
          JSON.stringify({ data, updatedAt: Date.now() })
        );
      }

      // 3. Toast + redirectt
      toast.success("Login berhasil!");

      router.push("/"); // ganti sesuai route-mu
      router.refresh(); // biar server component baca cookie baru
    },
    onError: () => {
      toast.error("Gagal melakukan login");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values: LoginValues) => {
      mutate(values);
    },
    validationSchema: schema,
  });

  return { formik, isSubmitting: isPending };
};

export default useLogin;
