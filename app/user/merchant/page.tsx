"use client";

import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUserMerchant from "@/hooks/merchant/use-get-user-merchant";
import Image from "next/image";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Merchant } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type MerchantItemProps = Pick<
  Merchant,
  "id" | "name" | "profilePhotoUrl" | "user_id"
>;

const MerchantItem = ({ id, name, profilePhotoUrl }: MerchantItemProps) => {
  const router = useRouter();
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="items-center justify-between gap-4 pt-6 lg:flex">
        <div className="flex items-center gap-4">
          <div className="bg-muted relative h-14 w-14 overflow-hidden rounded-full">
            <Image
              src={profilePhotoUrl ?? "/images/profile-img.png"}
              alt={`Merchant ${name}`}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-semibold">{name}</span>
            <span className="text-muted-foreground hidden text-xs lg:block">
              ID: {id}
            </span>
          </div>
        </div>
        <div className="mt-5 w-full space-y-4 space-x-4 lg:w-auto">
          <Button
            onClick={() => router.push(`/merchant/${id}`)}
            className="w-full text-base text-white"
          >
            Lihat Toko →
          </Button>

          <Button
            onClick={() => router.push(`/dashboard/${id}`)}
            className="flex w-full text-base text-white lg:w-auto"
          >
            Lihat Dashboard →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MyMerchantPage = () => {
  const { merchant, isLoading } = useGetUserMerchant();
  const router = useRouter();

  const merchants: Merchant[] = useMemo(() => {
    if (!merchant) return [];
    if (Array.isArray(merchant)) return merchant as Merchant[];

    const maybeWithData = merchant as { data?: Merchant | Merchant[] };

    if (Array.isArray(maybeWithData.data)) {
      return maybeWithData.data as Merchant[];
    }

    if (maybeWithData.data) {
      return [maybeWithData.data as Merchant];
    }

    return [merchant as Merchant];
  }, [merchant]);

  return (
    <Section>
      <PageContainer>
        <Header />
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">My Merchant Page</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="w-48 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ) : merchants.length > 0 ? (
              <div className="grid gap-3">
                {merchants.map((m) => (
                  <MerchantItem
                    key={m.id}
                    id={m.id}
                    name={m.name}
                    profilePhotoUrl={m.profilePhotoUrl}
                    user_id={m.user_id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground lg:text-lg">
                <p>Anda tidak mempunyai toko, silahkan daftar disini</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/merchant/onboarding")}
                >
                  Daftar Toko
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </Section>
  );
};

export default MyMerchantPage;
