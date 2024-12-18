'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { ip_address } from '@/app/ipconfig'

export type Schedule = {
  sched_id: number
  sched_user_id: number
  sched_dept_id: number
  sched_days_of_week: string
  sched_time_in: string
  sched_time_out: string
  sched_start_date: string
  sched_end_date: string
  sched_notes: string
  user_fname: string
  user_lname: string
  dept_name: string
}

export const createColumns = (onDataChange: () => void): ColumnDef<Schedule>[] => [
  {
    accessorKey: 'sched_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[10%] min-w-[80px]" title="ID" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('sched_id')}</div>,
  },
  {
    accessorKey: 'user_fname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="Staff Name" />
    ),
    cell: ({ row }) => (
        <div className="text-center">
          {`${row.original.user_fname} ${row.original.user_lname}`}
        </div>
      ),
  },
  {
    accessorKey: 'dept_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="Department" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('dept_name')}</div>,
  },
  {
    accessorKey: 'sched_days_of_week',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="Days" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('sched_days_of_week')}</div>,
  },
  {
    accessorKey: 'schedule_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[15%] min-w-[120px]" title="Time" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {`${row.original.sched_time_in} - ${row.original.sched_time_out}`}
      </div>
    ),
  },
  {
    accessorKey: 'schedule_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-[20%] min-w-[160px]" title="Date Range" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {`${row.original.sched_start_date} to ${row.original.sched_end_date}`}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const schedule = row.original
      const router = useRouter()
      const { toast } = useToast()
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

      const handleDelete = async () => {
        try {
          await axios.delete(`http://${ip_address}:8081/schedules/${schedule.sched_id}`)

          //Create notification for staff
          await axios.post(`http://${ip_address}:8081/notifications/add`, {
            notif_user_id: schedule.sched_user_id,
            notif_type: "schedule_remove",
            notif_content: `Your schedule has been removed.`,
            notif_related_id: schedule.sched_id
        });

          toast({
            title: "Schedule deleted",
            description: "The schedule has been successfully deleted.",
          })
          onDataChange()
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the schedule. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsDeleteDialogOpen(false)
        }
      }

      return (
        <div className="flex items-center justify-end space-x-2 w-[20%] min-w-[160px]">
          <Button 
            variant='ghost' 
            size="icon" 
            title="View Details"
            onClick={() => router.push(`/admin/wschedules/view?id=${schedule.sched_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant='ghost' 
            size="icon" 
            title="Edit Schedule"
            onClick={() => router.push(`/admin/wschedules/edit?id=${schedule.sched_id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size="icon" title="Delete Schedule">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the entire schedule.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Yes, Delete this Schedule</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  }
]

export const columns: ColumnDef<Schedule>[] = createColumns(() => {})
