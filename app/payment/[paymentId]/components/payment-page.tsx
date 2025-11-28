"use client";

import { formatPrice } from "@/lib/format-price";
import { useCountdown } from "@/hooks/payment/use-countdown";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentProductsProps {
  total: number;
  handlePage: (page: string) => void;
  isPickup?: boolean;
}

const PaymentProducts = ({
  total,
  handlePage,
  isPickup = false,
}: PaymentProductsProps) => {
  const { label } = useCountdown();
  const [grandTotal, setGrandTotal] = useState<string | null>(null);

  useEffect(() => {
    const grandTotal = localStorage.getItem("grandTotal");
    setGrandTotal(grandTotal);
  }, []);

  const handleCheckStatus = () => {
    if (isPickup) {
      handlePage("pickup-confirmation");
    } else {
      handlePage("searching");
    }
  };

  return (
    // width tetap mengikuti container parent (tidak diubah)
    <div className="mx-auto space-y-8 lg:max-w-1/2">
      <header className="flex items-start justify-between text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Total Pembayaran</p>
          <p className="text-primary text-base font-bold lg:text-lg">
            Rp {formatPrice(grandTotal ?? 0)}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-muted-foreground">Bayar Dalam</p>
          <p className="text-[13px] font-semibold text-[#FF5B00]">{label}</p>
          <p className="text-muted-foreground text-[11px]">
            Jatuh tempo 12 Nov 2025, 21:08
          </p>
        </div>
      </header>

      {/* Kartu QRIS */}
      <section className="mx-auto max-w-md rounded-[24px] border border-[#F0F0F0] bg-white px-10 py-8 shadow-sm">
        {/* Logo atas */}
        <div className="mb-6 flex items-center justify-between text-xs font-semibold text-[#333]">
          <span>QRIS</span>
          <div className="text-right leading-tight">
            <p>Qoin.in</p>
            <p className="text-muted-foreground text-[10px] font-normal">
              NMID: IDI20193287626A01
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-center">
          <Image
            src={"/images/qrcode.png"}
            alt="Qr code"
            width={230}
            height={230}
          />
        </div>

        <button
          type="button"
          className="mx-auto mt-2 flex h-11 w-44 items-center justify-center rounded-full bg-[#FF7A1A] text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#ff8a33]"
        >
          Unduh QR
        </button>
      </section>

      {/* Cara Pembayaran */}
      <section className="mx-auto max-w-md leading-relaxed text-[#444]">
        <h3 className="mb-3 font-semibold text-[#222]">Cara Pembayaran</h3>
        <ol className="list-inside list-decimal space-y-1">
          <li>Buka aplikasi e-wallet atau mobile banking</li>
          <li>Pilih menu Scan QR</li>
          <li>Scan kode QR di atas ini</li>
          <li>Periksa nominal pembayaran</li>
          <li>Selesaikan pembayaran hingga muncul notifikasi berhasil</li>
        </ol>
        <div className="pb-8">
          <Button
            className="group relative mt-4 flex w-full items-center justify-center overflow-hidden bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] py-6 font-bold lg:text-xl"
            onClick={handleCheckStatus}
          >
            <span className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(79deg,#FD6700_64.73%,#FF944B_114.39%)] transition-transform duration-500 ease-in-out group-hover:translate-x-0" />

            <p className="z-100">Cek Status Pembayaran</p>
            <ShieldCheck className="transition-all duration-500 group-hover:translate-x-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PaymentProducts;
