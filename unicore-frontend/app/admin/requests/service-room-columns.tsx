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

export type ServiceRoom = {
  rq_id: number
  rq_type: string
  dept_id: number
  dept_name: string
  room_id: number
  room_name: string
  rq_service_type: string
  rq_prio_level: string
  rq_notes: string
  rq_create_date: string
  rq_complete_date: string
  rq_create_user_id: number
  rq_create_user_fname: string
  rq_create_user_lname: string
  rq_accept_user_id: number
  rq_accept_user_fname: string
  rq_accept_user_lname: string
  rq_status: string
}

export const createServiceRoomColumns = (onDataChange: () => void): ColumnDef<ServiceRoom>[] => [
  {
    accessorKey: 'rq_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_id')}</div>,
  },
  {
    accessorKey: 'dept_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Department" />
    ),
    cell: ({ row }) => {
      const dept = row.original;
      return <div className="hidden md:block text-center">{dept.dept_name}</div>
    },
  },
  {
    accessorKey: 'room_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Room Name" />
    ),
    cell: ({ row }) => {
      const room = row.original;
      return <div className="hidden md:block text-center">{room.room_name}</div>
    },
  },

  {
    accessorKey: 'rq_service_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[20%] min-w-[160px]" title="Service Type" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_service_type')}</div>,
  },
  {
    accessorKey: 'rq_prio_level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Priority Level" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_prio_level')}</div>
  },
  {
    accessorKey: 'rq_create_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px] hidden md:table-cell" title="Date Requested" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('rq_create_date')}</div>,
  },
  {
    accessorKey: 'rq_create_user_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Requested By" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <div className="hidden md:block text-center">{`${user.rq_create_user_fname} ${user.rq_create_user_lname}`}</div>
    }
  },
  {
    accessorKey: 'rq_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Status" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_status')}</div>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const service = row.original
      const router = useRouter();
      const { toast } = useToast();
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await axios.delete(`http://${ip_address}:8081/requests/${service.rq_id}`)
          toast({
            title: "Request deleted",
            description: "The request has been successfully deleted.",
          })
          onDataChange()  // Call this function to refresh the data
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the request. Please try again.",
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
            onClick={() => router.push(`/admin/requests/view-service-room?id=${service.rq_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant='ghost' 
            size="icon" 
            title="Edit Request"
            onClick={() => router.push(`/admin/requests/edit?id=${service.rq_id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size="icon" title="Delete Request">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the request.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Yes, Delete this Request</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const serviceRoomColumns: ColumnDef<ServiceRoom>[] = createServiceRoomColumns(() => {})