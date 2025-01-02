'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ip_address } from '@/app/ipconfig';

export function OverdueServiceRequestsDialog({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [overdueRequests, setOverdueRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOverdueRequests = async () => {
      try {
        const response = await fetch(`http://${ip_address}:8081/requests/service/overdue/${userId.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setOverdueRequests(data);
          if (data.length > 0) {
            setOpen(true);
          }
        }
      } catch (error) {
        console.error('Error fetching overdue service requests:', error);
      }
    };

    fetchOverdueRequests();
  }, [userId]);

  if (overdueRequests.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Overdue Service Requests</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">You have {overdueRequests.length} overdue service requests:</p>
          <div className="space-y-2">
            {overdueRequests.map((request: any) => (
              <div key={request.rq_id} className="p-3 bg-gray-100 rounded-lg">
                <p><strong>Property Name:</strong> {request.resource_name}</p>
                <p><strong>End Date:</strong> {new Date(request.rq_end_date).toLocaleDateString()}</p>
                <p><strong>End Time:</strong> {request.rq_end_time}</p>
                <p><strong>Service Status:</strong> {request.rq_service_status}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => {
              router.push('/service/requests');
              setOpen(false);
            }}>
              Go to Requests
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
