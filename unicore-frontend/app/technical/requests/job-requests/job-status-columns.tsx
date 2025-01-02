'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header';
import DownloadJobRequestPDFIcon from './job-request-download-icon';

export type JobStatus = {
  job_id: number
  job_rq_id: number
  job_dept_id: number
  job_create_date: string
  job_status: string
  dept_name: string
  // ... other existing fields ...
}

export const createJobStatusColumns = (onDataChange: () => void): ColumnDef<JobStatus>[] => [
  {
    accessorKey: 'job_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Job ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('job_id')}</div>,
  },
  {
    accessorKey: 'job_rq_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Requisition ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('job_rq_id')}</div>,
  },
  {
    accessorKey: 'dept_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Department" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('dept_name')}</div>,
  },
  {
    accessorKey: 'job_create_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Date Created" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('job_create_date')}</div>,
  },
  {
    accessorKey: 'job_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Status (From BMO)" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('job_status')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      const jobQueue = row.original;

      const handleView = async () => {
        const url = `/technical/requests/job-requests/view-status-edit?id=${jobQueue.job_id}`; // URL for view-status-edit
        router.push(url);
      }

      const handleEdit = async () => {
        const url = `/technical/requests/job-requests/edit-status?id=${jobQueue.job_id}`; // URL for edit-status
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
          <DownloadJobRequestPDFIcon requestId={jobQueue.job_id.toString()} />
          <Button 
            variant='ghost'
            size="icon" 
            title="Update Job Request"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
export const jobStatusColumns: ColumnDef<JobStatus>[] = createJobStatusColumns(() => {})
