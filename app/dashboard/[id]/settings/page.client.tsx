"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import useUpdateMerchant from "@/hooks/merchant/use-update-merchant";
import Image from "next/image";

export default function SettingsClient({ merchantId }: { merchantId: string }) {
  const router = useRouter();
  const { merchant, isLoading } = useGetMerchantById(merchantId);
  const { updateMerchant, isUpdating } = useUpdateMerchant();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    description: "",
    google_maps_url: "",
    is_transaction_active: true,
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [bannerImg, setBannerImg] = useState<File | null>(null);
  const [bannerImgPreview, setBannerImgPreview] = useState<string>("");

  // Initialize form data when merchant loads
  useEffect(() => {
    if (merchant) {
      setFormData({
        name: merchant.name || "",
        type: merchant.type || "",
        location: merchant.location || "",
        description: merchant.description || "",
        google_maps_url: merchant.google_map_url || "",
        is_transaction_active: merchant.is_transaction_active ?? true,
      });
      setProfilePhotoPreview(merchant.profilePhotoUrl || "");
      setBannerImgPreview(merchant.bannerImageUrl || "");
    }
  }, [merchant]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_transaction_active: checked }));
  };

  const handleProfilePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfilePhoto(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleBannerImgChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setBannerImg(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setBannerImgPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData = {
      id: merchantId,
      name: formData.name,
      type: formData.type,
      location: formData.location,
      description: formData.description,
      google_maps_url: formData.google_maps_url,
      is_transaction_active: formData.is_transaction_active,
      profile_photo: profilePhoto,
      banner_img: bannerImg,
    };

    updateMerchant(updateData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-border sticky top-0 z-10 border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/dashboard/${merchantId}`)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-foreground truncate text-xl font-bold sm:text-2xl">
                Pengaturan Toko
              </h1>
              <p className="text-muted-foreground truncate text-xs sm:text-sm">
                Kelola informasi dan pengaturan toko Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Transaction Status Card */}
          <Card className="border-primary/20 from-card to-primary/5 bg-gradient-to-br">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Status Transaksi
              </CardTitle>
              <CardDescription>
                Aktifkan atau nonaktifkan kemampuan transaksi toko Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-foreground font-semibold">
                      Terima Transaksi
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        formData.is_transaction_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {formData.is_transaction_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {formData.is_transaction_active
                      ? "Toko aktif dan dapat menerima transaksi dari pelanggan melalui Qoin"
                      : "Toko hanya untuk display, pelanggan tidak dapat melakukan transaksi"}
                  </p>
                </div>
                <Switch
                  checked={formData.is_transaction_active}
                  onCheckedChange={handleTransactionToggle}
                  className="shrink-0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Store Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>
                Update informasi dasar toko Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Toko *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama toko"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipe Toko *</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Contoh: Restaurant, Cafe, Retail"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat toko"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Google Maps URL</Label>
                <Input
                  id="google_maps_url"
                  name="google_maps_url"
                  value={formData.google_maps_url}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ceritakan tentang toko Anda"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Store Images Card */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Toko</CardTitle>
              <CardDescription>
                Update foto profil dan banner toko Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="space-y-2">
                <Label>Foto Profil</Label>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  {profilePhotoPreview && (
                    <div className="border-border relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 sm:h-24 sm:w-24">
                      <Image
                        src={profilePhotoPreview}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="w-full flex-1">
                    <Input
                      id="profile_photo"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="profile_photo"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm transition"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Foto Profil
                    </Label>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Rekomendasi: Persegi (1:1), maksimal 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Banner Image */}
              <div className="space-y-2">
                <Label>Banner Toko</Label>
                <div className="space-y-4">
                  {bannerImgPreview && (
                    <div className="border-border relative h-40 w-full overflow-hidden rounded-lg border-2 sm:h-48">
                      <Image
                        src={bannerImgPreview}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      id="banner_img"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImgChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="banner_img"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm transition"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Banner
                    </Label>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Rekomendasi: Landscape (16:9), maksimal 5MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="bg-background/95 sticky bottom-0 flex flex-col justify-end gap-3 pt-4 pb-4 backdrop-blur-sm sm:flex-row sm:bg-transparent sm:pb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/${merchantId}`)}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full min-w-32 sm:w-auto"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
