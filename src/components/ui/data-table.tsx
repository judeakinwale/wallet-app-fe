"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type ColumnDef<TData> = {
  key: string
  header: string
  accessor: keyof TData | ((row: TData) => React.ReactNode)
  className?: string
  headerClassName?: string
}

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  keyExtractor: (row: TData) => string | number
  className?: string
  emptyMessage?: string
  isLoading?: boolean
  onRowClick?: (row: TData) => void
}

function DataTableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 w-full animate-pulse rounded-sm bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function DataTable<TData>({
  columns,
  data,
  keyExtractor,
  className,
  emptyMessage = "No results.",
  isLoading = false,
  onRowClick,
}: DataTableProps<TData>) {
  function getCellValue(row: TData, col: ColumnDef<TData>): React.ReactNode {
    if (typeof col.accessor === "function") return col.accessor(row)
    const value = row[col.accessor as keyof TData]
    return value as React.ReactNode
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-lg border border-border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn("font-semibold text-foreground", col.headerClassName)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <DataTableSkeleton columns={columns.length} />
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={keyExtractor(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {getCellValue(row, col)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export { DataTable }
