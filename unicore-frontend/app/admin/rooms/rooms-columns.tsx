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

export type Room = {
  room_id: number
  room_name: string
  room_desc: string
  room_status: string
  dept_id: number
  dept_name: string
}

export const createColumns = (onDataChange: () => void): ColumnDef<Room>[] => [
  {
    accessorKey: 'room_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[60px]" title="ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('room_id')}</div>,
  },
  {
    accessorKey: 'room_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[60px]" title="Name" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('room_name')}</div>,
  },
  {
    accessorKey: 'room_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[60px]" title="Status" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('room_status')}</div>,
  },
  {
    accessorKey: 'dept_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[20%] min-w-[120px] hidden md:table-cell" title="Department" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('dept_name')}</div>,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[20%] min-w-[120px]" title="Actions" />
    ),
    cell: ({ row }) => {
      const room = row.original
      const router = useRouter();
      const { toast } = useToast();
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await axios.delete(`http://localhost:8081/rooms/${room.room_id}`)
          toast({
            title: "Room deleted",
            description: "The room has been successfully deleted.",
          })
          onDataChange()  // Call this function to refresh the data
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the room. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsDeleteDialogOpen(false);  // Close the dialog regardless of the outcome
        }
      }

      return (
        <div className="flex items-center justify-start space-x-2">
          <Button 
            variant='ghost' 
            size="icon" 
            title="View Details"
            onClick={() => router.push(`/admin/rooms/view?id=${room.room_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant='ghost' 
            size="icon" 
            title="Edit Room"
            onClick={() => router.push(`/admin/rooms/edit?id=${room.room_id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size="icon" title="Delete Room">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the room.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Yes, Delete this Room</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const columns: ColumnDef<Room>[] = createColumns(() => {})