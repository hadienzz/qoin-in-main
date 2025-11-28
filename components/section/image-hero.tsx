"use client";

import Section from "../shared/section";
import PageContainer from "../shared/page-container";
import { Button } from "../ui/button";
import RightArrow from "../icons/right-arrow";
import { ImageHeroIcon } from "../icons/image-hero";
import ShinyButton from "../shared/shiny-button";
import SlantedImageCard from "../shared/slanted-image";
import { ExploreHero } from "../icons/explore-hero";
import GroupStars from "../icons/group-stars";
import Beam from "../icons/beam";
import GoldenRainbow from "../icons/golden-rainbow";
import { useRouter } from "next/navigation";

interface ImageHeroProps {
  isBlank?: boolean;
  isExplore?: boolean;
}

interface ImageHeroContentProps {
  title?: string;
  description?: string;
  CTAText?: string;
  onCTAClick?: () => void;
}

const ImageHeroContent = ({
  title = "Udah Cobain UMKM Viral Ini Belum? 👀",
  description = "Yuk kenalan sama para pelaku UMKM yang lagi jadi favorit netizen.",
  CTAText = "Eksplor Yuk",
  onCTAClick,
}: ImageHeroContentProps) => (
  <div className="z-10 px-4 py-6 md:px-6 md:py-8 lg:px-[41px] lg:pt-0 lg:pb-[29px]">
    <h1 className="mb-3 text-3xl leading-tight font-extrabold text-white md:mb-4 md:text-4xl lg:mb-5 lg:text-[50px]">
      {title}
    </h1>
    <p className="mb-4 text-sm leading-relaxed text-white md:mb-5 md:text-xl lg:mb-6 lg:text-2xl">
      {description}
    </p>
    <Button
      onClick={onCTAClick}
      className="group text-primary flex items-center gap-2.5 overflow-hidden border border-[#FF6800] bg-[#FFF2D9] px-5 py-5 shadow-[2px_4px_10px_rgba(233,109,0,0.4)] hover:bg-[#FFD6A7] hover:shadow-[0_4px_15px_rgba(233,167,0,0.5)] md:px-6 md:py-5 lg:px-[26px] lg:py-6"
    >
      <div>
        <p className="text-lg md:text-xl lg:text-2xl">{CTAText}</p>
      </div>

      <div className="bg-primary flex transform items-center justify-center rounded-full p-1.5 transition-all duration-300 group-hover:translate-x-2.5 md:p-2">
        <RightArrow className="h-3 w-3 text-white md:h-4 md:w-4" />
      </div>
    </Button>
  </div>
);

const ImageHero = ({ isBlank, isExplore }: ImageHeroProps) => {
  const router = useRouter();
  return (
    <Section className="mt-15">
      <PageContainer className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-[30px] bg-[linear-gradient(285deg,#F88400_32.21%,#FFA236_54.97%,#FFA236_74.75%)] px-4 py-6 md:min-h-[480px] md:px-6 md:py-8 lg:h-[508px] lg:px-0 lg:py-0">
        <GroupStars className="absolute top-0 left-0 hidden lg:block" />
        <Beam className="absolute bottom-0 hidden lg:block" />
        <GroupStars className="absolute top-12 right-0 hidden lg:block" />
        <Beam className="absolute top-0 left-0 hidden lg:block" onText />
        {isBlank ? (
          <div className="relative mx-auto items-center justify-center py-6 md:py-8 lg:flex lg:space-x-15 lg:py-0">
            <div>
              <ImageHeroIcon className="mx-auto size-[300px] lg:size-[350px] lg:w-full" />
            </div>
            <div className="mt-6 flex flex-col items-center justify-center px-4 md:mt-8 md:px-6 lg:-mt-0 lg:block lg:px-0">
              <p className="mb-4 max-w-[579px] text-center text-2xl leading-tight font-bold text-white md:mb-6 md:text-3xl lg:mb-0 lg:text-start lg:text-[50px]">
                Dukung UMKM lokal, dapetin reward tiap kali belanja!
              </p>
              <ShinyButton
                className="mx-auto mt-4 md:mt-6 lg:mx-0 lg:mt-[30px]"
                onClick={() => router.push("/merchant/type/Semua")}
              >
                Eksplor Sekarang
              </ShinyButton>
            </div>
          </div>
        ) : !isExplore && !isBlank ? (
          <div className="h-full w-full items-center justify-center lg:flex">
            <ImageHeroContent />
            <div className="lg:animate-top-marquee animate-marquee-sm -mr-20 flex space-y-20 lg:block">
              {Array.from({ length: 10 }).map((_, idx) => {
                return (
                  <div
                    key={idx}
                    className="mt-12 flex space-y-20 lg:mt-20 lg:block"
                  >
                    <SlantedImageCard
                      key={idx}
                      src="/images/slanted-image-2.png"
                      alt="Coins"
                      className="absolute lg:rotate-90"
                    />
                    <SlantedImageCard
                      key={idx + 1}
                      src="/images/slanted-image-1.png"
                      alt="Coins"
                      className="absolute lg:rotate-270"
                    />
                  </div>
                );
              })}
            </div>
            <div className="lg:animate-top-marquee-reverse mr-20 hidden space-y-20 lg:block">
              {Array.from({ length: 10 }).map((_, idx) => {
                return (
                  <div key={idx} className="space-y-20">
                    <SlantedImageCard
                      src="/images/slanted-image-3.png"
                      alt="Coins"
                      className="absolute top-1/4 rotate-90"
                    />
                    <SlantedImageCard
                      src="/images/slanted-image-4.png"
                      alt="Coins"
                      className="absolute top-1/4 rotate-270"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          isExplore && (
            <div className="relative w-full px-6 py-6 md:px-8 md:py-8 lg:px-[41px] lg:py-0">
              <GoldenRainbow className="absolute right-0 z-10 -translate-y-12" />
              <div className="flex flex-col items-center gap-6 md:gap-8 lg:flex-row lg:gap-10">
                {/* TEKS */}
                <div className="z-1000 -mb-42 w-full lg:mb-0 lg:block lg:w-1/2">
                  <ImageHeroContent
                    title="Cari Spot yang Vibes-nya Kamu Banget!"
                    description="Tiap tempat punya karakter. Spill, gaya nongkrong atau jajan kamu yang mana?"
                    CTAText="Eksplor Sekarang"
                    onCTAClick={() => router.push("/explore")}
                  />
                </div>

                <div className="mt-6 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
                  <ExploreHero className="z-1000 -mb-16 w-[220px] sm:w-[260px] md:w-[300px] lg:-mb-12 lg:w-[380px] xl:w-[420px]" />
                </div>
              </div>
            </div>
          )
        )}
      </PageContainer>
    </Section>
  );
};

export default ImageHero;
