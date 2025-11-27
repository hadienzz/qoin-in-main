"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";
import { Checkbox } from "@/components/ui/checkbox";

export interface DataTableColumn<T extends object> {
  key: Extract<keyof T, string>;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface BaseProps<T extends object> {
  title?: string;
  columns: Array<DataTableColumn<T>>;
  data: T[] | null | undefined;
  emptyMessage?: string;
  isLoading?: boolean;

  // ✅ props baru untuk selection
  withSelection?: boolean;
  selectedRowIds?: string[];
  onSelectionChange?: (nextSelectedRowIds: string[]) => void;
  getRowId?: (row: T) => string;

  // ✅ props baru untuk aksi per-row / bulk
  onDeleteRows?: (ids: string[]) => void;
  onEditRow?: (id: string, row: T) => void;
}

export function DataTable<T extends object>({
  title,
  columns,
  data,
  emptyMessage = "No data",
  isLoading = false,
  withSelection = false,
  selectedRowIds = [],
  onSelectionChange,
  getRowId,
  onDeleteRows,
  onEditRow,
}: BaseProps<T>) {
  const safeData: T[] = Array.isArray(data) ? data : [];
  const totalColumns = columns.length + 1 + (withSelection ? 1 : 0); // data cols + action + (optional) checkbox

  const resolveRowId = (row: T, rowIndex: number): string => {
    if (getRowId) return getRowId(row);
    const fallbackId = (row as { id?: string }).id;
    return fallbackId ?? String(rowIndex);
  };

  const areAllSelected =
    safeData.length > 0 &&
    safeData.every((row, index) =>
      selectedRowIds.includes(resolveRowId(row, index)),
    );

  const handleToggleAll = () => {
    if (!onSelectionChange) return;

    if (areAllSelected) {
      onSelectionChange([]);
    } else {
      const allIds = safeData.map((row, index) => resolveRowId(row, index));
      onSelectionChange(allIds);
    }
  };

  const handleToggleRow = (
    rowId: string,
    checked: boolean | "indeterminate",
  ) => {
    if (!onSelectionChange) return;

    if (checked) {
      const nextSelectedRowIds = Array.from(
        new Set([...selectedRowIds, rowId]),
      );
      onSelectionChange(nextSelectedRowIds);
    } else {
      const nextSelectedRowIds = selectedRowIds.filter(
        (existingRowId) => existingRowId !== rowId,
      );
      onSelectionChange(nextSelectedRowIds);
    }
  };

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
              {withSelection && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={areAllSelected}
                    onCheckedChange={handleToggleAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={totalColumns}>Loading...</TableCell>
              </TableRow>
            )}

            {!isLoading && safeData.length === 0 && (
              <TableRow>
                <TableCell colSpan={totalColumns}>{emptyMessage}</TableCell>
              </TableRow>
            )}

            {!isLoading &&
              safeData.map((row, rowIndex) => {
                const rowId = resolveRowId(row, rowIndex);
                const isSelected = selectedRowIds.includes(rowId);

                return (
                  <TableRow key={rowId}>
                    {withSelection && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleToggleRow(rowId, checked)
                          }
                          aria-label="Select row"
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const rawValue = row[column.key as keyof T];
                      const isPriceColumn = /price/i.test(column.key);

                      const displayValue = (() => {
                        if (column.render) return column.render(rawValue, row);
                        if (isPriceColumn) {
                          const numericValue =
                            typeof rawValue === "number" ||
                            typeof rawValue === "string"
                              ? rawValue
                              : "";
                          return numericValue === ""
                            ? "-"
                            : `Rp ${formatPrice(numericValue)}`;
                        }
                        return String(rawValue ?? "-");
                      })();

                      return (
                        <TableCell key={`${rowIndex}-${String(column.key)}`}>
                          {displayValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
