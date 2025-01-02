'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye, Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';

export type RequestAssign = {
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

export const createRequestAssignColumns = (onDataChange: () => void): ColumnDef<RequestAssign>[] => [
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
    accessorKey: 'rq_property_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Property Name" />
    ),
    accessorFn: (row) => {
      return row.rq_type.includes('Item') ? row.item_name : row.room_name;
    },
    cell: ({ row }) => {
      const propertyName = row.getValue('rq_property_name') as string;
      return <div className="hidden md:block text-center">{propertyName}</div>
    }
  },
  {
    accessorKey: 'rq_prio_level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Priority Level" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue('rq_prio_level') as string;
      return (
        <div className={`text-center ${priority === 'Urgent' ? 'text-orange-500' : ''}`}>
          {priority}
        </div>
      );
    }
  },
  {
    accessorKey: 'rq_create_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px] hidden md:table-cell" title="Date Requested" />
    ),
    cell: ({ row }) => <div className="hidden md:block text-center">{row.getValue('rq_create_date')}</div>,
  },
  {
    accessorKey: 'rq_accept_user_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px] hidden md:table-cell" title="Respondent" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <div className="hidden md:block text-center">{`${user.rq_accept_user_fname} ${user.rq_accept_user_lname}`}</div>
    }
  },
  {
    accessorKey: 'rq_service_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Service Status" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('rq_service_status')}</div>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      const requestAssign = row.original

      const handleView = async () => {
        let url;
        switch (requestAssign.rq_type) {
          case "Service for Item":
            url = `/service/requests/view-service-item?id=${requestAssign.rq_id}`;
            break;
          case "Service for Facility":
            url = `/service/requests/view-service-facility?id=${requestAssign.rq_id}`;
            break;
          default:
            url = `/service/requests/`; // Fallback URL
        }
        router.push(url);
      }

      const handleUpdate = async () => {
        let url;
        switch (requestAssign.rq_type) {
          case "Service for Item":
            url = `/service/requests/edit-service-item?id=${requestAssign.rq_id}`;
            break;
          case "Service for Facility":
            url = `/service/requests/edit-service-facility?id=${requestAssign.rq_id}`;
            break;
          default:
            url = `/service/requests/`; // Fallback URL
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
          <Button 
            variant='ghost' 
            size="icon" 
            title="Update Request"
            onClick={handleUpdate}
            disabled={requestAssign.rq_status === "Completed" || requestAssign.rq_status === "Canceled"}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const requestAssignColumns: ColumnDef<RequestAssign>[] = createRequestAssignColumns(() => {})