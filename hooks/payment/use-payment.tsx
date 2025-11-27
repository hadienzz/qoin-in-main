import { useEffect, useState } from "react";

const usePayment = () => {
  const [onPage, setOnPage] = useState("default");
  const onPaymentPage = onPage === "payment";
  const onDefaultPage = onPage === "default";
  const onSearchingPage = onPage === "searching";
  const onDriverPage = onPage === "driver";
  const onPickupConfirmationPage = onPage === "pickup-confirmation";
  const [isSearching, setIsSearching] = useState(false);

  // Bootstrap from localStorage (persisted state)
  useEffect(() => {
    try {
      const status = localStorage.getItem("orderStatus");
      if (status === "sedang_diantar") {
        setOnPage("driver");
        setIsSearching(false);
      }
    } catch {}
  }, []);

  // When entering searching page, show searching for 5s then go to driver page
  useEffect(() => {
    if (!onSearchingPage) return;
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
      setOnPage("driver");
      try {
        localStorage.setItem("orderStatus", "sedang_diantar");
      } catch {}
    }, 5000);
    return () => clearTimeout(timer);
  }, [onSearchingPage]);

  const handlePage = (page: string) => {
    setOnPage(page);
  };
  const handleOffPaymentPage = () => {
    setOnPage("default");
  };

  return {
    onPaymentPage,
    onDefaultPage,
    onSearchingPage,
    onDriverPage,
    onPickupConfirmationPage,
    onPage,
    handlePage,
    handleOffPaymentPage,
    isSearching,
  };
};

export default usePayment;
