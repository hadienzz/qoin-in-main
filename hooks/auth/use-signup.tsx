"use client";

import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as yup from "yup";

export interface SignupValues {
  email: string;
  password: string;
}

export const schema = yup.object({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .required("Password wajib diisi"),
});

const useSignup = () => {
  const signupRequest = async (values: SignupValues) => {
    const response = await axiosInstance.post("/api/auth/signup", values);
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: signupRequest,
    onError: () => {
      return toast.error("Gagal melakukan signup");
    },
    onSuccess: () => {
      return toast.success("Signup berhasil! Silahkan login.");
    },
  });

  const formik = useFormik<SignupValues>({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      mutate(values);
      //   formik.resetForm();
    },
  });

  return { formik, isSubmitting: isPending };
};

export default useSignup;
