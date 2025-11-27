"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format-price";
import FluentChat from "@/components/icons/fluent-chat";
import Store from "@/components/icons/store";
import { MapPin, ShieldCheck } from "lucide-react";
import Box from "@/components/icons/box";
import Vespa from "@/components/icons/vespa";
import Image from "next/image";
import DialogSuccess from "./dialog-success";
import useSuccessTransaction from "@/hooks/payment/use-success-transaction";

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
      <div className="flex flex-col items-center justify-center">
        <div
          className={`flex items-center justify-center rounded-full p-[5px] ${
            active ? "bg-primary text-white" : "border-[#E5E7EB] bg-white"
          }`}
        >
          <span className="mx-auto flex size-[25px] items-center justify-center rounded-full">
            {icon}
          </span>
        </div>
        {!!idx && idx < 3 && <div className="h-10 w-px bg-[#E5E7EB]" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#333] md:text-base lg:text-lg">
          {title}
        </p>
        <p className="text-sm text-[#8D8D8D] md:text-base lg:text-lg">{desc}</p>
      </div>
    </div>
  );
};

const DriverPage = ({ merchantName }: DriverPageProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(() =>
    new Array(stepItem.length).fill(false),
  );

  const { showArrivedDialog, setShowArrivedDialog, handleSuccess, isPending } =
    useSuccessTransaction();

  const totalPrice = items.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0,
  );

  const tipsFee = totalPrice * 0.01;
  const grandTotal = totalPrice + tipsFee + 20000;

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("qoin.cart");
      if (storedItems) {
        const parsed = JSON.parse(storedItems) as OrderItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {}
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
          className="h-[400] w-full rounded-lg bg-contain"
        />

        {/* Shipping timeline */}
        <div className="space-y-4 rounded-[24px] border border-[#F0F0F0] bg-white p-5">
          <h2 className="text-sm font-semibold text-[#333] md:text-base lg:text-lg">
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
        <div className="space-y-4 rounded-[24px] border border-[#F0F0F0] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#333] md:text-base lg:text-lg">
            Informasi Driver
          </h3>
          <div className="flex items-center gap-3">
            {/* <div className="h-10 w-10 rounded-full bg-[#E5E7EB]" /> */}
            <Image
              width={40}
              height={40}
              src={"/images/mamat.png"}
              alt="Foto mamat"
              className="border-primary rounded-full border-2"
            />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#333] md:text-base lg:text-lg">
                Mamat
              </p>
              <p className="text-sm text-[#8D8D8D] md:text-base lg:text-lg">
                4.9 ⭐
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[35px]">
            <div className="rounded-md bg-[#FFF7ED] p-[15px]">
              <Vespa className="text-primary" />
            </div>
            <div className="space-y-1 text-sm text-[#8D8D8D] md:text-base lg:text-lg">
              <p>BI 1234 XYZ</p>
              <p>Honda Beat</p>
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className="space-y-3 rounded-[24px] border border-[#F0F0F0] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#333] md:text-base lg:text-lg">
            Detail Pesanan
          </h3>
          <div className="space-y-1 text-sm text-[#8D8D8D] md:text-base lg:text-lg">
            <p>ID Pesanan</p>
            <p className="font-medium text-[#333]">ORD-1726990776370</p>
          </div>
          <div className="space-y-1 text-sm text-[#8D8D8D] md:text-base lg:text-lg">
            <p>Alamat Pengiriman</p>
            <p className="leading-relaxed">
              Universitas Telkom Jakarta - Kampus Minangkabau, Jl. Minangkabau
              Barat No.50, RT.1/RW.1, Pasar Manggis, Setiabudi, South Jakarta
              City, Jakarta 12970
            </p>
          </div>
          <div className="my-2 h-px bg-[#F3F4F6]" />

          <div className="space-y-1 text-sm text-[#333] md:text-base lg:text-lg">
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
        <div className="flex items-center justify-between rounded-[24px] border border-[#F0F0F0] bg-white p-4 text-sm md:text-base lg:text-lg">
          <div>
            <p className="flex items-center gap-2 font-semibold text-[#333]">
              <Store className="text-primary h-4 w-4" />
              {merchantName}
            </p>
            <p className="text-primary mt-1 flex cursor-pointer items-center gap-1">
              <FluentChat className="text-primary h-4 w-4" />
              Hubungi Merchant
            </p>
          </div>
        </div>

        {/* Safety info */}
        <div className="border-primary flex items-center justify-between rounded-[24px] border bg-[#FFF7ED] p-4 text-sm md:text-base lg:text-lg">
          <div>
            <p className="flex items-center gap-2 font-semibold text-[#333]">
              <ShieldCheck className="text-primary h-4 w-4" />
              Keamanan Terjamin
            </p>
            <p className="mt-1 text-[#8D8D8D]">
              Driver terverifikasi & asuransi perjalanan aktif
            </p>
          </div>
          <button className="border-primary text-primary mt-2 rounded-full border bg-white px-4 py-1 text-sm font-semibold md:text-base lg:text-lg">
            Butuh Bantuan?
          </button>
        </div>
      </div>
      <DialogSuccess
        handleSuccess={handleSuccess}
        isPending={isPending}
        merchantName={merchantName}
        showArrivedDialog={showArrivedDialog}
        setShowArrivedDialog={setShowArrivedDialog}
      />
    </div>
  );
};

export default DriverPage;
