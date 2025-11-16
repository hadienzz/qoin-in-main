import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { schema } from "./use-signup";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface LoginValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const queryClient = useQueryClient();

  const handleLogin = async (values: LoginValues) => {
    const response = await axiosInstance.post("/api/auth/signin", values);
    return response.data;
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (values: LoginValues) => handleLogin(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      return toast.success("Login berhasil!");
    },
    onError: () => {
      return toast.error("Gagal melakukan login");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values: LoginValues) => {
      mutate(values);
    },
    validationSchema: schema,
  });

  return { formik, isSubmitting: isPending };
};

export default useLogin;
