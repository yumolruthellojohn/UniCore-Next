'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';

export default function EditReserveRoomRequest(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [currentRequestStatus, setCurrentRequestStatus] = useState("");

    const [formData, setFormData] = useState({
        room_id: '',
        room_name: '',
        room_status: '',
        rq_create_user_id: '',
        rq_status: '',
        rq_notes: '',
    });

    useEffect(() => {
        if (requestID) {
            fetchRequestData();
        }
    }, [requestID]);


    const fetchRequestData = async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/requests/reserve_room/${requestID}`);
            // Log the response to see what data you're getting
            console.log('Fetched request data:', response.data);
            setFormData(response.data[0]);
            setCurrentRequestStatus(response.data[0].rq_status);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching request data:', error);
            setLoading(false);
        }
    };

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`http://${ip_address}:8081/requests/reserve_room/${requestID}`, formData);

            //update room status from inventory
            let newRoomStatus: string | null = null; // Variable to hold the new item status

            switch (formData.rq_status) {
                case "Reserved":
                    newRoomStatus = "Reserved";
                    break;
                case "Completed":
                    newRoomStatus = "Available";
                    break;
            }

            if (newRoomStatus) {
                console.log(newRoomStatus);
                await axios.put(`http://${ip_address}:8081/rooms/status/${formData.room_id}`, { room_status: newRoomStatus });
            }

            // Create notification for the request creator
            await axios.post(`http://${ip_address}:8081/notifications/add`, {
                notif_user_id: formData.rq_create_user_id,
                notif_type: "reserve_facility_update",
                notif_content: `Your request has recevied status update. Click to view details.`,
                notif_related_id: requestID
            });

            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error updating request:', err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/technical/requests');
    };

    // function to determine available next statuses
    const getAvailableStatuses = (currentStatus: string) => {
        switch (currentStatus) {
            case "Accepted":
                return ["Accepted", "Pending", "Conflict", "Canceled", "Reserved"];
            case "Pending":
                return ["Pending", "Reserved", "Conflict", "Canceled"];
            case "Reserved":
                return ["Reserved", "Completed"];
            case "Conflict":
                return ["Pending", "Conflict", "Canceled"];
            default:
                return []; // No changes allowed for Completed or Canceled status
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-3xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Facility Reservation: Update</CardTitle>
                    <Link href="/technical/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="py-2">
                                <p className="text-blue-800">
                                    Facilities that are Reserved or Not Available may be due to other requests.<br />
                                    Please check any ongoing requests for this room accordingly.<br />
                                    Adding details to Notes is highly recommended.<br />
                                    Only set the request status as Completed after the facility is done being used.
                                </p>
                            </ div>
                            <div className="space-y-2">
                                <p><strong>Facility Name:</strong> {formData.room_name}</p>
                                <p><strong>Facility Status:</strong> {formData.room_status}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_status">Request Status: </Label>
                                <Select 
                                    onValueChange={(value) => handleChange('rq_status', value)} 
                                    value={formData.rq_status} required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableStatuses(currentRequestStatus).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_notes">Notes:</Label>
                                <Textarea
                                    id="rq_notes"
                                    value={formData.rq_notes}
                                    onChange={(e) => handleChange('rq_notes', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Request has been successfully updated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleDialogClose}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}