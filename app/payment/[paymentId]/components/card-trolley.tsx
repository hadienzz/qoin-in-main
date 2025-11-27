"use client";

import Store from "@/components/icons/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useAddProductToCart from "@/hooks/merchant/use-add-product-to-cart";
import Image from "next/image";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format-price";

type CardTrolleyProps = {
  id: string;
  name: string;
  photo_url: string;
  description?: string;
  price: number;
  quantity: number;
  onInc?: (productId: string) => void;
  onDec?: (productId: string) => void;
};

export const CardTrolleyItem = ({
  id,
  name,
  photo_url,
  price,
  quantity,
  description,
  onInc,
  onDec,
}: CardTrolleyProps) => {
  return (
    <div className="mb-4 flex gap-3 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0 md:mb-5 md:gap-4 md:pb-5">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl md:h-24 md:w-24 lg:h-28 lg:w-28">
        <Image
          className="h-full w-full object-cover"
          width={112}
          height={112}
          src={photo_url}
          alt={`Photo ${name}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="space-y-1">
          <h1 className="line-clamp-1 text-sm font-semibold text-[#333] md:text-base lg:text-lg">
            {name}
          </h1>
          <p className="line-clamp-2 text-xs leading-relaxed text-[#8D8D8D] md:text-sm lg:text-base">
            {description ?? "Ini makanan enak banget asli ga boong"}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 md:mt-3">
          <p className="text-primary flex-shrink-0 text-base font-bold md:text-lg lg:text-xl">
            {formatPrice(price)}
          </p>
          <div className="flex items-center gap-2 md:gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="bg-primary hover:bg-primary/90 border-primary h-7 w-7 rounded-full p-0 text-white hover:text-white md:h-8 md:w-8"
              onClick={() => onDec?.(id)}
            >
              -
            </Button>
            <p className="w-6 text-center text-sm font-medium md:w-8 md:text-base">
              {quantity}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary hover:bg-primary/90 border-primary h-7 w-7 rounded-full p-0 text-white hover:text-white md:h-8 md:w-8"
              onClick={() => onInc?.(id)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardTrolley = () => {
  const { paymentId } = useParams();
  const { cart, increment, decrement } = useAddProductToCart();

  const router = useRouter();
  const handleBackToMenu = () => {
    return router.push(`/merchant/${paymentId}`);
  };

  const merchants = Array.from(
    new Set(cart.map((item) => item.merchant_name)), // pakai field name di cart
  );

  return (
    <Card className="rounded-3xl shadow-md">
      <CardHeader className="border-b px-4 py-4 md:px-5 md:py-5 lg:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <Store className="text-primary h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          <p className="text-base font-bold text-[#333] md:text-lg lg:text-xl xl:text-[22px]">
            Halaman Keranjang
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-5 md:px-5 md:py-6 lg:px-6">
        <div className="space-y-0">
          {merchants.map((merchantName) => (
            <div key={merchantName} className="mb-4">
              <p className="mb-2 text-sm font-semibold text-[#8D8D8D] lg:text-base">
                {merchantName}
              </p>
              {cart
                .filter((item) => item.merchant_name === merchantName)
                .map((item) => (
                  <CardTrolleyItem
                    key={item.id}
                    {...item}
                    onInc={increment}
                    onDec={decrement}
                  />
                ))}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t pt-5 md:mt-8 md:flex-row md:items-center md:justify-between md:gap-4 md:pt-6 lg:mt-10">
          <div className="space-y-1">
            <h1 className="text-base font-bold text-[#333] md:text-lg lg:text-xl xl:text-[22px]">
              Masih ada yang mau ditambah?
            </h1>
            <p className="text-xs leading-relaxed font-medium text-[#8D8D8D] md:text-sm lg:text-base xl:text-lg">
              Lihat lagi menu lainnya biar gak ada yang terlewat.
            </p>
          </div>
          <Button
            variant={"outline"}
            className="text-primary border-primary hover:text-primary hover:bg-primary/5 flex-shrink-0 px-4 py-2 text-sm font-bold md:px-5 md:py-2.5 md:text-base"
            onClick={handleBackToMenu}
          >
            Tambah Lagi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardTrolley;
