'use client';

import { useState, useEffect, use } from 'react';
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

export default function EditReserveItemRequest(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const [formData, setFormData] = useState({
        item_id: '',
        item_name: '',
        item_quantity: '',
        item_status: '',
        item_reserved: '',
        rq_quantity: '',
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
            const response = await axios.get(`http://${ip_address}:8081/requests/reserve_item/${requestID}`);
            // Log the response to see what data you're getting
            console.log('Fetched request data:', response.data);
            setFormData(response.data[0]);
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
            await axios.put(`http://${ip_address}:8081/requests/reserve_item/${requestID}`, formData);

            //update item quantity and status from inventory

            let newItemQuantity: number | null = null; // Variable to hold the new item quantity
            let newItemReserved: number | null = null; // Variable to hold the new item reserved
            let newItemStatus: string | null = null; // Variable to hold the new item status

            switch (formData.rq_status) {
                case "Reserved: In Use":
                    newItemQuantity = parseInt(formData.item_quantity) - parseInt(formData.rq_quantity);
                    newItemReserved = parseInt(formData.item_reserved) + parseInt(formData.rq_quantity);
                    break;
                case "Completed":
                    newItemQuantity = parseInt(formData.item_quantity) + parseInt(formData.rq_quantity);
                    newItemReserved = parseInt(formData.item_reserved) - parseInt(formData.rq_quantity);
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
                await axios.put(`http://${ip_address}:8081/items/quantity_reserved/${formData.item_id}`, { item_quantity: newItemQuantity, item_reserved: newItemReserved });
                await axios.put(`http://${ip_address}:8081/items/status/${formData.item_id}`, { item_status: newItemStatus });
            }

            // Create notification for the request creator
            await axios.post(`http://${ip_address}:8081/notifications/add`, {
                notif_user_id: formData.rq_create_user_id,
                notif_type: "reserve_item_update",
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-3xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Item Reservation: Update</CardTitle>
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
                                    Only set the request status as Completed after the item is returned.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p><strong>Item Name:</strong> {formData.item_name}</p>
                                <p><strong>Item Status:</strong> {formData.item_status}</p>
                                <p><strong>Requested Quantity:</strong> {formData.rq_quantity}</p>
                                <p><strong>No. of Available Items:</strong> {formData.item_quantity}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_status">Request Status: </Label>
                                <Select onValueChange={(value) => handleChange('rq_status', value)} value={formData.rq_status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Accepted">Accepted</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Conflict">Conflict</SelectItem>
                                        <SelectItem value="Canceled">Canceled</SelectItem>
                                        <SelectItem value="Reserved: For Pickup">Reserved: For Pickup</SelectItem>
                                        <SelectItem value="Reserved: In Use">Reserved: In Use</SelectItem>
                                        <SelectItem value="Reserved: For Return">Reserved: For Return</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
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