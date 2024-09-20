"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

interface DataTableFilterProps<TData> {
  table: Table<TData>
  filterColumn: {
    id: string
    title: string
  }
}

export function DataTableFilter<TData>({
  table,
  filterColumn,
}: DataTableFilterProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder={`Filter by ${filterColumn.title}...`}
        value={(table.getColumn(filterColumn.id)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(filterColumn.id)?.setFilterValue(event.target.value)
        }
        className="max-w-[250px] sm:max-w-[400px]"
      />
    </div>
  )
}
