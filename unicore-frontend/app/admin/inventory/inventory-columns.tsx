'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';

import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';
import { ip_address } from '@/app/ipconfig';

export type Item = {
  item_id: number
  item_category: string
  item_control: string
  item_quantity: number
  item_measure: string
  item_name: string
  item_desc: string
  item_buy_date: string
  item_buy_cost: number
  item_total: number
  item_remarks: string
  dept_id: number
  dept_name: string
}

export const createColumns = (onDataChange: () => void): ColumnDef<Item>[] => [
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
    accessorKey: 'item_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[25%] min-w-[200px]" title="Name" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('item_name')}</div>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const item = row.original
      const router = useRouter();
      const { toast } = useToast();
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await axios.delete(`http://${ip_address}:8081/items/${item.item_id}`)
          toast({
            title: "Item deleted",
            description: "The item has been successfully deleted.",
          })
          onDataChange()  // Call this function to refresh the data
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the item. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsDeleteDialogOpen(false);  // Close the dialog regardless of the outcome
        }
      }

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
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size="icon" title="Delete Item">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the item from the inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Yes, Delete this Item</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const columns: ColumnDef<Item>[] = createColumns(() => {})