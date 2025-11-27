"use client";

import {
  BarChart3,
  ShoppingCart,
  Package,
  TrendingUp,
  ItalicIcon as AnalyticsIcon,
  Settings,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useGetUserMerchant from "@/hooks/merchant/use-get-user-merchant";
import useDeleteMerchant from "@/hooks/merchant/use-delete-merchant";
import { DeleteMerchantDialog } from "./delete-merchant-dialog";

type PageId = "overview" | "pos" | "inventory" | "sales" | "analytics";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: PageId) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { merchant } = useGetUserMerchant();
  const { deleteMerchant, isDeletingMerchant } = useDeleteMerchant();

  const currentMerchant = merchant?.data?.[0];

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentMerchant) return;
    await deleteMerchant(currentMerchant.id);
    setIsDeleteOpen(false);
  };

  const menuItems: Array<{
    id: PageId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "pos", label: "POS", icon: ShoppingCart },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "analytics", label: "Analytics", icon: AnalyticsIcon },
  ];

  return (
    <aside className="bg-card border-border flex h-screen w-64 flex-col border-r">
      {/* Header */}
      <div className="border-border border-b p-6">
        <h1 className="text-foreground text-2xl font-bold">Merchant</h1>
        <p className="text-muted-foreground text-sm">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              variant={isActive ? "default" : "link"}
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 cursor-pointer">
        <div
          className="group flex items-center gap-3 rounded-md hover:bg-slate-200 p-4"
          onClick={handleDeleteClick}
        >
          <Trash className="size-5 group-hover:text-red-600" />
          <p>Delete Merchant</p>
        </div>
      </div>
      {/* Footer */}
      <div className="border-border border-t p-4">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-primary w-full justify-start gap-3"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">Settings</span>
        </Button>
      </div>

      {currentMerchant && (
        <DeleteMerchantDialog
          isOpen={isDeleteOpen}
          merchantName={currentMerchant.name}
          isDeleting={isDeletingMerchant}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </aside>
  );
}
