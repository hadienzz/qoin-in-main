"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";

export type EditStockForm = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
};

const useEditStock = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (initial?: Partial<EditStockForm>) => {
    if (initial) {
      formik.setValues({
        id: initial.id ?? "",
        name: initial.name ?? "",
        quantity: Number(initial.quantity ?? 0),
        price: Number(initial.price ?? 0),
        description: initial.description ?? "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: EditStockForm) => {
      const payload = {
        name: values.name,
        quantity: values.quantity,
        price: values.price,
        description: values.description,
      };
      const res = await axiosInstance.patch(`/api/stocks/${values.id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      toast.success("Produk berhasil diubah.");
      handleCloseModal();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal mengubah produk.");
    },
  });

  const formik = useFormik<EditStockForm>({
    initialValues: {
      id: "",
      name: "",
      quantity: 0,
      price: 0,
      description: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return {
    openModal,
    handleOpenModal,
    handleCloseModal,
    formik,
    isPending,
  };
};

export default useEditStock;
