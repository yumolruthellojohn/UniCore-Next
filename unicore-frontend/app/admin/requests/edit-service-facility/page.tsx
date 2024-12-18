'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface Room {
    room_id: number;
    room_name: string;
}

interface User {
    user_id: number;
    user_fname: string;
    user_lname: string;
}

export default function EditServiceFacilityConflict() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestId = searchParams.get("id");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [formData, setFormData] = useState({
        room_id: '',
        rq_service_type: '',
        rq_prio_level: '',
        rq_start_date: '',
        rq_end_date: '',
        rq_start_time: '',
        rq_end_time: '',
        rq_notes: '',
        rq_accept_user_id: '',
        rq_status: ''
    });

    // Add currentDate calculation
    const today = new Date();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = year + "-" + month + "-" + date;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch request details and rooms
                const [requestResponse, roomsResponse, userResponse] = await Promise.all([
                    axios.get(`http://${ip_address}:8081/requests/${requestId}`),
                    axios.get(`http://${ip_address}:8081/rooms`),
                    axios.get(`http://${ip_address}:8081/users`)
                ]);
                
                const request = requestResponse.data[0];
                setFormData({
                    room_id: request.room_id.toString(),
                    rq_service_type: request.rq_service_type,
                    rq_prio_level: request.rq_prio_level,
                    rq_start_date: request.rq_start_date,
                    rq_end_date: request.rq_end_date,
                    rq_start_time: request.rq_start_time,
                    rq_end_time: request.rq_end_time,
                    rq_notes: request.rq_notes,
                    rq_accept_user_id: request.rq_accept_user_id,
                    rq_status: request.rq_status
                });
                setRooms(roomsResponse.data);
                setUsers(userResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [requestId]);

    const handleChange = (name: string, value: string) => {
        setFormData(prev => {
            const newState = {
                ...prev,
                [name]: value
            };

            // If priority is set to Urgent, set start date to today
            if (name === 'rq_prio_level' && value === 'Urgent') {
                newState.rq_start_date = currentDate;
            }

            return newState;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // update the request
            await axios.put(`http://${ip_address}:8081/requests/service_room_admin/${requestId}`, formData);
            
            setShowSuccessDialog(true);
        } catch (error) {
            console.error("Error updating request:", error);
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/requests');
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit Facility Service Request</CardTitle>
                    <Link href="/admin/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_id">Facility:</Label>
                                <Select onValueChange={(value) => handleChange('room_id', value)} value={formData.room_id} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a facility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.room_id} value={room.room_id.toString()}>
                                                {room.room_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rq_service_type">Service Type:</Label>
                                <Select onValueChange={(value) => handleChange('rq_service_type', value)} value={formData.rq_service_type} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="Repair">Repair</SelectItem>
                                        <SelectItem value="Installation">Installation</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rq_prio_level">Priority Level:</Label>
                                <Select onValueChange={(value) => handleChange('rq_prio_level', value)} value={formData.rq_prio_level} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rq_start_date">Start Date:</Label>
                                {formData.rq_prio_level === 'Urgent' ? (
                                    <div className="p-2 bg-gray-100 rounded-md">
                                        Today ({currentDate})
                                    </div>
                                ) : (
                                    <Input
                                        type="date"
                                        id="rq_start_date"
                                        value={formData.rq_start_date}
                                        onChange={(e) => handleChange('rq_start_date', e.target.value)}
                                        required
                                    />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rq_end_date">End Date:</Label>
                                <Input
                                    type="date"
                                    id="rq_end_date"
                                    value={formData.rq_end_date}
                                    onChange={(e) => handleChange('rq_end_date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rq_start_time">Start Time:</Label>
                                <Input
                                    type="time"
                                    id="rq_start_time"
                                    value={formData.rq_start_time}
                                    onChange={(e) => handleChange('rq_start_time', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rq_end_time">End Time:</Label>
                                <Input
                                    type="time"
                                    id="rq_end_time"
                                    value={formData.rq_end_time}
                                    onChange={(e) => handleChange('rq_end_time', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="rq_notes">Request Notes:</Label>
                                <Textarea
                                    id="rq_notes"
                                    value={formData.rq_notes}
                                    onChange={(e) => handleChange('rq_notes', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="room_id">Respondent:</Label>
                            <Select onValueChange={(value) => handleChange('rq_accept_user_id', value)} value={formData.rq_accept_user_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.user_id} value={user.user_id.toString()}>
                                            {user.user_fname + " " + user.user_lname}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="room_id">Request Status:</Label>
                            <Select onValueChange={(value) => handleChange('rq_status', value)} value={formData.rq_status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Accepted">Accepted</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Conflict">Conflict</SelectItem>
                                    <SelectItem value="Canceled">Canceled</SelectItem>
                                    <SelectItem value="Service Approved">Service Approved</SelectItem>
                                    <SelectItem value="Service in Progress">Service in Progress</SelectItem>
                                    <SelectItem value="Service Post-Checks">Service Post-Checks</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
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
                            Request has been updated successfully.
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
