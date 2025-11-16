"use client";

import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import usePayment from "@/hooks/payment/use-payment";
import TrolleyPage from "./components/trolley-page";
import PaymentProducts from "./components/payment-page";
import SearchingDriver from "./components/searching-driver";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DriverPage from "./components/driver-page";

const PaymentPage = () => {
  const [grandTotal, setGrandTotal] = useState<string | null>(null);
  const { paymentId } = useParams();
  const { openModal } = useOpenModal();
  const {
    onPaymentPage,
    onDefaultPage,
    handlePage,
    onSearchingPage,
    isSearching,
    onDriverPage,
  } = usePayment();

  const { merchant } = useGetMerchantById(paymentId as string);

  useEffect(() => {
    const total = localStorage.getItem("grandTotal");
    setGrandTotal(total);
  }, []);

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6">
        <PageContainer>
          {onDefaultPage && <TrolleyPage handlePage={handlePage} />}
          {onPaymentPage && (
            <div className="mt-10">
              <PaymentProducts
                total={Number(grandTotal)}
                handlePage={handlePage}
              />
            </div>
          )}
          {onSearchingPage && isSearching && (
            <SearchingDriver merchantName={merchant?.name || ""} />
          )}
          {onDriverPage && !isSearching && (
            <DriverPage
              merchantName={merchant?.name || ""}
              total={Number(grandTotal)}
            />
          )}
        </PageContainer>
      </Section>
    </>
  );
};

export default PaymentPage;
