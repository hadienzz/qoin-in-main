"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Heart } from "lucide-react";
import useClickLike from "@/hooks/landing-page/use-click-like";
import RatingStar from "../icons/rating-star";
import { DisplayMerchantType } from "@/types";
import { useRouter } from "next/navigation";

interface displayMerchantProps {
  displayMerchant?: DisplayMerchantType;
  isLoading?: boolean;
}

const DisplayMerchant = ({
  displayMerchant,
  isLoading,
}: displayMerchantProps) => {
  const router = useRouter();
  const { isLiked, toggleLike } = useClickLike();
  const handleToMerchant = (id: string) => {
    router.push(`/merchant/${id}`);
  };

  // Generate price if minPrice is null or undefined
  const displayPrice =
    displayMerchant?.minPrice || Math.floor(Math.random() * 30000) + 10000; // 10k-40k

  return (
    <Card
      className="p-0 rounded-[20px] overflow-hidden group hover:box-shadow-lg transition-all duration-300 hover:shadow-primary cursor-pointer"
      onClick={() => handleToMerchant(displayMerchant?.id as string)}
    >
      <CardHeader className="!p-0 relative overflow-hidden w-full h-[140px] md:h-[180px] lg:h-[220px]">
        <div
          className={`size-8 md:size-9 lg:size-10 absolute top-2 md:top-3 right-2 md:right-3 ${
            isLiked ? "bg-primary" : "bg-[#FFD6A7]"
          } rounded-full flex items-center justify-center z-100`}
          onClick={toggleLike}
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 transition duration-300 ${
              isLiked ? "text-[#FFD6A7] fill-current" : "text-primary"
            }`}
          />
        </div>
        <Image
          src={displayMerchant?.profilePhotoUrl || "/images/profile-img.png"}
          alt="Toko"
          fill
          className="bg-contain overflow-hidden group-hover:scale-[117%] transition-all duration-500"
        />
      </CardHeader>
      <CardContent className="px-3 pb-3 md:px-4 md:pb-4 -mt-5">
        <div className="text-[#8D8D8D] flex items-center gap-1.5 md:gap-2">
          <p className="text-[10px] md:text-xs lg:text-base">1.20 km</p>
          <p className="text-base md:text-xl lg:text-2xl">•</p>
          <p className="text-[10px] md:text-xs lg:text-base">10-20 menit</p>
        </div>
        <div className="space-y-2 md:space-y-3">
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-secondary line-clamp-1">
            {displayMerchant?.name}
          </p>

          <div>
            <div className="flex items-center text-[#606060]">
              <span className="size-[24px] md:size-[28px] lg:size-[30px] relative flex items-center justify-center">
                <RatingStar className="size-[14px] md:size-[16px] lg:size-[18px] text-[#F8C600]" />
              </span>
              <p className="ml-1.5 md:ml-2 text-[10px] md:text-xs lg:text-base">
                4.5{" "}
              </p>
              <p className="ml-2 md:ml-3 text-[10px] md:text-xs lg:text-base">
                (100) Ulasan
              </p>
            </div>
            <p className="text-primary text-xs md:text-sm lg:text-base xl:text-lg font-bold mt-2 md:mt-3">
              Mulai dari Rp. {displayPrice.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayMerchant;
