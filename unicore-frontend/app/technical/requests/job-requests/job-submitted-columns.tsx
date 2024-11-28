'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';

export type JobSubmitted = {
  job_id: number
  job_rq_id: number
  job_dept_id: number
  job_create_date: string
  job_custodian_approval: string
  job_cads_approval: string
  job_status: string
  dept_name: string
  // ... other existing fields ...
}

export const createJobSubmittedColumns = (onDataChange: () => void): ColumnDef<JobSubmitted>[] => [
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
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="Date Submitted" />
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
  // ... existing columns ...
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      const jobQueue = row.original

      const handleView = async () => {
        let url;
        if (jobQueue.job_custodian_approval === "Approved" && jobQueue.job_cads_approval === "Approved") {
            url = `/technical/requests/job-requests/view-status?id=${jobQueue.job_id}`; // URL for approved status
        } else if (jobQueue.job_custodian_approval === "Declined" || jobQueue.job_cads_approval === "Declined") {
            url = `/technical/requests/job-requests/view-submitted?id=${jobQueue.job_id}`; // URL for edit view
        } else {
            url = `/technical/requests/job-requests/view?id=${jobQueue.job_id}`; // URL for regular view
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
export const jobQueueColumns: ColumnDef<JobSubmitted>[] = createJobSubmittedColumns(() => {})
