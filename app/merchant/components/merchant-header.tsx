"use client";
import Check from "@/components/icons/check";
import FluentChat from "@/components/icons/fluent-chat";
import LocationIcon from "@/components/icons/location";
import RatingStar from "@/components/icons/rating-star";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Merchant } from "@/types";
import { Flag } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Store from "@/components/icons/store";
import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DialogSignup from "@/components/shared/dialog-signup";
import DialogLogin from "@/components/shared/dialog-login";
import DialogLoginEmail from "@/components/shared/dialog-login-email";
import useGetMerchantHasFollowed from "@/hooks/merchant/use-get-merchant-has-followed";
import useFollowMerchant from "@/hooks/merchant/use-follow-merchant";
import useUnfollowMerchant from "@/hooks/merchant/use-unfollow-merchant";

type MerchantInfo = {
  amount: number | string | undefined;
  text: string;
};

interface MerchantHeaderProps {
  isLoading: boolean;
  merchant: Merchant | null;
}
const MerchantHeader = ({ isLoading, merchant }: MerchantHeaderProps) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: user } = useGetUser();
  const { data: followData, isLoading: isLoadingFollowed } =
    useGetMerchantHasFollowed();
  const isFollowed = followData?.data === true;

  const { handleFollow, isPending: isFollowPending } = useFollowMerchant();
  const { handleUnfollow, isPending: isUnfollowPending } =
    useUnfollowMerchant();

  const isPendingFollowStatus = isFollowPending || isUnfollowPending;

  const {
    openModal,
    closeModal,
    defaultModalIsOpen,
    onCloseSignup,
    signInIsOpen,
    signUpIsOpen,
  } = useOpenModal();

  const isAuthenticated = !!user;
  const isGoogleMapUrl = merchant?.google_map_url;

  const handleSubmitReport = () => {
    toast.success("Terima kasih, laporanmu sudah kami terima.");
    setReportOpen(false);
    setSelectedCategory(null);
  };

  const handleFollowClick = () => {
    if (!merchant?.id) return;

    if (!isAuthenticated) {
      openModal("default"); // buka dialog login
      return;
    }

    if (isFollowed) {
      handleUnfollow(merchant.id);
    } else {
      handleFollow(merchant.id);
    }
  };

  const heroSrc = merchant?.profilePhotoUrl || "/images/merchant-image.png";

  const merchantInfo: MerchantInfo[] = [
    { amount: merchant?.stocks?.length ?? 0, text: "Produk" },
    { amount: merchant?.selledStocks?.length ?? 0, text: "Terjual" },
    { amount: merchant?.total_follower ?? 0, text: "Pengikut" },
  ];

  return (
    <>
      <Section className="!px-0 py-4 md:py-6">
        <PageContainer>
          <div className="relative grid-cols-2 gap-4 lg:grid lg:items-start lg:gap-6">
            {isLoading ? (
              <Skeleton className="h-[220px] w-full md:h-[260px] lg:h-[340px] lg:rounded-3xl" />
            ) : (
              <Image
                src={heroSrc}
                alt={`Foto ${merchant?.name || "merchant"}`}
                className="h-[220px] w-full object-cover md:h-[260px] lg:h-[340px] lg:rounded-3xl"
                width={1200}
                height={300}
                priority
              />
            )}

            <div className="absolute inset-x-0 -bottom-12 flex justify-center px-4 lg:static lg:mt-0">
              <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:px-6 md:py-6 lg:max-w-none">
                <div className="flex items-center justify-between gap-3 lg:w-full">
                  <div className="flex-col-reverse gap-3 lg:flex lg:w-full">
                    <div>
                      {isLoading ? (
                        <Skeleton className="mt-2 h-4 w-[200px] rounded-lg" />
                      ) : (
                        <h1 className="line-clamp-2 text-xl font-extrabold text-[#333] md:text-2xl lg:text-[30px]">
                          {merchant?.name || "Merchant"}
                        </h1>
                      )}
                      <div className="mt-2 hidden items-center gap-1.5 lg:flex">
                        {isLoading ? (
                          <Skeleton className="mt-7 h-4 w-[120px] rounded" />
                        ) : (
                          <>
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span
                                key={idx}
                                className="hidden lg:inline-block"
                              >
                                <RatingStar className="text-yellow-400" />
                              </span>
                            ))}
                            <h1 className="text-base font-semibold text-[#333] md:text-lg lg:text-[22px]">
                              4.9
                            </h1>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="relative mt-2 flex w-full space-x-2 font-semibold lg:mt-0">
                      {isLoading ? (
                        <Skeleton className="h-8 w-[150px]" />
                      ) : (
                        <Badge className="border-primary text-primary bg-[#FFF7ED] lg:px-3 lg:py-2">
                          <LocationIcon className="text-transparent" />
                          <p className="text-xs font-semibold lg:text-base">
                            2 km dari lokasimu
                          </p>
                        </Badge>
                      )}
                      {isLoading ? (
                        <Skeleton className="h-8 w-[150px]" />
                      ) : merchant?.verified ? (
                        <Badge className="mt-2 border border-[#7BF1A8] bg-[#E6FFEF] text-[#027A48] lg:px-3 lg:py-2">
                          <Check />
                          <p className="text-xs font-semibold lg:text-base">
                            Terverifikasi
                          </p>
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  {isLoading ? (
                    <Skeleton className="h-[44px] w-[120px] rounded-lg lg:hidden" />
                  ) : (
                    <div className="bg-primary rounded-lg border shadow-md lg:hidden">
                      <div className="flex shrink-0 items-center justify-center gap-2 px-3 py-1 font-bold text-white">
                        <p className="text-sm lg:text-base">4,8</p>
                        <RatingStar className="text-yellow-400" />
                      </div>
                      <div className="flex items-center gap-1 bg-white p-1">
                        <FluentChat className="size-3 text-[#808080]" />
                        <p className="text-xs">128 ulasan</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-around md:mt-6 lg:justify-start lg:gap-16 xl:gap-20">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="space-y-2 text-center">
                          <Skeleton className="mx-auto h-6 w-16" />
                          <Skeleton className="mx-auto h-4 w-20" />
                        </div>
                      ))
                    : merchantInfo.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <h1 className="text-primary text-[20px] font-bold lg:text-[25px]">
                            {item.amount}
                          </h1>
                          <p className="text-[#8D8D8D]">{item.text}</p>
                        </div>
                      ))}
                </div>
                {isLoading ? (
                  <Skeleton className="mt-4 h-10 w-28 rounded" />
                ) : (
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 md:mt-6">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleFollowClick}
                        disabled={isPendingFollowStatus}
                        className="bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] px-5 py-2.5 text-sm md:px-6 md:py-3 md:text-base lg:text-lg"
                      >
                        {isFollowed ? "Mengikuti" : "Ikuti"}
                      </Button>
                      {isGoogleMapUrl && (
                        <Link
                          href={(merchant?.google_map_url as string) ?? ""}
                          target="_blank"
                        >
                          <Button
                            variant="outline"
                            className="px-5 py-2.5 text-sm md:px-6 md:py-3 md:text-base"
                          >
                            Lihat Peta
                          </Button>
                        </Link>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setReportOpen(true)}
                      variant="outline"
                      className="flex items-center gap-2 border-[#FFD5D5] bg-[#FFF5F5] px-4 py-2.5 text-sm text-[#ED3437] hover:bg-[#FFE5E5] hover:text-[#ED3437] md:px-5 md:py-2.5 md:text-base"
                    >
                      <Flag className="h-4 w-4" />
                      <span>Laporkan</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageContainer>

        {/* Dialog Laporkan Merchant */}
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogContent className="w-[90vw] max-w-xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-extrabold text-[#333]">
                Laporkan Merchant
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-[#606060]">
                Bantu kami menjaga kualitas merchant di platform Qoin.in
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="flex flex-col gap-1 rounded-2xl border bg-[#FFF7ED] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Store />
                  <p className="text-sm font-semibold text-[#333] md:text-base">
                    {merchant?.name ?? "Merchant"}
                  </p>
                </div>
                <p className="text-xs text-[#8D8D8D] md:text-sm">
                  {merchant?.location ?? "Lokasi merchant tidak tersedia"}
                </p>
              </div>

              <div>
                <p className="text-secondary mb-2 text-sm font-semibold">
                  Pilih Kategori Laporan
                </p>
                <RadioGroup
                  value={selectedCategory ?? ""}
                  onValueChange={(val: string) => setSelectedCategory(val)}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="report-fake"
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 hover:bg-[#FFF7ED]"
                  >
                    <RadioGroupItem
                      id="report-fake"
                      value="fake"
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#333]">
                        Merchant Fiktif / Tidak Ditemukan
                      </span>
                      <span className="block text-xs text-[#8D8D8D]">
                        Merchant tidak ada di lokasi yang tertera
                      </span>
                    </span>
                  </Label>

                  <Label
                    htmlFor="report-location"
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 hover:bg-[#FFF7ED]"
                  >
                    <RadioGroupItem
                      id="report-location"
                      value="location"
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#333]">
                        Alamat / Lokasi Salah
                      </span>
                      <span className="block text-xs text-[#8D8D8D]">
                        Lokasi di peta tidak sesuai dengan lokasi sebenarnya
                      </span>
                    </span>
                  </Label>

                  <Label
                    htmlFor="report-photo"
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 hover:bg-[#FFF7ED]"
                  >
                    <RadioGroupItem
                      id="report-photo"
                      value="photo"
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#333]">
                        Foto Tidak Sesuai
                      </span>
                      <span className="block text-xs text-[#8D8D8D]">
                        Foto tidak sesuai dengan kondisi merchant
                      </span>
                    </span>
                  </Label>
                </RadioGroup>
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full rounded-2xl bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] py-3 text-sm text-white md:text-base"
                onClick={handleSubmitReport}
                disabled={!selectedCategory}
              >
                Kirim Laporan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Section>

      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogSignup open={signUpIsOpen} onClose={onCloseSignup} />
      <DialogLoginEmail open={signInIsOpen} onClose={closeModal} />
    </>
  );
};

export default MerchantHeader;
