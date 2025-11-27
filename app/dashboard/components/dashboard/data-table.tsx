"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Stock } from "@/types";

type StockRow = Stock & {
  onDelete?: () => void | Promise<void>;
  onEdit?: () => void | Promise<void>;
  onToggleDisplay?: (next: boolean) => void | Promise<void>;
};

interface BaseProps<T> {
  title?: string;
  data: T[] | null | undefined;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends Stock | StockRow>({
  title,
  data,
  emptyMessage = "No data",
  isLoading = false,
}: BaseProps<T>) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Show Display</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={5}>{emptyMessage}</TableCell>
              </TableRow>
            )}
            {Array.isArray(data) &&
              data.map((row, rowIdx) => {
                const rowKey = (row as { id?: string }).id ?? String(rowIdx);
                return (
                  <TableRow key={rowKey}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>
                      {row.price === undefined || row.price === null
                        ? "-"
                        : `Rp ${formatPrice(row.price)}`}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Switch aria-label="Toggle display" />
                        <span className="text-muted-foreground text-xs">
                          Hanya Display
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={(row as StockRow).onDelete}
                          >
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(row as StockRow).onEdit}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
