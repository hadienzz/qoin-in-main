"use client";

import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { IconCartCard } from "@/app/merchant/components/custom/empty-card";
import DollarCoin from "@/components/icons/dollar-coin";
import Store from "@/components/icons/store";
import { SearchIcon, ShoppingCart } from "lucide-react";

type SearchingDriverProps = {
  merchantName?: string;
  address?: string;
  recipient?: string;
  phone?: string;
  eta?: string;
  courier?: string;
};

const SearchingDriver = ({
  merchantName = "Warung Makan Bu Siti",
  address = "Universitas Telkom Jakarta - Kampus Minangkabau, Jl. Minangkabau Barat No.50, RT.1/RW.1, Pasar Manggis, Setiabudi, South Jakarta City, Jakarta 12970",
  recipient = "John Doe",
  phone = "+62-85156473876",
  eta = "30-45 menit",
  courier = "Gosend",
}: SearchingDriverProps) => {
  return (
    <Section className="mt-6">
      <PageContainer>
        <div className="mx-auto max-w-xl">
          <div className="flex flex-col items-center text-center">
            <div className="bg-[linear-gradient(86deg,#FD6700_4.98%,#FF944B_94.22%)] flex items-center justify-center rounded-[25px] size-[120px] relative max-w-[330px]">
              <ShoppingCart className="w-12 h-12 text-white" />
              <IconCartCard
                icon={<SearchIcon className="text-[#ED8814]" />}
                className="-left-8"
              />
              <IconCartCard
                icon={<DollarCoin className="text-[#00BF63]" />}
                className="-right-4 bottom-4"
              />
              <IconCartCard
                icon={<DollarCoin className="text-[#ED3437]" />}
                className="-top-4"
              />
            </div>

            <div className="mt-5 space-y-1">
              <h2 className="text-lg lg:text-2xl font-extrabold text-[#333]">
                Lagi cari driver buat kamu
              </h2>
              <p className="text-sm lg:text-lg text-[#8D8D8D]">
                Lagi cari driver paling dekat.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#EFEFEF] bg-white p-4 lg:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 text-[#333]">
              <div className="grid place-items-center h-7 w-7 rounded-full bg-orange-50 text-primary">
                <Store className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-sm lg:text-base">
                {merchantName}
              </span>
            </div>

            <div className="my-4 h-px bg-[#F1F1F1]" />

            {/* Address */}
            <div className="space-y-2 text-[#333]">
              <p className="text-xs lg:text-sm font-semibold">
                Alamat Pengiriman
              </p>
              <p className="text-sm lg:text-lg text-[#6B7280] leading-relaxed">
                {address}
              </p>
              <div className="flex items-center gap-3 text-[11px] lg:text-xs text-[#9CA3AF]">
                <span>{recipient}</span>
                <span>{phone}</span>
              </div>
            </div>

            <div className="my-4 h-px bg-[#F1F1F1]" />

            {/* ETA */}
            <div className="space-y-1 text-[#333]">
              <p className="text-sm lg:text-lg font-semibold">Estimasi Waktu</p>
              <p className="text-sm lg:text-lg text-[#6B7280]">{eta}</p>
            </div>

            <div className="my-4 h-px bg-[#F1F1F1]" />

            {/* Courier */}
            <div className="space-y-1 text-[#333]">
              <p className="text-sm lg:text-lg font-semibold">Pilihan Kurir</p>
              <div className="flex items-center gap-2 text-sm lg:text-lg">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#00BF63]" />
                <span className="text-[#374151] font-medium">{courier}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};

export default SearchingDriver;
