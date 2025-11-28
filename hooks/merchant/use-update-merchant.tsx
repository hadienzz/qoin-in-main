import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UpdateMerchantData {
  id: string;
  name?: string;
  type?: string;
  location?: string;
  description?: string;
  google_maps_url?: string;
  iframe_map_url?: string;
  profile_photo?: File | null;
  banner_img?: File | null;
  gallery_photos?: (File | string)[];
  latitude?: number;
  longitude?: number;
  is_transaction_active?: boolean;
}

const updateMerchant = async (data: UpdateMerchantData) => {
  const formData = new FormData();

  // Append text fields
  if (data.name) formData.append("name", data.name);
  if (data.type) formData.append("type", data.type);
  if (data.location) formData.append("location", data.location);
  if (data.description) formData.append("description", data.description);
  if (data.google_maps_url)
    formData.append("google_maps_url", data.google_maps_url);
  if (data.iframe_map_url)
    formData.append("iframe_map_url", data.iframe_map_url);
  if (data.latitude !== undefined)
    formData.append("latitude", data.latitude.toString());
  if (data.longitude !== undefined)
    formData.append("longitude", data.longitude.toString());
  if (data.is_transaction_active !== undefined)
    formData.append(
      "is_transaction_active",
      data.is_transaction_active.toString(),
    );

  // Append files
  if (data.profile_photo) {
    formData.append("profile_photo", data.profile_photo);
  }
  if (data.banner_img) {
    formData.append("banner_img", data.banner_img);
  }
  if (data.gallery_photos && data.gallery_photos.length > 0) {
    data.gallery_photos.forEach((photo) => {
      if (photo instanceof File) {
        formData.append("gallery_photos", photo);
      }
    });
  }

  const response = await axiosInstance.patch(
    `/api/v1/merchant/${data.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export default function useUpdateMerchant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      queryClient.invalidateQueries({ queryKey: ["user-merchant"] });
      toast.success("Merchant berhasil diupdate!");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal mengupdate merchant");
    },
  });

  return {
    updateMerchant: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
