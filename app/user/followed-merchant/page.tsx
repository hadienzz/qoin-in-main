"use client";

import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Merchant } from "@/types";
import useGetFollowedMerchant from "@/hooks/merchant/use-get-followed-merchant";

type FollowedMerchantItemProps = Pick<
  Merchant,
  "id" | "name" | "profilePhotoUrl"
>;

const FollowedMerchantItem = ({
  id,
  name,
  profilePhotoUrl,
}: FollowedMerchantItemProps) => {
  const router = useRouter();

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 pt-6">
        <div
          className="flex items-center gap-4"
          onClick={() => router.push(`/merchant/${id}`)}
        >
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
            <span className="text-muted-foreground text-xs">ID: {id}</span>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/merchant/${id}`)}
          className="text-base text-white"
        >
          Lihat Toko &rarr;
        </Button>
      </CardContent>
    </Card>
  );
};

const FollowedMerchantPage = () => {
  const { data, isLoading } = useGetFollowedMerchant();

  return (
    <Section>
      <PageContainer>
        <Header />
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Merchant yang Diikuti</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="w-48 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data.length > 0 ? (
              <div className="grid gap-3">
                {data.map((merchant: any) => (
                  <FollowedMerchantItem
                    key={merchant.id}
                    id={merchant.id}
                    name={merchant.name}
                    profilePhotoUrl={merchant.profilePhotoUrl}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground lg:text-lg">
                Anda belum mengikuti merchant mana pun.
              </p>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </Section>
  );
};

export default FollowedMerchantPage;
