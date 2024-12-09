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

export default function EditServiceItemRequest(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [currentRequestStatus, setCurrentRequestStatus] = useState("");

    const [formData, setFormData] = useState({
        item_id: '',
        item_name: '',
        item_quantity: '',
        item_status: '',
        item_serviced: '',
        rq_quantity: '',
        rq_service_type: '',
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
            const response = await axios.get(`http://${ip_address}:8081/requests/service_item/${requestID}`);
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
            await axios.put(`http://${ip_address}:8081/requests/service_item/${requestID}`, formData);

            //update item status from inventory
            let newItemQuantity: number | null = null; // Variable to hold the new item quantity
            let newItemServiced: number | null = null; // Variable to hold the new item serviced
            let newItemStatus: string | null = null; // Variable to hold the new item status

            switch (formData.rq_status) {
                case "Service Approved":
                    newItemQuantity = parseInt(formData.item_quantity) - parseInt(formData.rq_quantity);
                    newItemServiced = parseInt(formData.item_serviced) + parseInt(formData.rq_quantity);
                    break;
                case "Completed":
                    newItemQuantity = parseInt(formData.item_quantity) + parseInt(formData.rq_quantity);
                    newItemServiced = parseInt(formData.item_serviced) - parseInt(formData.rq_quantity);
                    break;
            }

            if (newItemQuantity != 0) {
                newItemStatus = "Available"
            } else if (newItemQuantity === 0) {
                newItemStatus = "Not Available"
            }

            if (newItemQuantity && newItemStatus) {
                console.log("New Item Quantity: " + newItemQuantity);
                console.log("New Item Status: " + newItemStatus);
                await axios.put(`http://${ip_address}:8081/items/quantity_serviced/${formData.item_id}`, { item_quantity: newItemQuantity, item_serviced: newItemServiced });
                await axios.put(`http://${ip_address}:8081/items/status/${formData.item_id}`, { item_status: newItemStatus });
            }

            // Create notification for the request creator
            await axios.post(`http://${ip_address}:8081/notifications/add`, {
                notif_user_id: formData.rq_create_user_id,
                notif_type: "service_item_update",
                notif_content: `Your request has recevied status update. Click to view details.`,
                notif_related_id: requestID
            });

            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error updating request:', err);
            // You might want to show an error message to the user here
        }
    };

    // function to determine available next statuses
    const getAvailableStatuses = (currentStatus: string) => {
        switch (currentStatus) {
            case "Accepted":
                return ["Accepted", "Pending", "Conflict", "Canceled", "Service Approved"];
            case "Pending":
                return ["Pending", "Service Approved", "Conflict", "Canceled"];
            case "Service Approved":
                return ["Service Approved", "Service in Progress", "Canceled", "Completed"];
            case "Service in Progress":
                return ["Service in Progress", "Service Post-Checks", "Completed"];
            case "Service Post-Checks":
                return ["Service Post-Checks", "Completed"];
            case "Conflict":
                return ["Pending", "Conflict", "Canceled"];
            default:
                return []; // No changes allowed for Completed or Canceled status
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/technical/requests');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-3xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Service Request for Item: Update</CardTitle>
                    <Link href="/technical/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="py-2">
                                <p className="text-blue-800">
                                    Items that are "Not Available" may be due to other requests.<br />
                                    Please check any ongoing requests for this item accordingly.<br />
                                    Adding details to Notes is highly recommended.<br />
                                    Only set the request status as Completed after the service is finished.
                                </p>
                            </ div>
                            <div className="space-y-2">
                                <p><strong>Item Name:</strong> {formData.item_name}</p>
                                <p><strong>Item Status:</strong> {formData.item_status}</p>
                                <p><strong>Requested Quantity:</strong> {formData.rq_quantity}</p>
                                <p><strong>No. of Available Items:</strong> {formData.item_quantity}</p>
                                <p><strong>Service Type:</strong> {formData.rq_service_type}</p>
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