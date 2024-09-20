'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';

export type Item = {
  item_id: number
  item_category: string
  item_control: string
  item_quantity: number
  item_measure: string
  item_name_desc: string
  item_buy_date: string
  item_buy_cost: number
  item_total: number
  item_remarks: string
  dept_id: number
  dept_name: string
}

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'item_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('item_id')}</div>,
  },
  {
    accessorKey: 'item_category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Category" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('item_category')}</div>,
  },
  {
    accessorKey: 'item_control',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Control #" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('item_control')}</div>,
  },
  {
    accessorKey: 'item_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Quantity" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('item_quantity')}</div>,
  },
  {
    accessorKey: 'item_measure',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Measurement" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('item_measure')}</div>
  },
  {
    accessorKey: 'item_name_desc',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[25%] min-w-[200px]" title="Name/s & Description/s" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('item_name_desc')}</div>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const item = row.original
      const router = useRouter();

      return (
        <div className="flex items-center justify-end space-x-2 w-[20%] min-w-[160px]">
          <Button 
            variant='ghost' 
            size="icon" 
            title="View Details"
            onClick={() => router.push(`/admin/inventory/view?id=${item.item_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant='ghost' 
            size="icon" 
            title="Edit Item"
            onClick={() => router.push(`/admin/inventory/edit?id=${item.item_id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant='ghost' size="icon" title="Delete Item">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]