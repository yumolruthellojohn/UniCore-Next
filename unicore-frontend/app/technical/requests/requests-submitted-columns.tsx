'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';


export type RequestSubmitted = {
  rq_id: number
  rq_type: string
  dept_id: number
  dept_name: string
  item_id: number
  item_name: string
  room_id: number
  room_name: string
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

export const createRequestSubmittedColumns = (onDataChange: () => void): ColumnDef<RequestSubmitted>[] => [
  {
    accessorKey: 'rq_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_id')}</div>,
  },
  {
    accessorKey: 'rq_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Type" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_type')}</div>
  },
  {
    accessorKey: 'dept_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Department" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('dept_name')}</div>
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
    accessorKey: 'rq_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px] hidden md:table-cell" title="Status" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('rq_status')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      const requestQueue = row.original

      const handleView = async () => {
        let url;
        switch (requestQueue.rq_type) {
          case "Reserve Item":
            url = `/technical/requests/view-reserve-item-queue?id=${requestQueue.rq_id}`;
            break;
          case "Reserve Facility":
            url = `/technical/requests/view-reserve-facility-queue?id=${requestQueue.rq_id}`;
            break;
          case "Service for Item":
            url = `/technical/requests/view-service-item-queue?id=${requestQueue.rq_id}`;
            break;
          case "Service for Facility":
            url = `/technical/requests/view-service-facility-queue?id=${requestQueue.rq_id}`;
            break;
          default:
            url = `/technical/requests/`; // Fallback URL
        }
        router.push(url);
      }

      return (
        <div className="flex items-center justify-center space-x-2 w-[20%] min-w-[160px]">
          <Button 
            variant='ghost'
            size="icon" 
            title="View Details"
            onClick={handleView}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const requestQueueColumns: ColumnDef<RequestSubmitted>[] = createRequestSubmittedColumns(() => {})