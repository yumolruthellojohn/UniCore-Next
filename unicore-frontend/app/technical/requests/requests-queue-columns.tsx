'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation';

import { Eye, CircleCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header';

import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';
import { ip_address } from '@/app/ipconfig';

export type RequestQueue = {
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

export const createRequestQueueColumns = (onDataChange: () => void, currentUserID: number): ColumnDef<RequestQueue>[] => [
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
      //const { data: session, status } = useSession();
      const router = useRouter();
      const requestQueue = row.original
      const { toast } = useToast();
      const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

      const [requestAcceptance, setRequestAcceptance] = useState({
        rq_status: 'Accepted',
        rq_accept_user_id: currentUserID.toString()
      });

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

      const handleUpdate = async () => {
        //console.log('Session status:', status);
        //console.log('Session data:', session);

        //if (status === 'authenticated' && session?.user?.user_id){
          //const newUserId = session.user.user_id.toString();
          //console.log('Setting new user id:', newUserId);
          try {
              /*const id_response = await axios.get(`http://${ip_address}:8081/users/user_id/${newUserId}`); // Adjust this URL to your actual API endpoint
              console.log(id_response.data[0].user_id);
              setRequestAcceptance(prevState => ({
                  ...prevState,
                  rq_accept_user_id: id_response.data[0].user_id,
              }));*/
              let notif_type_new = null;
              switch (requestQueue.rq_type) {
                case "Reserve Item":
                  notif_type_new = "reserve_item_update";
                  break;
                case "Reserve Facility":
                  notif_type_new = "reserve_facility_update";
                  break;
                case "Service for Item":
                  notif_type_new = "service_item_update";
                  break;
                case "Service for Facility":
                  notif_type_new = "service_facility_update";
                  break;
                default:
                  notif_type_new = "undefined";
              }
              
              await axios.put(`http://${ip_address}:8081/requests/accept/${requestQueue.rq_id}`, requestAcceptance);

              // Create notification for the request creator
              await axios.post(`http://${ip_address}:8081/notifications/add`, {
                notif_user_id: requestQueue.rq_create_user_id,
                notif_type: notif_type_new,
                notif_content: `Your request has been accepted. Click to view details.`,
                notif_related_id: requestQueue.rq_id
              });
              
              toast({
                title: "Request accepted",
                description: "You accepted the request and it is now in your workbench.",
              })

              onDataChange()  // Call this function to refresh the data
          } catch (error) {
              toast({
                title: "Error",
                description: "Failed to accept the request. Please try again.",
                variant: "destructive",
              })
              // Handle error (e.g., show error message to user)
          }  finally {
            setIsUpdateDialogOpen(false);  // Close the dialog regardless of the outcome
          }
        //}
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
          <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size="icon" title="Accept Request">
                <CircleCheck className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will accept the request and add it to your workbench.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdate}>Yes, I accept this request</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  }
]

// Keep the original columns export for backward compatibility
//export const requestQueueColumns: ColumnDef<RequestQueue>[] = createRequestQueueColumns(() => {}, currentUserID)