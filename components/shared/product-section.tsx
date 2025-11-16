import { ProductTypeContentType } from "@/content/content";
import DisplayProductTypeItem from "./display-product-type-item";
import DisplayMerchant from "./display-merchant";
import PromoProduct from "./promo-product";
import InspiratedItem from "./inspirated-item";
import { DisplayMerchantResponse } from "@/types";
import LocationBadge from "./location-badge";

interface ProductSectionProps {
  title?: string;
  description?: string;
  products?: ProductTypeContentType[];
  isExplore?: boolean;
  isPromo?: boolean;
  isInspirated?: boolean;
  displayMerchant?: DisplayMerchantResponse;
  isLoading?: boolean;
}

const ProductSection = ({
  title,
  description,
  products,
  isExplore,
  isPromo,
  isInspirated,
  displayMerchant,
  isLoading,
}: ProductSectionProps) => {
  const safeDisplayMerchant = Array.isArray(displayMerchant?.data)
    ? displayMerchant.data
    : [];

  return (
    <>
      <div className="space-y-2 md:space-y-3 mt-8 md:mt-12 lg:mt-15 mb-5 md:mb-6 lg:mb-7.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1
            className={`text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight ${
              isPromo ? "text-white" : "text-secondary"
            }`}
          >
            {title}
          </h1>
          {isExplore && <LocationBadge />}
        </div>
        <p
          className={`text-sm md:text-base lg:text-lg xl:text-[22px] leading-relaxed ${
            isPromo ? "text-white" : "text-[#606060]"
          }`}
        >
          {description}
        </p>
      </div>

      {isInspirated && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <InspiratedItem key={idx} />
          ))}
        </div>
      )}

      {!isInspirated && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {isExplore &&
            !isLoading &&
            safeDisplayMerchant.map((item, idx) => (
              <DisplayMerchant
                key={idx}
                displayMerchant={item}
                isLoading={isLoading}
              />
            ))}

          {isPromo &&
            !isLoading &&
            safeDisplayMerchant.map((item, idx) => (
              <PromoProduct key={idx} merchant={item} />
            ))}

          {!isExplore &&
            !isPromo &&
            products?.map((item, idx) => (
              <DisplayProductTypeItem key={idx} {...item} />
            ))}
        </div>
      )}
    </>
  );
};

export default ProductSection;
