"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format-price";
import FluentChat from "@/components/icons/fluent-chat";
import Store from "@/components/icons/store";
import { MapPin, ShieldCheck } from "lucide-react";
import Box from "@/components/icons/box";
import Vespa from "@/components/icons/vespa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};
interface DriverPageProps {
  merchantName?: string;
  total: number;
}

interface StepItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active: boolean;
  idx?: number;
}

const stepItem: Omit<StepItemProps, "active">[] = [
  {
    icon: <Store />,
    title: "Menuju Merchant",
    desc: "Driver sedang menuju lokasi merchant untuk mengambil pesanan",
  },
  {
    icon: <Box />,
    title: "Mengambil Pesanan",
    desc: "Driver sedang mengambil pesanan kamu",
  },
  {
    icon: <Vespa />,
    title: "Dalam Perjalanan",
    desc: "Pesanan kamu sedang diantar",
  },
  {
    icon: <MapPin />,
    title: "Hampir Sampai",
    desc: "Driver akan segera tiba di lokasi kamu",
  },
];

const StepItem = ({ icon, title, desc, active, idx }: StepItemProps) => {
  return (
    <div key={title} className="flex items-start gap-3">
      <div className="flex flex-col justify-center items-center">
        <div
          className={`flex items-center justify-center p-[5px] rounded-full ${
            active ? "text-white bg-primary" : "border-[#E5E7EB] bg-white"
          }`}
        >
          <span className="rounded-full mx-auto size-[25px] flex items-center justify-center">
            {icon}
          </span>
        </div>
        {!!idx && idx < 3 && <div className="h-10 w-px bg-[#E5E7EB]" />}
      </div>
      <div>
        <p className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
          {title}
        </p>
        <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D]">{desc}</p>
      </div>
    </div>
  );
};

const DriverPage = ({ merchantName }: DriverPageProps) => {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(() =>
    new Array(stepItem.length).fill(false)
  );

  const totalPrice = items.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  );

  const tipsFee = totalPrice * 0.01;
  const grandTotal = totalPrice + tipsFee + 20000;
  const [showArrivedDialog, setShowArrivedDialog] = useState(false);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("qoin.cart");
      if (storedItems) {
        const parsed = JSON.parse(storedItems) as OrderItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {
      // fall back to mock
    }
  }, []);

  useEffect(() => {
    if (showArrivedDialog) return;

    const interval = setInterval(() => {
      setActiveSteps((prev) => {
        const nextIndex = prev.findIndex((isActive) => !isActive);

        // semua step sudah aktif
        if (nextIndex === -1) {
          clearInterval(interval);
          setShowArrivedDialog(true);
          return prev;
        }

        const nextState = [...prev];
        nextState[nextIndex] = true;

        // kalau ini step terakhir, munculkan dialog setelah mengaktifkannya
        if (nextIndex === stepItem.length - 1) {
          clearInterval(interval);
          setShowArrivedDialog(true);
        }

        return nextState;
      });
    }, 3000);

    // clearInterval(interval);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_minmax(280px,1fr)] lg:gap-6">
      <div className="space-y-4">
        <Image
          src={"/images/image-map.png"}
          width={400}
          height={300}
          alt="Map"
          className="w-full bg-contain h-[400] rounded-lg"
        />

        {/* Shipping timeline */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-5 space-y-4">
          <h2 className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
            Informasi Pengiriman
          </h2>
          <div className="space-y-4">
            {stepItem.map((step, index) => (
              <StepItem
                key={step.title}
                {...step}
                active={activeSteps[index]}
                idx={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Driver info + order detail */}
      <div className="space-y-4">
        {/* Driver card */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-4 space-y-4">
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
            Informasi Driver
          </h3>
          <div className="flex items-center gap-3">
            {/* <div className="h-10 w-10 rounded-full bg-[#E5E7EB]" /> */}
            <Image
              width={40}
              height={40}
              src={"/images/mamat.png"}
              alt="Foto mamat"
              className="rounded-full border-2 border-primary"
            />
            <div className="space-y-0.5">
              <p className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
                Mamat
              </p>
              <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D]">
                4.9 ⭐
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[35px]">
            <div className="bg-[#FFF7ED] p-[15px] rounded-md">
              <Vespa className="text-primary" />
            </div>
            <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#8D8D8D]">
              <p>BI 1234 XYZ</p>
              <p>Honda Beat</p>
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-4 space-y-3">
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
            Detail Pesanan
          </h3>
          <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#8D8D8D]">
            <p>ID Pesanan</p>
            <p className="text-[#333] font-medium">ORD-1726990776370</p>
          </div>
          <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#8D8D8D]">
            <p>Alamat Pengiriman</p>
            <p className="leading-relaxed">
              Universitas Telkom Jakarta - Kampus Minangkabau, Jl. Minangkabau
              Barat No.50, RT.1/RW.1, Pasar Manggis, Setiabudi, South Jakarta
              City, Jakarta 12970
            </p>
          </div>
          <div className="my-2 h-px bg-[#F3F4F6]" />

          <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#333]">
            {items.map((it) => (
              <div key={it.name} className="flex items-center justify-between">
                <span>
                  {it.quantity}x {it.name}
                </span>
                <span>Rp {formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#8D8D8D]">Biaya Pengiriman</span>
              <span>Rp {formatPrice(20000)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#8D8D8D]">Biaya Layanan (1%)</span>
              <span>Rp {formatPrice(tipsFee)}</span>
            </div>
          </div>

          <div className="my-2 h-px bg-[#F3F4F6]" />

          <div className="flex items-center justify-between text-sm md:text-base lg:text-lg">
            <span className="text-[#8D8D8D]">Total</span>
            <span className="font-bold text-[#333]">
              Rp {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        {/* Merchant info (dummy) */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-4 text-sm md:text-base lg:text-lg flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#333] flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              {merchantName}
            </p>
            <p className="text-primary mt-1 cursor-pointer flex items-center gap-1">
              <FluentChat className="w-4 h-4 text-primary" />
              Hubungi Merchant
            </p>
          </div>
        </div>

        {/* Safety info */}
        <div className="rounded-[24px] border border-primary bg-[#FFF7ED] p-4 text-sm md:text-base lg:text-lg flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#333] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Keamanan Terjamin
            </p>
            <p className="text-[#8D8D8D] mt-1">
              Driver terverifikasi & asuransi perjalanan aktif
            </p>
          </div>
          <button className="mt-2 rounded-full border border-primary px-4 py-1 text-sm md:text-base lg:text-lg font-semibold text-primary bg-white">
            Butuh Bantuan?
          </button>
        </div>
      </div>

      <Dialog open={showArrivedDialog} onOpenChange={setShowArrivedDialog}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-[#333]">
              Pesanan kamu sudah sampai! 🎉
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm md:text-base text-[#8D8D8D] leading-relaxed">
              Terima kasih sudah berbelanja dengan Qoin. Semoga kamu puas dengan
              pesanan dan pelayanannya. Jangan lupa beri rating dan ulasan untuk
              mendukung UMKM favoritmu.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="w-full rounded-full bg-primary hover:bg-primary/90 py-3 md:py-3.5 text-sm md:text-base font-semibold text-white transition-colors duration-200"
              onClick={() => {
                setShowArrivedDialog(false);
                router.push(`/payment/${merchantName}/rating`);
              }}
            >
              Beri Rating & Ulasan
            </button>
            <button
              className="w-full rounded-full border-2 border-[#E5E7EB] hover:border-primary hover:text-primary py-3 md:py-3.5 text-sm md:text-base font-semibold text-[#333] transition-colors duration-200"
              onClick={() => {
                try {
                  localStorage.removeItem("orderStatus");
                  localStorage.removeItem("qoin.cart");
                  localStorage.removeItem("grandTotal");
                } catch (err) {
                  console.log(err);
                }

                setShowArrivedDialog(false);
                router.push("/");
              }}
            >
              Lewati
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverPage;
