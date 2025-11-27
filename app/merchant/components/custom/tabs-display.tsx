"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabsProduct from "./tabs-products";
import TabsAbout from "./tabs-about";
import TabsReview from "./tabs-review";
import React from "react";
import Box from "@/components/icons/box";
import Store from "@/components/icons/store";
import Star from "@/components/icons/star";
import AsideCard from "./aside-card";
import CartCard from "./cart-card";
import { Merchant } from "@/types";
import type { CartItem } from "@/hooks/merchant/use-add-product-to-cart";

type TabConfig = {
  value: string;
  text: string;
  icon: React.ReactElement;
};

const tabsConfig: TabConfig[] = [
  { value: "products", text: "Produk", icon: <Box /> },
  { value: "abouts", text: "Tentang", icon: <Store /> },
  { value: "reviews", text: "Ulasan", icon: <Star /> },
];
interface TabsDisplayProps {
  merchant?: Merchant | null;
  handleProduct: (productId: string) => void;
  cart: CartItem[];
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  totals: { totalQty: number; totalPrice: number };
}

const TabsDisplay = ({
  merchant,
  handleProduct,
  cart,
  increment,
  decrement,
  totals,
}: TabsDisplayProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
      <Tabs defaultValue="products" className="col-span-1 lg:col-span-2">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl bg-[#F9F9F9] p-1 md:gap-1.5 md:rounded-2xl md:p-1.5">
          {tabsConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:text-primary flex h-auto w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-medium text-[#808080] transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:gap-2 md:rounded-xl md:px-3 md:py-2.5 md:text-xs lg:px-4 lg:py-3 lg:text-sm xl:text-base"
            >
              {tab.icon}
              <span>{tab.text}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 md:mt-6 lg:mt-8">
          <TabsProduct
            product={merchant?.stocks}
            handleProduct={handleProduct}
          />
          <TabsAbout maps={merchant?.iframe_map_url} />
          <TabsReview />
        </div>
      </Tabs>
      <div className="col-span-1 mt-4 flex flex-col gap-3 md:mt-6 md:gap-4 lg:col-span-1 lg:mt-0">
        <AsideCard className="w-full" location={merchant?.location} />
        <CartCard
          className="w-full"
          cart={cart}
          increment={increment}
          decrement={decrement}
          totals={totals}
        />
      </div>
    </div>
  );
};

export default TabsDisplay;
