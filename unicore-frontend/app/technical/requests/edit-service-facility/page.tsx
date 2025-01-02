'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import Image from 'next/image';

interface User {
    user_id: number;
    user_fname: string;
    user_lname: string;
}

export default function EditServiceRoomRequest(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [currentRequestStatus, setCurrentRequestStatus] = useState("");
    const [serviceStaff, setServiceStaff] = useState<User[]>([]);

    const [formData, setFormData] = useState({
        dept_id: '',
        room_id: '',
        room_name: '',
        room_status: '',
        rq_service_type: '',
        rq_create_user_id: '',
        rq_status: '',
        rq_notes: '',
        rq_accept_notes: '',
        rq_service_user_id: '',
        rq_service_user_fname: '',
        rq_service_user_lname: '',
        rq_service_notes: '',
        rq_service_proof: '',
        rq_service_status: ''
    });

    useEffect(() => {
        if (requestID) {
            fetchRequestData();
        }
    }, [requestID]);

    useEffect(() => {
        if (formData.dept_id) {
            fetchServiceStaff();
        }
    }, [formData.dept_id]);

    const fetchRequestData = async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/requests/service_room/${requestID}`);
            console.log('Raw response:', response);
            console.log('Fetched request data:', response.data[0]);
            setFormData(response.data[0]);
            setCurrentRequestStatus(response.data[0].rq_status);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching request data:', error);
            setLoading(false);
        }
    };

    // function to fetch service staff
    const fetchServiceStaff = async () => {
        try {
            console.log('Fetching service staff for dept_id:', formData.dept_id);
            const response = await axios.get(`http://${ip_address}:8081/users/servicestaff/${formData.dept_id}`);
            setServiceStaff(response.data);
            console.log('Service staff:', response.data);
        } catch (error) {
            console.error('Error fetching service staff:', error);
        }
    };

    const handleChange = (name: string, value: string | number) => {
        if (name === 'rq_service_user_id') {
            // Find the selected staff member
            const selectedStaff = serviceStaff.find(staff => staff.user_id === Number(value));
            if (selectedStaff) {
                setFormData(prevState => ({
                    ...prevState,
                    rq_service_user_id: String(value), // Convert to string
                    rq_service_user_fname: selectedStaff.user_fname,
                    rq_service_user_lname: selectedStaff.user_lname
                }));
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: String(value), // Convert to string
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Get the previous request data to check if service staff changed
            const prevResponse = await axios.get(`http://${ip_address}:8081/requests/service_room/${requestID}`);
            const prevData = prevResponse.data[0];

            // Update the request
            await axios.put(`http://${ip_address}:8081/requests/service_room/${requestID}`, formData);

            // Handle service staff notifications
            if (formData.rq_service_user_id) {
                if (!prevData.rq_service_user_id) {
                    // New service staff assigned
                    await axios.post(`http://${ip_address}:8081/notifications/add`, {
                        notif_user_id: formData.rq_service_user_id,
                        notif_type: "service_facility_assigned",
                        notif_content: `You have been assigned to a facility service request for ${formData.room_name}`,
                        notif_related_id: requestID
                    });
                } else if (prevData.rq_service_user_id !== formData.rq_service_user_id) {
                    // Service staff was changed
                    // Notify new staff
                    await axios.post(`http://${ip_address}:8081/notifications/add`, {
                        notif_user_id: formData.rq_service_user_id,
                        notif_type: "service_facility_assigned",
                        notif_content: `You have been assigned to a facility service request for ${formData.room_name}`,
                        notif_related_id: requestID
                    });

                    // Notify previous staff
                    await axios.post(`http://${ip_address}:8081/notifications/add`, {
                        notif_user_id: prevData.rq_service_user_id,
                        notif_type: "service_facility_unassigned",
                        notif_content: `You have been unassigned from the facility service request for ${formData.room_name}`,
                        notif_related_id: requestID
                    });
                }
            }

            //update room status
            let newRoomStatus: string | null = null; // Variable to hold the new item status

            switch (formData.rq_status) {
                case "Service Approved":
                    switch (formData.rq_service_type){
                        case "Maintenance":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Repair":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Installation":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Other":
                            newRoomStatus = "Ongoing Service"
                            break;
                    }
                    break;
                case "Service in Progress":
                    switch (formData.rq_service_type){
                        case "Maintenance":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Repair":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Installation":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Other":
                            newRoomStatus = "Ongoing Service"
                            break;
                    }
                    break;
                case "Service Post-Checks":
                    switch (formData.rq_service_type){
                        case "Maintenance":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Repair":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Installation":
                            newRoomStatus = "Ongoing Service"
                            break;
                        case "Other":
                            newRoomStatus = "Ongoing Service"
                            break;
                    }
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
                notif_type: "service_facility_update",
                notif_content: `Your request has recevied status update. Click to view details.`,
                notif_related_id: requestID
            });

            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error updating request:', err);
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
                return ["Accepted", "Pending", "Conflict", "Canceled", "Service Approved"];
            case "Pending":
                return ["Pending", "Service Approved", "Conflict", "Canceled"];
            case "Service Approved":
                return ["Service Approved", "Service in Progress", "Canceled", "Completed"];
            case "Service in Progress":
                return ["Service in Progress", "Service Post-Checks", "Completed"];
            case "Service Post-Checks":
                return ["Service in Progress", "Service Post-Checks", "Completed"];
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
                    <CardTitle>Service Request for Facility: Update</CardTitle>
                    <Link href="/technical/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="py-2">
                                <p className="text-blue-800">
                                    Facilities that have "Reserved" or "Ongoing Service" status may be due to other requests.<br />
                                    Please check any ongoing requests for this room accordingly.<br />
                                    Only set the request status as Completed after the service is finished.
                                </p>
                            </ div>
                            <div className="space-y-2">
                                <p><strong>Facility Name:</strong> {formData.room_name}</p>
                                <p><strong>Facility Status:</strong> {formData.room_status}</p>
                                <p><strong>Service Type:</strong> {formData.rq_service_type}</p>
                                <p><strong>Requestor's Purpose/Notes:</strong> {formData.rq_notes}</p>
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
                                <Label htmlFor="rq_accept_notes">Your Notes:</Label>
                                <Textarea
                                    id="rq_accept_notes"
                                    value={formData.rq_accept_notes}
                                    onChange={(e) => handleChange('rq_accept_notes', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                {!formData.rq_service_user_id ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="rq_service_user_id">Assign Service Staff:</Label>
                                        <Select 
                                            onValueChange={(value) => handleChange('rq_service_user_id', value)} 
                                            value={formData.rq_service_user_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select service staff" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {serviceStaff.map((staff: any) => (
                                                    <SelectItem key={staff.user_id} value={staff.user_id}>
                                                        {staff.user_fname + " " + staff.user_lname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <Card className="mt-4">
                                        <CardHeader>
                                            <CardTitle>Assigned Service Staff</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <p><strong>Staff Name:</strong> {formData.rq_service_user_fname + " " + formData.rq_service_user_lname}</p>
                                                <p><strong>Service Progress:</strong> {formData.rq_service_status || 'Not started'}</p>
                                                <p><strong>Service Staff's Notes:</strong> {formData.rq_service_notes || 'No notes yet'}</p>
                                                {formData.rq_service_proof && (
                                                    <div>
                                                        <p><strong>Proof of Service:</strong></p>
                                                        <Image 
                                                            src={formData.rq_service_proof} 
                                                            alt="Proof of Service" 
                                                            width={500}
                                                            height={300}
                                                            className="mt-2 max-w-full h-auto rounded-lg"
                                                            style={{ maxHeight: '300px', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button 
                                                variant="outline" 
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent form submission
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        rq_service_user_id: '',
                                                        rq_service_user_fname: '',
                                                        rq_service_user_lname: ''
                                                    }));
                                                }}
                                                type="button"
                                                size="sm"
                                            >
                                                Change Service Staff
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}
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