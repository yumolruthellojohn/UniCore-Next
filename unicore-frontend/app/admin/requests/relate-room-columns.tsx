'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';

export type RoomRequests = {
  rq_id: number
  rq_type: string
  dept_id: number
  dept_name: string
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

export const createRoomRequestsColumns = (): ColumnDef<RoomRequests>[] => [
  {
    accessorKey: 'rq_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Request ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_id')}</div>,
  },
  {
    accessorKey: 'rq_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[20%] min-w-[160px]" title="Request Type" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_type')}</div>,
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
      const reserveItem = row.original
      const router = useRouter();

      return (
        <div className="flex items-center justify-center space-x-2 w-[20%] min-w-[160px]">
          <Button 
            variant='ghost' 
            size="icon" 
            title="View Details"
            onClick={() => router.push(`/admin/requests/view?id=${reserveItem.rq_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]

// Update the original columns export as well
export const roomRequestsColumns: ColumnDef<RoomRequests>[] = createRoomRequestsColumns()