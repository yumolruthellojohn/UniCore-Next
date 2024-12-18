'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';
import { Eye, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header';

export type User = {
  user_id: number
  user_idnum: number
  user_fname: string
  user_lname: string
  user_email: string
  user_contact: string
  user_type: string
  user_position: string
  dept_id: number
  dept_name: string
  user_status: string
}

export const createColumns = (onDataChange: () => void): ColumnDef<User>[] => [
  {
    accessorKey: 'user_idnum',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="ID Number" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('user_idnum')}</div>,
  },
  {
    accessorKey: 'user_fname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="First Name" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('user_fname')}</div>,
  },
  {
    accessorKey: 'user_lname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="Last Name" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('user_lname')}</div>,
  },
  {
    accessorKey: 'user_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="User Type" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('user_type')}</div>,
  },
  {
    accessorKey: 'user_position',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Position" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('user_position')}</div>,
  },
  {
    accessorKey: 'dept_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[20%] min-w-[160px] hidden md:table-cell" title="Department" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('dept_name')}</div>,
  },
  {
    accessorKey: 'user_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('user_status') as string;
      return (
        <div className={`text-center ${status === 'Activated' ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original
      const router = useRouter();

      return (
        <div className="flex items-center justify-end space-x-2 w-[15%] min-w-[120px]">
          <Button 
            variant='ghost' 
            size="icon" 
            title="View Details"
            onClick={() => router.push(`/admin/accounts/view?id=${user.user_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant='ghost' 
            size="icon" 
            title="Edit User"
            onClick={() => router.push(`/admin/accounts/edit?id=${user.user_id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const columns: ColumnDef<User>[] = createColumns(() => {})
