"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DollarCoin from "@/components/icons/dollar-coin";
import {
  TrendingUp,
  Calendar,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
} from "lucide-react";
import useGetUserTransactions from "@/hooks/transaction/use-get-user-transaction";
import { TransactionData } from "@/types";
import useGetUserPoints from "@/hooks/transaction/use-get-user-points";
import { formatPrice } from "@/lib/format-price";

const QoinPage = () => {
  const router = useRouter();
  const { openModal } = useOpenModal();
  const { data, isLoading, isError } = useGetUser();
  const [filter, setFilter] = useState<"all" | "earning" | "spending">("all");
  const { qoinBalance } = useGetUserPoints();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetUserTransactions();

  const safeData: TransactionData[] =
    !transactionsLoading &&
    transactionsData &&
    Array.isArray(transactionsData.data)
      ? transactionsData.data
      : [];
  interface UserPayload {
    qoin?: number;
    user?: {
      qoin?: number;
    };
  }

  const userData: UserPayload | undefined = data as UserPayload | undefined;
  const isAuthenticated = !!userData && !isError;

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push("/");
    return null;
  }

  // const qoinBalance = userData?.qoin ?? userData?.user?.qoin ?? 0;

  const getTransactionType = (t: TransactionData) => {
    // Untuk saat ini, semua selled_stocks dianggap earning Qoin
    return "earning" as const;
  };

  const filteredTransactions = safeData.filter((t) => {
    if (filter === "all") return true;
    return getTransactionType(t) === filter;
  });

  const totalEarned = safeData
    .filter((t) => getTransactionType(t) === "earning")
    .reduce((sum, t) => sum + t.total_price, 0);

  const totalSpent = 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6 min-h-screen pb-10 md:mt-8 lg:mt-10">
        <PageContainer>
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="mb-2 text-2xl font-extrabold text-[#333] md:text-3xl lg:text-4xl">
                Qoin Saya
              </h1>
              <p className="text-sm text-[#8D8D8D] md:text-base lg:text-lg">
                Kelola dan pantau Qoin kamu dari setiap transaksi
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-48 rounded-3xl" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Balance Card */}
                <Card className="from-primary overflow-hidden rounded-3xl bg-gradient-to-br via-[#FF8E0D] to-[#FD6700] shadow-lg">
                  <CardContent className="p-6 text-white md:p-8 lg:p-10">
                    <div className="mb-6 flex items-center justify-between md:mb-8">
                      <div>
                        <p className="mb-2 text-sm opacity-90 md:text-base">
                          Total Qoin
                        </p>
                        <div className="flex items-center gap-3">
                          <DollarCoin className="h-10 w-10 text-white md:h-12 md:w-12" />
                          <h2 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
                            {qoinBalance}
                          </h2>
                        </div>
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm md:h-20 md:w-20">
                        <TrendingUp className="h-8 w-8 md:h-10 md:w-10" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/20 pt-4">
                      <div>
                        <p className="text-xs opacity-75 md:text-sm">
                          Setara dengan
                        </p>
                        <p className="text-base font-semibold md:text-lg">
                          Rp {(qoinBalance * 10).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30 md:px-5 md:py-2.5 md:text-sm">
                        Tukar Qoin
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                  <Card className="rounded-3xl shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="p-5 md:p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                          <ArrowUpRight className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-xs text-[#8D8D8D] md:text-sm">
                          Total Diterima
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#333] md:text-3xl">
                        {totalEarned}
                      </p>
                      <p className="mt-1 text-xs text-[#8D8D8D] md:text-sm">
                        Qoin
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="p-5 md:p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                          <ArrowDownRight className="h-6 w-6 text-red-600" />
                        </div>
                        <span className="text-xs text-[#8D8D8D] md:text-sm">
                          Total Transaksi
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#333] md:text-3xl">
                        {totalSpent}
                      </p>
                      <p className="mt-1 text-xs text-[#8D8D8D] md:text-sm">
                        Qoin
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="p-5 md:p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                          <ShoppingBag className="text-primary h-6 w-6" />
                        </div>
                        <span className="text-xs text-[#8D8D8D] md:text-sm">
                          Transaksi
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#333] md:text-3xl">
                        {safeData.length}
                      </p>
                      <p className="mt-1 text-xs text-[#8D8D8D] md:text-sm">
                        Total
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* How to Earn Qoin Info */}
                <Card className="border-primary/20 rounded-3xl bg-[#FFF7ED]">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl md:h-12 md:w-12">
                        <Gift className="text-primary h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-base font-bold text-[#333] md:text-lg">
                          Cara Dapat Qoin
                        </h3>
                        <ul className="space-y-1.5 text-xs text-[#8D8D8D] md:text-sm">
                          <li>
                            • Belanja di UMKM mitra dan dapatkan 5% cashback
                            Qoin
                          </li>
                          <li>
                            • Tulis review untuk merchant dan dapatkan 25 Qoin
                          </li>
                          <li>• Referral teman baru dan dapatkan 100 Qoin</li>
                          <li>
                            • Ikuti event dan promo spesial untuk bonus Qoin
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="rounded-3xl shadow-md">
                  <CardHeader className="border-b px-5 py-5 md:px-6 md:py-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-bold text-[#333] md:text-xl">
                          Riwayat Transaksi
                        </h3>
                        <p className="mt-1 text-xs text-[#8D8D8D] md:text-sm">
                          Lihat detail perolehan Qoin kamu
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFilter("all")}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors md:px-4 md:py-2 md:text-sm ${
                            filter === "all"
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                          }`}
                        >
                          Semua
                        </button>
                        <button
                          onClick={() => setFilter("earning")}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors md:px-4 md:py-2 md:text-sm ${
                            filter === "earning"
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                          }`}
                        >
                          Masuk
                        </button>
                        <button
                          onClick={() => setFilter("spending")}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors md:px-4 md:py-2 md:text-sm ${
                            filter === "spending"
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                          }`}
                        >
                          Keluar
                        </button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center md:p-12">
                          <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300 md:h-16 md:w-16" />
                          <p className="text-sm text-[#8D8D8D] md:text-base">
                            Belum ada transaksi
                          </p>
                        </div>
                      ) : (
                        filteredTransactions.map(
                          (transaction: TransactionData) => (
                            <div
                              key={transaction.id}
                              className="p-4 transition-colors hover:bg-gray-50 md:p-5 lg:p-6"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
                                  <div
                                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl md:h-12 md:w-12 ${
                                      getTransactionType(transaction) ===
                                      "earning"
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                    }`}
                                  >
                                    {getTransactionType(transaction) ===
                                    "earning" ? (
                                      <ShoppingBag className="h-5 w-5 text-green-600 md:h-6 md:w-6" />
                                    ) : (
                                      <ArrowDownRight className="h-5 w-5 text-red-600 md:h-6 md:w-6" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[#333] md:text-base">
                                      {transaction.description ?? "Transaksi"}
                                    </p>
                                    <p className="mt-0.5 text-xs text-[#8D8D8D] md:text-sm">
                                      {transaction.merchant?.name ?? "Merchant"}
                                    </p>
                                    <div className="mt-1.5 flex items-center gap-2">
                                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-[#8D8D8D]">
                                        {getTransactionType(transaction) ===
                                        "earning"
                                          ? "Qoin Masuk"
                                          : "Qoin Keluar"}
                                      </span>
                                      <span className="text-xs text-[#8D8D8D]">
                                        {formatDate(transaction.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                  <p
                                    className={`text-base font-bold md:text-lg lg:text-xl ${
                                      getTransactionType(transaction) ===
                                      "earning"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {/* {transaction.total_price > 0 ? "+" : ""} */}
                                    {formatPrice(transaction.total_price)}
                                  </p>
                                  <p className="mt-0.5 text-xs text-[#8D8D8D]">
                                    Rupiah
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </PageContainer>
      </Section>
    </>
  );
};

export default QoinPage;
