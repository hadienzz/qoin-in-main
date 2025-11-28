"use client";

import Link from "next/link";
import Image from "next/image";
import LogoIcon from "../icons/logo";
import BorderButton from "../shared/border-button";
import PageContainer from "../shared/page-container";
import PrimaryButton from "../shared/primary-button";
import Section from "../shared/section";
import DollarCoin from "@/components/icons/dollar-coin";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Bell } from "lucide-react";
import useGetUser from "@/hooks/auth/use-get-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import useLogout from "@/hooks/auth/use-logout";
import { useEffect, useState } from "react";
import useGetUserPoints from "@/hooks/transaction/use-get-user-points";

interface HeaderProps {
  openModal?: (open: string) => void;
  isLoading?: boolean;
}
const Header = ({ openModal }: HeaderProps) => {
  const router = useRouter();
  const { data, isError, isLoading: isUserLoading } = useGetUser();
  const { handleLogout, isPending } = useLogout();

  interface UserPayload {
    qoin?: number;
    notifications?: number;
    avatarUrl?: string | null;
    name?: string;
    user?: {
      qoin?: number;
      notifications?: number;
      avatarUrl?: string | null;
      name?: string;
    };
  }

  const userData: UserPayload | undefined = data as UserPayload | undefined;
  const isAuthenticated = !!userData && !isError;
  const isHydrating = !userData && !isError && isUserLoading;
  const { qoinBalance } = useGetUserPoints();
  const notifCount =
    userData?.notifications ?? userData?.user?.notifications ?? 0;
  const avatarUrl = userData?.avatarUrl ?? userData?.user?.avatarUrl ?? null;
  const baseName = userData?.name ?? userData?.user?.name ?? "User";
  const displayInitial = baseName.charAt(0).toUpperCase();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showSkeleton = !mounted || isHydrating;
  const showAuth = mounted && isAuthenticated && !isHydrating;

  return (
    <Section className="mx-auto border-b">
      <PageContainer>
        <div className="hidden h-[102px] items-center justify-between lg:flex">
          <Link href={"/"}>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <LogoIcon />
              </div>
              <h1 className="text-[28px] font-extrabold">Qoin.in</h1>
            </div>
          </Link>
          <div className="hidden lg:block">
            <ul className="flex gap-[50px] text-lg font-semibold">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="hover:text-primary transition-colors"
                >
                  Jelajahi UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/top-100"
                  className="hover:text-primary transition-colors"
                >
                  Top 100 UMKM
                </Link>
              </li>
            </ul>
          </div>
          <div>
            {showSkeleton ? (
              <div className="flex items-center gap-5">
                <div className="h-12 w-[190px] animate-pulse rounded-2xl border bg-gray-100" />
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-100" />
              </div>
            ) : showAuth ? (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => router.push("/qoin")}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 transition-colors hover:border-orange-300 hover:bg-orange-100"
                >
                  <div
                    className="grid h-9 w-9 place-items-center rounded-full bg-orange-100"
                    suppressHydrationWarning
                  >
                    <DollarCoin className="text-primary" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-secondary font-semibold">
                      Qoin Saya
                    </div>
                    <div className="text-primary text-xl font-bold">
                      {qoinBalance}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/notifications")}
                  className="hover:bg-muted relative rounded-full p-2 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                      {Math.min(99, notifCount)}
                    </span>
                  )}
                </button>
                {/* Avatar */}
                <div className="h-12 w-12 overflow-hidden rounded-full border bg-gray-200">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profil"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="grid h-full w-full place-items-center text-sm font-semibold text-gray-600">
                          {displayInitial}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => router.push("/user/merchant")}
                          className="hover:bg-[#fd6700]"
                        >
                          Toko Saya
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/user/followed-merchant")}
                          className="hover:bg-[#fd6700]"
                        >
                          Toko Diikuti
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/profile")}
                        >
                          Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleLogout}
                          disabled={isPending}
                        >
                          Keluar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <BorderButton icon={<DollarCoin />}>Cobain</BorderButton>
                <PrimaryButton
                  className="px-5 py-2.5"
                  onClick={() => openModal && openModal("default")}
                >
                  Masuk
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex h-[72px] items-center justify-between lg:hidden">
          <Link href={"/"}>
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9">
                <LogoIcon />
              </div>
              <h1 className="text-2xl font-extrabold">Qoin.in</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {showAuth && (
              <button
                onClick={() => router.push("/qoin")}
                className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-2.5 py-1.5 transition-colors hover:bg-orange-100"
              >
                <DollarCoin className="text-primary h-5 w-5" />
                <span className="text-primary text-sm font-bold">
                  {qoinBalance}
                </span>
              </button>
            )}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="rounded-md border p-2"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8">
                        <LogoIcon />
                      </div>
                      <span className="text-lg font-extrabold">Qoin.in</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="p-4">
                  <ul className="flex flex-col gap-4 text-base font-semibold">
                    <li>
                      <Link
                        href="/"
                        onClick={() => setIsSheetOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Beranda
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/explore"
                        onClick={() => setIsSheetOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Jelajahi UMKM
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/user/followed-merchant"
                        onClick={() => setIsSheetOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Toko Diikutis
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/top-100"
                        onClick={() => setIsSheetOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Top 100 UMKM
                      </Link>
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-col gap-3">
                    {showSkeleton ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="h-12 flex-1 animate-pulse rounded-2xl border bg-gray-100" />
                        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
                      </div>
                    ) : showAuth ? (
                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={() => {
                            setIsSheetOpen(false);
                            router.push("/qoin");
                          }}
                          className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 transition-colors hover:border-orange-300 hover:bg-orange-100"
                        >
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-orange-100">
                            <DollarCoin className="text-primary" />
                          </div>
                          <div className="leading-tight">
                            <div className="text-secondary text-sm font-semibold">
                              Qoin Saya
                            </div>
                            <div className="text-primary text-lg font-bold">
                              {qoinBalance}
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSheetOpen(false);
                            router.push("/notifications");
                          }}
                          className="hover:bg-muted relative rounded-full p-2 transition-colors"
                          aria-label="Notifications"
                        >
                          <Bell className="h-5 w-5" />
                          {notifCount > 0 && (
                            <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                              {Math.min(99, notifCount)}
                            </span>
                          )}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-10 w-10 overflow-hidden rounded-full border bg-gray-200">
                              {avatarUrl ? (
                                <Image
                                  src={avatarUrl}
                                  alt="Profil"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="grid h-full w-full place-items-center text-xs font-semibold text-gray-600">
                                  {displayInitial}
                                </div>
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setIsSheetOpen(false);
                                router.push("/user/merchant");
                              }}
                            >
                              Toko Saya
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push("/user/followed-merchant")
                              }
                            >
                              Toko Diikuti
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setIsSheetOpen(false);
                                router.push("/profile");
                              }}
                            >
                              Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setIsSheetOpen(false);
                                handleLogout();
                              }}
                              disabled={isPending}
                            >
                              Keluar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <>
                        <BorderButton
                          icon={<DollarCoin />}
                          className="border-primary text-secondary hover:text-secondary cursor-pointer px-4 py-2 text-base font-semibold hover:bg-white"
                        >
                          Cobain
                        </BorderButton>
                        <PrimaryButton
                          className="px-4 py-2"
                          onClick={() => openModal && openModal("default")}
                        >
                          Masuk
                        </PrimaryButton>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};

export default Header;
