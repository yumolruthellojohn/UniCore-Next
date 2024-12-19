'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useSession } from 'next-auth/react';
import { ip_address } from '@/app/ipconfig';

interface Room {
    room_id: number;
    room_name: string;
}

interface Department {
    dept_id: number;
    dept_name: string;
}

interface User {
    user_id: number;
    user_fname: string;
    user_lname: string;
}

export default function NewReserveRoom() {
    const { data: session, status } = useSession();
    const router = useRouter();

    console.log('Session status:', status);
    console.log('Session data:', session);

    const today = new Date();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = year + "-" + month + "-" + date;

    const [formData, setFormData] = useState({
        rq_type: 'Reserve Item',
        dept_id: '', // Default to 'None' department
        room_id: '',
        rq_prio_level: 'Moderate', // Default to 'Moderate' priority
        rq_notes: '',
        rq_create_date: currentDate,
        rq_create_user_id: '',
        rq_status: 'Request Submitted'
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    useEffect(() => {
        const fetchRoomDeptData = async () => {
            try {
                const dept_response = await axios.get(`http://${ip_address}:8081/departments`); // Adjust this URL to your actual API endpoint
                setDepartments(dept_response.data);
                const room_response = await axios.get(`http://${ip_address}:8081/rooms`); // Adjust this URL to your actual API endpoint
                setRooms(room_response.data);
                const user_response = await axios.get(`http://${ip_address}:8081/users`); // Adjust this URL to your actual API endpoint
                setUsers(user_response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        };

        fetchRoomDeptData();
    }, []);

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // API call to save the room reservation request
        try {
            await axios.post(`http://${ip_address}:8081/requests/reserve_room/add`, formData);
            console.log('Form submitted:', formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.log(err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/requests'); // Adjust this path to your requests page route
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Room Reservation Request</CardTitle>
                    <Link href="/admin/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rq_create_user_id">Requestor:</Label>
                                <Select onValueChange={(value) => handleChange('rq_create_user_id', value)} defaultValue={formData.rq_create_user_id} required>
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
                                <Label htmlFor="dept_id">Department:</Label>
                                <Select onValueChange={(value) => handleChange('dept_id', value)} defaultValue={formData.dept_id} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.dept_id} value={dept.dept_id.toString()}>
                                                {dept.dept_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room_id">Room:</Label>
                                <Select onValueChange={(value) => handleChange('room_id', value)} defaultValue={formData.room_id} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a room" />
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
                                <Label htmlFor="rq_prio_level">Priority Level:</Label>
                                <Select onValueChange={(value) => handleChange('rq_prio_level', value)} defaultValue={formData.rq_prio_level} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
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
                        <Button type="submit" className="w-full">Submit Request</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Request has been submitted.
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
