'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye, Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';


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
    cell: ({ row }) => <div>{row.getValue('room_status')}</div>,
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

      return (
        <div className="flex items-center justify-start space-x-2">
          <Button 
            variant='ghost' 
            size="icon" 
            title="View Details"
            onClick={() => router.push(`/technical/facilities/view?id=${room.room_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant='ghost' 
            size="icon" 
            title="Edit Room"
            onClick={() => router.push(`/technical/facilities/edit?id=${room.room_id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const columns: ColumnDef<Room>[] = createColumns(() => {})