import { Card, CardContent } from "../ui/card";
import Coins from "@/components/icons/coins";
import ShoppingBag from "@/components/icons/shopping-bag";
import PageContainer from "./page-container";
import Section from "./section";
import ShinyButton from "./shiny-button";
import useGetUser from "@/hooks/auth/use-get-user";

interface CallingActionProps {
  openModal: (open: string) => void;
}
const CallingAction = ({ openModal }: CallingActionProps) => {
  const { data } = useGetUser();
  const isAuthenticated = !!data;

  return (
    <Section className="mt-15">
      <PageContainer>
        <Card className="relative mx-auto flex min-h-[320px] items-center justify-center overflow-hidden bg-[linear-gradient(86deg,#FD6700_4.98%,#FF8E0D_48.74%,#FD6700_91.22%)] text-center md:min-h-[340px] lg:h-[275px] lg:w-10/11">
          {/* Decorative icons */}
          <div className="pointer-events-none select-none">
            <Coins className="absolute top-0 left-0 h-32 w-32 lg:size-[280px]" />
            <ShoppingBag className="absolute top-0 right-0 h-32 w-32 lg:size-[280px]" />
          </div>
          <CardContent className="relative w-full px-4 py-10 text-white md:px-6 md:py-12 lg:px-8 lg:py-12">
            <h1 className="text-xl leading-tight font-extrabold md:text-3xl lg:text-[40px]">
              Mulai perjalananmu bareng Qoin.in
            </h1>
            <p className="mt-3 px-4 text-sm font-medium md:mt-4 md:px-8 md:text-lg lg:mt-5 lg:px-12 lg:text-[22px]">
              Yuk, jadi bagian dari komunitas yang dukung UMKM lokal!
            </p>
            <ShinyButton
              className="mt-6 mb-4 md:mt-8 md:mb-0 lg:mt-[35px]"
              onClick={
                !isAuthenticated ? () => openModal("default") : undefined
              }
            >
              Gabung Sekarang
            </ShinyButton>
          </CardContent>
        </Card>
      </PageContainer>
    </Section>
  );
};

export default CallingAction;
