import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import useClickLike from "@/hooks/landing-page/use-click-like";
import { Heart } from "lucide-react";
import Clock from "../icons/clock-icon";
import RightArrow from "../icons/right-arrow";

const InspiratedItem = () => {
  const { isLiked, toggleLike } = useClickLike();
  return (
    <Card className="p-0 rounded-[20px] overflow-hidden group hover:shadow-lg transition-all duration-300 hover:shadow-primary/20">
      <CardHeader className="!p-0 relative overflow-hidden w-full h-[160px] md:h-[180px] lg:h-[200px]">
        <div
          className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 absolute top-2 right-2 md:top-3 md:right-3 ${
            isLiked ? "bg-primary" : "bg-[#FFD6A7]"
          } rounded-full flex items-center justify-center z-100 cursor-pointer hover:scale-110 transition-transform duration-200`}
          onClick={toggleLike}
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 transition duration-300 ${
              isLiked ? "text-[#FFD6A7] fill-current" : "text-primary"
            }`}
          />
        </div>
        <Image
          src={"/images/cafe-image.png"}
          alt="Toko"
          fill
          className="w-full h-full object-cover overflow-hidden group-hover:scale-110 transition-all duration-500"
        />
      </CardHeader>
      <CardContent className="p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4">
        <h1 className="text-[#606060] text-sm md:text-base lg:text-lg xl:text-[22px] font-semibold line-clamp-2 leading-tight">
          5 Ide Masakan Low Budget
        </h1>
        <p className="text-xs md:text-sm lg:text-base xl:text-lg font-medium text-[#8D8D8D] line-clamp-2 leading-relaxed">
          Cuma modal 30 ribu, kamu udah bisa masak ayam kremes dan tumis sayur
          yang mirip...
        </p>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:justify-between md:items-center pt-2 md:pt-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
            <p className="text-xs md:text-sm lg:text-base text-[#8D8D8D]">
              5 Menit baca
            </p>
          </div>
          <div className="flex items-center cursor-pointer gap-1.5 md:gap-2 group/link hover:gap-2.5 transition-all duration-200">
            <p className="text-primary text-xs md:text-sm lg:text-base font-medium">
              Baca Selengkapnya
            </p>
            <RightArrow className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary group-hover/link:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspiratedItem;
